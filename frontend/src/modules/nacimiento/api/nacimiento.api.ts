import api from '@/shared/api/axios'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { InformeNacimientoDTO, InformeNacimientoListDTO } from '../types/nacimiento.types'

export const nacimientoApi = {
  buscar: async (params: {
    search?: string
    estado?: string
    page?: number
    size?: number
  }): Promise<PageResponse<InformeNacimientoListDTO>> => {
    const res = await api.get<ApiResponse<PageResponse<InformeNacimientoListDTO>>>(
      '/nacimientos',
      { params }
    )
    return res.data.data
  },

  obtenerPorId: async (id: number): Promise<InformeNacimientoDTO> => {
    const res = await api.get<ApiResponse<InformeNacimientoDTO>>(`/nacimientos/${id}`)
    return res.data.data
  },

  crear: async (dto: InformeNacimientoDTO): Promise<InformeNacimientoDTO> => {
    const res = await api.post<ApiResponse<InformeNacimientoDTO>>('/nacimientos', dto)
    return res.data.data
  },

  actualizar: async (id: number, dto: InformeNacimientoDTO): Promise<InformeNacimientoDTO> => {
    const res = await api.put<ApiResponse<InformeNacimientoDTO>>(`/nacimientos/${id}`, dto)
    return res.data.data
  },

  cambiarEstado: async (id: number, estado: string): Promise<InformeNacimientoDTO> => {
    const res = await api.patch<ApiResponse<InformeNacimientoDTO>>(
      `/nacimientos/${id}/estado`,
      null,
      { params: { estado } }
    )
    return res.data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/nacimientos/${id}`)
  },
}
