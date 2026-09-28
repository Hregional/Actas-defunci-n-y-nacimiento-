import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { nacimientoApi } from '../api/nacimiento.api'
import type { InformeNacimientoDTO } from '../types/nacimiento.types'
import { useKeycloak } from '@/shared/context/KeycloakContext'

const QUERY_KEY = 'nacimientos'

// Configuración de retry: rápido para fallar, lento solo si hay esperanza
const RETRY_CONFIG = {
  retry: (failureCount: number, error: any) => {
    // No reintentar en errores 404 (registro no encontrado) o 403 (sin permisos)
    if (error?.message?.includes('404') || error?.message?.includes('403')) {
      return false
    }
    // Solo 3 reintentos para fallar rápido
    return failureCount < 3
  },
  retryDelay: (attemptIndex: number) => {
    // Delays más cortos: 1s, 2s, 4s (total ~7s)
    return Math.min(1000 * 2 ** attemptIndex, 5000)
  },
}

export function useNacimientoList(params: {
  search?: string
  estado?: string
  page?: number
  size?: number
}) {
  const { authenticated } = useKeycloak()
  
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => nacimientoApi.buscar(params),
    enabled: authenticated, // Solo ejecutar si hay sesión autenticada
    ...RETRY_CONFIG,
  })
}

export function useNacimientoById(id?: number) {
  const { authenticated } = useKeycloak()
  
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => nacimientoApi.obtenerPorId(id!),
    enabled: !!id && authenticated, // Solo si hay ID y sesión autenticada
    ...RETRY_CONFIG,
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
