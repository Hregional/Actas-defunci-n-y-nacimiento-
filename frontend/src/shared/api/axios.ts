import axios from 'axios'
import keycloak from '@/shared/auth/keycloak'
import { doLogout } from '@/shared/auth/logout'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000, // 10 segundos — más rápido para fallar y mostrar error
})

// ── Request interceptor: adjunta el token Bearer ──────────────────────────────
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated && keycloak.token) {
      try {
        // Intenta refrescar si expira en menos de 30 s.
        // Si el usuario regresó después de inactividad larga, el token puede
        // estar vencido — updateToken lo renueva silenciosamente usando el
        // refresh_token (que dura más que el access_token).
        await keycloak.updateToken(30)
      } catch {
        // El refresh_token también expiró (sesión muy larga).
        // Solo hacer logout si la sesión estaba activa, para evitar loops.
        if (keycloak.didInitialize && keycloak.authenticated) {
          doLogout()
        }
        return Promise.reject(new Error('Sesión expirada'))
      }
      config.headers.Authorization = `Bearer ${keycloak.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: manejo de errores globales ─────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Errores de red o timeout (backend no disponible)
    if (!error.response) {
      // Error de red (ECONNREFUSED, ETIMEDOUT, etc.) o timeout
      const message = error.code === 'ECONNABORTED'
        ? 'El servidor está tardando demasiado en responder. Reintentando...'
        : 'No se puede conectar con el servidor. Verificando disponibilidad...'
      console.warn('[API] Error de conexión:', error.message)
      return Promise.reject(new Error(message))
    }

    // Error 401 - No autorizado
    if (error.response.status === 401) {
      // Solo hacer logout si hay una sesión activa.
      // Evita el loop: 401 -> doLogout -> redirect -> 401 -> doLogout...
      if (keycloak.didInitialize && keycloak.authenticated) {
        doLogout()
      }
    }

    // Error 404 - No encontrado (incluir código en el mensaje para detectarlo en hooks)
    if (error.response.status === 404) {
      const message = `404: ${error.response?.data?.message || 'Registro no encontrado'}`
      return Promise.reject(new Error(message))
    }

    // Otros errores HTTP
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors ||
      error.message ||
      'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  },
)

export default api
