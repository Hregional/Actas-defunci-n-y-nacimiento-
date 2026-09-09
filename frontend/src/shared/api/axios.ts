import axios from 'axios'
import keycloak from '@/shared/auth/keycloak'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
})

// ── Request interceptor: adjunta el token Bearer de Keycloak ─────────────────
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated && keycloak.token) {
      // Intenta refrescar si expira en menos de 30 s
      try {
        await keycloak.updateToken(30)
      } catch {
        keycloak.logout()
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
    if (error.response?.status === 401) {
      keycloak.logout()
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors ||
      error.message ||
      'Error de conexión con el servidor'
    return Promise.reject(new Error(message))
  },
)

export default api
