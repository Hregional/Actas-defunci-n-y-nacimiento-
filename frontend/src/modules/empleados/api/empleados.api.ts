import api from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/types/api.types'
import type { EmpleadoRhDTO } from '../types/empleado.types'

/**
 * Llama al proxy del backend (`GET /api/empleados-rh`).
 * El backend a su vez autentica con Keycloak y consulta la API de RH.
 */
export const empleadosApi = {
  /**
   * Lista todos los empleados activos.
   * @param q Texto de búsqueda opcional para filtrar por nombre (autocompletar).
   */
  listar: async (q?: string): Promise<EmpleadoRhDTO[]> => {
    const res = await api.get<ApiResponse<EmpleadoRhDTO[]>>('/empleados-rh', {
      params: q && q.trim().length > 0 ? { q: q.trim() } : undefined,
    })
    return res.data.data ?? []
  },

  /**
   * Obtiene un empleado por su ID del sistema de RH.
   */
  obtenerPorId: async (id: number): Promise<EmpleadoRhDTO> => {
    const res = await api.get<ApiResponse<EmpleadoRhDTO>>(`/empleados-rh/${id}`)
    return res.data.data
  },

  /**
   * Busca el empleado del usuario logueado por DPI,
   * enviando su propio token Bearer a la API de asistencia.
   * Esto devuelve datos reales y actualizados en tiempo real.
   */
  obtenerMiEmpleadoPorDpi: async (dpi: string): Promise<EmpleadoRhDTO> => {
    const res = await api.get<ApiResponse<EmpleadoRhDTO>>(`/empleados-rh/me/${dpi}`)
    return res.data.data
  },
}
