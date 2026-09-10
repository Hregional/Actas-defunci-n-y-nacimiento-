import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { Box, CircularProgress, Typography, Button, Alert } from '@mui/material'
import keycloak from '@/shared/auth/keycloak'

interface KeycloakContextValue {
  /** true si Keycloak terminó de inicializar */
  initialized: boolean
  /** true si hay una sesión activa */
  authenticated: boolean
  /** Token JWT crudo (Bearer) */
  token: string | undefined
  /** Datos parseados del token */
  tokenParsed: Record<string, unknown> | undefined
  /** Cierra la sesión en Keycloak */
  logout: () => void
  /** Fuerza refresco del token */
  updateToken: () => Promise<boolean>
}

const KeycloakContext = createContext<KeycloakContextValue>({
  initialized:  false,
  authenticated: false,
  token:        undefined,
  tokenParsed:  undefined,
  logout:       () => {},
  updateToken:  () => Promise.resolve(false),
})

export function KeycloakProvider({ children }: { children: ReactNode }) {
  const [initialized,  setInitialized]  = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [keycloakError, setKeycloakError] = useState<string | null>(null)

  useEffect(() => {
    // Evitar doble inicialización en StrictMode
    if (keycloak.didInitialize) {
      setInitialized(true)
      setAuthenticated(keycloak.authenticated ?? false)
      return
    }

    keycloak
      .init({
        onLoad:           'login-required',   // redirige al login si no hay sesión
        checkLoginIframe: false,              // evita problemas de CORS con iframes
        pkceMethod:       'S256',             // recomendado para SPAs
      })
      .then((auth) => {
        console.info('[Keycloak] init resultado:', auth)
        console.info('[Keycloak] tokenParsed:', JSON.stringify(keycloak.tokenParsed))
        setAuthenticated(auth)
        setInitialized(true)

        // Refrescar el token 60 s antes de que expire
        if (auth) {
          setInterval(() => {
            keycloak.updateToken(60).catch(() => {
              console.warn('[Keycloak] No se pudo refrescar el token — cerrando sesión')
              keycloak.logout()
            })
          }, 30_000)
        }
      })
      .catch((err) => {
        console.error('[Keycloak] Error al inicializar:', err)
        const msg = err instanceof Error ? err.message : JSON.stringify(err)
        setKeycloakError(`No se pudo conectar con el servidor de autenticación. Verifica que Keycloak esté disponible y que el client "sistema-actas-frontend" esté configurado correctamente.\n\nDetalle: ${msg}`)
        setInitialized(true)
      })
  }, [])

  // Pantalla de error cuando Keycloak no pudo inicializar
  if (initialized && keycloakError) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 4,
          bgcolor: 'background.default',
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 560, width: '100%', whiteSpace: 'pre-line' }}>
          <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
            Error de autenticación
          </Typography>
          {keycloakError}
        </Alert>
        <Button
          variant="contained"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 560, textAlign: 'center' }}>
          Si el problema persiste, verifica que el client <strong>sistema-actas-frontend</strong> exista
          en el realm <strong>Hospital-O</strong> y que las Valid redirect URIs incluyan esta URL.
        </Typography>
      </Box>
    )
  }

  // Mientras inicializa, muestra pantalla de carga
  if (!initialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">
          Iniciando sesión…
        </Typography>
      </Box>
    )
  }

  return (
    <KeycloakContext.Provider
      value={{
        initialized,
        authenticated,
        token:       keycloak.token,
        tokenParsed: keycloak.tokenParsed as Record<string, unknown> | undefined,
        logout:      () => {
          const redirectUri = window.location.origin.replace(/\/$/, ''); // sin slash final
          const idToken     = keycloak.idToken; // guardar ANTES de que logout lo limpie
          const base        = (keycloak.authServerUrl ?? 'https://sso.hro.gob.gt').replace(/\/+$/, '');
          const realm       = keycloak.realm    ?? 'Hospital-O';
          const clientId    = keycloak.clientId ?? 'sistema-actas-frontend';

          // Construir la URL manualmente — keycloak-js v26 a veces añade trailing
          // slash al post_logout_redirect_uri ignorando el valor que le pasamos.
          // Construyéndola nosotros tenemos control total del valor exacto.
          let url = `${base}/realms/${realm}/protocol/openid-connect/logout`
            + `?client_id=${encodeURIComponent(clientId)}`
            + `&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`;
          if (idToken) url += `&id_token_hint=${idToken}`;

          window.location.href = url;
        },
        updateToken: () => keycloak.updateToken(60),
      }}
    >{}
      {children}
    </KeycloakContext.Provider>
  )
}

export const useKeycloak = () => useContext(KeycloakContext)

// Exportar la instancia de keycloak para uso directo (e.g., en llamadas fetch)
export { keycloak }
