import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { empleadosApi } from '../api/empleados.api'
import type { EmpleadoRhDTO } from '../types/empleado.types'

const QUERY_KEY = 'empleados-rh'

// ── Queries base ─────────────────────────────────────────────────────────────

/**
 * Carga la lista completa de empleados activos.
 * Resultado cacheado 5 minutos (los datos de empleados no cambian frecuentemente).
 */
export function useEmpleadosList(q?: string) {
  return useQuery({
    queryKey: [QUERY_KEY, 'list', q],
    queryFn: () => empleadosApi.listar(q),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  })
}

/**
 * Obtiene un empleado específico por ID.
 */
export function useEmpleadoById(id?: number) {
  return useQuery({
    queryKey: [QUERY_KEY, 'one', id],
    queryFn: () => empleadosApi.obtenerPorId(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// ── Hook de autocompletar ─────────────────────────────────────────────────────

export interface UseEmpleadoAutocompleteReturn {
  /** Texto ingresado por el usuario. */
  inputValue: string
  /** Cambia el texto de búsqueda. */
  setInputValue: (v: string) => void
  /** Lista filtrada de opciones para mostrar en el Autocomplete. */
  options: EmpleadoRhDTO[]
  /** Indica que se están cargando los datos. */
  loading: boolean
  /** Error al cargar, si existe. */
  error: Error | null
  /** Empleado actualmente seleccionado. */
  selectedEmpleado: EmpleadoRhDTO | null
  /** Selecciona un empleado (o limpia la selección con null). */
  setSelectedEmpleado: (emp: EmpleadoRhDTO | null) => void
}

/**
 * Hook completo para un campo de autocompletar de empleados.
 *
 * Uso típico:
 * ```tsx
 * const { inputValue, setInputValue, options, loading, selectedEmpleado, setSelectedEmpleado }
 *   = useEmpleadoAutocomplete()
 *
 * <Autocomplete
 *   options={options}
 *   loading={loading}
 *   inputValue={inputValue}
 *   onInputChange={(_, v) => setInputValue(v)}
 *   value={selectedEmpleado}
 *   onChange={(_, v) => setSelectedEmpleado(v)}
 *   getOptionLabel={(o) => o.nombreCompleto}
 *   ...
 * />
 * ```
 */
export function useEmpleadoAutocomplete(): UseEmpleadoAutocompleteReturn {
  const [inputValue, setInputValue] = useState('')
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoRhDTO | null>(null)

  // Solo busca si el usuario escribió al menos 2 caracteres
  const searchTerm = inputValue.trim().length >= 2 ? inputValue.trim() : undefined

  const { data, isLoading, error } = useEmpleadosList(searchTerm)

  // Filtrado local adicional (por si la API no filtra por `q`)
  const options = useMemo<EmpleadoRhDTO[]>(() => {
    if (!data) return []
    if (!inputValue.trim()) return data

    const lower = inputValue.toLowerCase()
    return data.filter(
      (emp) =>
        emp.nombreCompleto.toLowerCase().includes(lower) ||
        emp.numeroEmpleado?.toLowerCase().includes(lower) ||
        emp.dpi?.includes(lower)
    )
  }, [data, inputValue])

  return {
    inputValue,
    setInputValue,
    options,
    loading: isLoading,
    error: error as Error | null,
    selectedEmpleado,
    setSelectedEmpleado,
  }
}
