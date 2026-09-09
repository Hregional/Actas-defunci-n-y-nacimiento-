import { useQuery } from '@tanstack/react-query'
import { estadisticasApi } from '../api/estadisticas.api'

const KEY = 'estadisticas'

export function useResumen() {
  return useQuery({
    queryKey: [KEY, 'resumen'],
    queryFn: estadisticasApi.resumen,
    staleTime: 1000 * 60 * 2, // 2 minutos
    refetchOnWindowFocus: true,
  })
}

export function usePorMes(anio?: number) {
  return useQuery({
    queryKey: [KEY, 'por-mes', anio],
    queryFn: () => estadisticasApi.porMes(anio),
    staleTime: 1000 * 60 * 5,
  })
}

export function useUltimaSemana() {
  return useQuery({
    queryKey: [KEY, 'ultima-semana'],
    queryFn: estadisticasApi.ultimaSemana,
    staleTime: 1000 * 60 * 1, // 1 minuto — más fresco porque muestra actividad reciente
    refetchOnWindowFocus: true,
  })
}
