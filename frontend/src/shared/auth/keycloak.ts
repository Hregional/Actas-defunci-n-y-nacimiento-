import Keycloak from 'keycloak-js'

/**
 * Configuración de Keycloak.
 *
 * Prioridad (de mayor a menor):
 * 1. window.__APP_CONFIG__  — inyectado por docker-entrypoint.sh en producción
 * 2. import.meta.env.VITE_* — disponible en `npm run dev` vía .env.local
 * 3. Valores por defecto hardcodeados
 *
 * Esto permite cambiar la configuración en producción sin reconstruir el bundle.
 */

declare global {
  interface Window {
    __APP_CONFIG__?: {
      KEYCLOAK_URL?:    string
      KEYCLOAK_REALM?:  string
      KEYCLOAK_CLIENT?: string
    }
  }
}

function cfg(key: keyof NonNullable<Window['__APP_CONFIG__']>, envKey: string, fallback: string): string {
  return window.__APP_CONFIG__?.[key] ?? (import.meta.env[envKey] as string | undefined) ?? fallback
}

const keycloak = new Keycloak({
  url:      cfg('KEYCLOAK_URL',    'VITE_KEYCLOAK_URL',    'https://sso.hro.gob.gt'),
  realm:    cfg('KEYCLOAK_REALM',  'VITE_KEYCLOAK_REALM',  'Hospital-O'),
  clientId: cfg('KEYCLOAK_CLIENT', 'VITE_KEYCLOAK_CLIENT', 'sistema-actas-frontend'),
})

export default keycloak
