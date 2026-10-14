import api from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/types/api.types'

export interface IcdResultadoDTO {
  /** Código CIE-11 de clasificación, ej. "BA41.Z" */
  codigo: string
  /** Título de la entidad sin etiquetas HTML */
  titulo: string
  /** URI de la entidad en la linearización MMS */
  uri: string | null
}

/**
 * Llama al proxy del backend (`GET /api/icd/buscar`).
 * El backend consulta la API ICD de OpenHIM con sus propias credenciales.
 */
export const icdApi = {
  buscar: async (q: string): Promise<IcdResultadoDTO[]> => {
    const res = await api.get<ApiResponse<IcdResultadoDTO[]>>('/icd/buscar', { params: { q } })
    return res.data.data ?? []
  },
}
