import keycloak from '@/shared/auth/keycloak'

/**
 * Realiza el cierre de sesión en Keycloak redirigiendo al endpoint OIDC logout.
 *
 * Construye la URL manualmente para garantizar que post_logout_redirect_uri no
 * tenga trailing slash y evitar inconsistencias con versiones recientes de keycloak-js.
 */
export function doLogout(redirectUri?: string): void {
  const targetRedirectUri = (redirectUri ?? window.location.origin).replace(/\/$/, '')
  const idToken = keycloak.idToken
  const base = (
    keycloak.authServerUrl ??
    window.__APP_CONFIG__?.KEYCLOAK_URL ??
    (import.meta.env.VITE_KEYCLOAK_URL as string | undefined) ??
    'https://sso.hro.gob.gt'
  ).replace(/\/+$/, '')

  const realm =
    keycloak.realm ??
    window.__APP_CONFIG__?.KEYCLOAK_REALM ??
    (import.meta.env.VITE_KEYCLOAK_REALM as string | undefined) ??
    'Hospital-O'

  const clientId =
    keycloak.clientId ??
    window.__APP_CONFIG__?.KEYCLOAK_CLIENT ??
    (import.meta.env.VITE_KEYCLOAK_CLIENT as string | undefined) ??
    'sistema-actas-frontend'

  let url = `${base}/realms/${realm}/protocol/openid-connect/logout`
    + `?client_id=${encodeURIComponent(clientId)}`
    + `&post_logout_redirect_uri=${encodeURIComponent(targetRedirectUri)}`

  if (idToken) {
    url += `&id_token_hint=${encodeURIComponent(idToken)}`
  }

  window.location.href = url
}

export default doLogout
