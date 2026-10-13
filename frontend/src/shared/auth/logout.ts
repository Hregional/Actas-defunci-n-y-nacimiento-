import keycloak from './keycloak'

/**
 * Cierra la sesión de Keycloak y redirige al usuario
 */
export function doLogout() {
  keycloak.logout({
    redirectUri: window.location.origin
  })
}
