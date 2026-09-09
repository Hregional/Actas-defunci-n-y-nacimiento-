import api from '@/shared/api/axios'
import type { ApiResponse } from '@/shared/types/api.types'

export interface ResumenDTO {
  totalNacimientos: number
  totalDefunciones: number
  totalGeneral: number
  anioActual: number
  mesActual: string
}

export interface EstadisticasMesDTO {
  periodo: string      // "Ene", "Feb"... o "Lun", "Mar"...
  nacimientos: number
  defunciones: number
}

export const estadisticasApi = {
  resumen: async (): Promise<ResumenDTO> => {
    const res = await api.get<ApiResponse<ResumenDTO>>('/estadisticas/resumen')
    return res.data.data
  },

  porMes: async (anio?: number): Promise<EstadisticasMesDTO[]> => {
    const res = await api.get<ApiResponse<EstadisticasMesDTO[]>>('/estadisticas/por-mes', {
      params: anio ? { anio } : {},
    })
    return res.data.data
  },

  ultimaSemana: async (): Promise<EstadisticasMesDTO[]> => {
    const res = await api.get<ApiResponse<EstadisticasMesDTO[]>>('/estadisticas/ultima-semana')
    return res.data.data
  },
}
