import { useQuery } from '@tanstack/react-query'
import { estadisticasApi } from '../api/estadisticas.api'
import { useKeycloak } from '@/shared/context/KeycloakContext'

const KEY = 'estadisticas'

// Configuración de retry: rápido para fallar, lento solo si hay esperanza
const RETRY_CONFIG = {
  retry: (failureCount: number, error: any) => {
    // No reintentar en errores 404 o 403
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

export function useResumen() {
  const { authenticated } = useKeycloak()
  
  return useQuery({
    queryKey: [KEY, 'resumen'],
    queryFn: estadisticasApi.resumen,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
    enabled: authenticated, // Solo ejecutar si hay sesión autenticada
    ...RETRY_CONFIG,
  })
}

export function usePorMes(anio?: number) {
  const { authenticated } = useKeycloak()
  
  return useQuery({
    queryKey: [KEY, 'por-mes', anio],
    queryFn: () => estadisticasApi.porMes(anio),
    staleTime: 1000 * 60 * 5,
    enabled: authenticated, // Solo ejecutar si hay sesión autenticada
    ...RETRY_CONFIG,
  })
}

export function useUltimaSemana() {
  const { authenticated } = useKeycloak()
  
  return useQuery({
    queryKey: [KEY, 'ultima-semana'],
    queryFn: estadisticasApi.ultimaSemana,
    staleTime: 1000 * 60 * 1, // 1 minuto — más fresco porque muestra actividad reciente
    refetchOnWindowFocus: true,
    enabled: authenticated, // Solo ejecutar si hay sesión autenticada
    ...RETRY_CONFIG,
  })
}
