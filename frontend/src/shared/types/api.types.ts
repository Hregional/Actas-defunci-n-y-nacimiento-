export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  errors?: unknown
  timestamp: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
}

export type EstadoInforme = 'BORRADOR' | 'COMPLETADO' | 'ENVIADO'
