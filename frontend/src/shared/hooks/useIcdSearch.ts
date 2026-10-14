import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { icdApi } from '@/shared/api/icd.api'

/** Con menos caracteres no se llama a la API (el backend aplica la misma regla). */
export const ICD_MIN_CARACTERES = 3
const DEBOUNCE_MS = 400

/**
 * Busca en la CIE-11 el texto indicado, con debounce para no llamar a la API
 * en cada tecla. Los resultados se cachean 10 minutos por texto.
 */
export function useIcdSearch(texto: string) {
  const [debounced, setDebounced] = useState(texto.trim())

  useEffect(() => {
    const t = setTimeout(() => setDebounced(texto.trim()), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [texto])

  const habilitado = debounced.length >= ICD_MIN_CARACTERES

  const query = useQuery({
    queryKey: ['icd', 'buscar', debounced],
    queryFn: () => icdApi.buscar(debounced),
    enabled: habilitado,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  })

  return {
    resultados: habilitado ? (query.data ?? []) : [],
    // También "cargando" mientras corre el debounce, para no mostrar "Sin resultados" antes de tiempo
    cargando: (habilitado && query.isFetching)
      || (texto.trim() !== debounced && texto.trim().length >= ICD_MIN_CARACTERES),
    error: query.error as Error | null,
  }
}
