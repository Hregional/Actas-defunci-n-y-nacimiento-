import keycloak from '@/shared/auth/keycloak'

/**
 * Logout centralizado compatible con Keycloak 18+.
 *
 * Construye la URL del endpoint de logout manualmente para garantizar:
 * - post_logout_redirect_uri SIN trailing slash (Keycloak es estricto)
 * - id_token_hint incluido (Keycloak 18+ lo requiere para validar el redirect)
 *
 * NO usar keycloak.logout() directamente porque la librería añade
 * trailing slash al redirectUri ignorando el valor que le pasamos.
 */
export function doLogout(): void {
  const redirectUri = window.location.origin.replace(/\/+$/, '')
  const idToken     = keycloak.idToken
  const base        = (keycloak.authServerUrl ?? 'https://sso.hro.gob.gt').replace(/\/+$/, '')
  const realm       = keycloak.realm    ?? 'Hospital-O'
  const clientId    = keycloak.clientId ?? 'sistema-actas-frontend'

  console.log('[doLogout] redirectUri:', redirectUri, '| idToken presente:', !!idToken)
  let url = `${base}/realms/${realm}/protocol/openid-connect/logout`
    + `?client_id=${encodeURIComponent(clientId)}`
    + `&post_logout_redirect_uri=${encodeURIComponent(redirectUri)}`
  if (idToken) url += `&id_token_hint=${idToken}`
  console.log('[doLogout] URL final:', url)

  window.location.href = url
}
