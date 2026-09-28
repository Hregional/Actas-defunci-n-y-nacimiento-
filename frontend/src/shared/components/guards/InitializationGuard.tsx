/**
 * InitializationGuard - Garantiza que el sistema esté completamente inicializado
 * antes de permitir navegación a rutas internas.
 * 
 * Previene errores cuando:
 * - El navegador guarda una ruta profunda (ej: /nacimientos/nuevo)
 * - Se refresca y el backend aún no está listo
 * - El usuario no está completamente autenticado
 * 
 * Buenas prácticas:
 * - No permitir acceso a rutas si el sistema no está listo
 * - Mostrar feedback claro al usuario
 * - Redirigir automáticamente cuando esté listo
 */
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'
import { useKeycloak } from '@/shared/context/KeycloakContext'
import { useCurrentUser } from '@/shared/context/UserContext'

interface InitializationGuardProps {
  children: React.ReactNode
}

export default function InitializationGuard({ children }: InitializationGuardProps) {
  const { authenticated, initialized } = useKeycloak()
  const { usuario } = useCurrentUser()
  const location = useLocation()
  const navigate = useNavigate()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Esperar a que Keycloak y el usuario estén listos
    if (!initialized || !authenticated || usuario.cargando) {
      setIsReady(false)
      return
    }

    // Sistema listo - permitir navegación
    setIsReady(true)

    // Si estamos en una ruta profunda y acabamos de inicializar,
    // verificar que sea una ruta válida. Si no, redirigir al dashboard.
    const isDeepRoute = location.pathname !== '/' && location.pathname !== ''
    if (isDeepRoute) {
      console.log('[InitGuard] Sistema inicializado en ruta profunda:', location.pathname)
      // Permitir la navegación - el routing normal manejará rutas inválidas
    }
  }, [initialized, authenticated, usuario.cargando, location.pathname])

  // Mostrar pantalla de inicialización
  if (!isReady) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 3,
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Box textAlign="center">
          <Typography variant="h5" fontWeight={700} gutterBottom color="primary">
            Iniciando sistema
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!initialized ? 'Verificando autenticación...' :
             !authenticated ? 'Esperando inicio de sesión...' :
             usuario.cargando ? 'Cargando perfil de usuario...' :
             'Preparando entorno...'}
          </Typography>
        </Box>
        
        {/* Mostrar alerta si tarda más de 10 segundos */}
        {!initialized && (
          <Alert severity="info" sx={{ maxWidth: 500, mt: 2 }}>
            Si el sistema tarda demasiado en cargar, verifica que el backend esté en ejecución.
          </Alert>
        )}
      </Box>
    )
  }

  // Sistema listo - renderizar rutas normales
  return <>{children}</>
}
