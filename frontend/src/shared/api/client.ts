/**
 * Cliente HTTP para llamadas a la API.
 * Re-exporta la instancia de axios configurada con interceptores de autenticación.
 */
import api from './axios'

export const apiClient = api
