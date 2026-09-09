import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nacimientoApi } from '../api/nacimiento.api'
import type { InformeNacimientoDTO } from '../types/nacimiento.types'

const QUERY_KEY = 'nacimientos'

export function useNacimientoList(params: {
  search?: string
  estado?: string
  page?: number
  size?: number
}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => nacimientoApi.buscar(params),
  })
}

export function useNacimientoById(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => nacimientoApi.obtenerPorId(id!),
    enabled: !!id,
  })
}

export function useCrearNacimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: InformeNacimientoDTO) => nacimientoApi.crear(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useActualizarNacimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: InformeNacimientoDTO }) =>
      nacimientoApi.actualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useCambiarEstadoNacimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      nacimientoApi.cambiarEstado(id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useEliminarNacimiento() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => nacimientoApi.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
