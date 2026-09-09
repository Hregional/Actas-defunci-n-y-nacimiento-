import api from '@/shared/api/axios'
import type { ApiResponse, PageResponse } from '@/shared/types/api.types'
import type { InformeDefuncionDTO, InformeDefuncionListDTO } from '../types/defuncion.types'

export const defuncionApi = {
  buscar: async (params: {
    search?: string
    estado?: string
    page?: number
    size?: number
  }): Promise<PageResponse<InformeDefuncionListDTO>> => {
    const res = await api.get<ApiResponse<PageResponse<InformeDefuncionListDTO>>>(
      '/defunciones',
      { params }
    )
    return res.data.data
  },

  obtenerPorId: async (id: number): Promise<InformeDefuncionDTO> => {
    const res = await api.get<ApiResponse<InformeDefuncionDTO>>(`/defunciones/${id}`)
    return res.data.data
  },

  crear: async (dto: InformeDefuncionDTO): Promise<InformeDefuncionDTO> => {
    const res = await api.post<ApiResponse<InformeDefuncionDTO>>('/defunciones', dto)
    return res.data.data
  },

  actualizar: async (id: number, dto: InformeDefuncionDTO): Promise<InformeDefuncionDTO> => {
    const res = await api.put<ApiResponse<InformeDefuncionDTO>>(`/defunciones/${id}`, dto)
    return res.data.data
  },

  cambiarEstado: async (id: number, estado: string): Promise<InformeDefuncionDTO> => {
    const res = await api.patch<ApiResponse<InformeDefuncionDTO>>(
      `/defunciones/${id}/estado`,
      null,
      { params: { estado } }
    )
    return res.data.data
  },

  eliminar: async (id: number): Promise<void> => {
    await api.delete(`/defunciones/${id}`)
  },
}
