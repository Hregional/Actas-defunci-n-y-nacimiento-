import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { defuncionApi } from '../api/defuncion.api'
import type { InformeDefuncionDTO } from '../types/defuncion.types'

const QUERY_KEY = 'defunciones'

export function useDefuncionList(params: {
  search?: string
  estado?: string
  page?: number
  size?: number
}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => defuncionApi.buscar(params),
  })
}

export function useDefuncionById(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => defuncionApi.obtenerPorId(id!),
    enabled: !!id,
  })
}
export function useCrearDefuncion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: InformeDefuncionDTO) => defuncionApi.crear(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useActualizarDefuncion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: InformeDefuncionDTO }) =>
      defuncionApi.actualizar(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export function useEliminarDefuncion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => defuncionApi.eliminar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
