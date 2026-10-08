import { useState } from 'react'
import { fhirApi, type PersonaFhirDTO } from '@/shared/api/fhir.api'

interface UseFhirPatientReturn {
  buscando: boolean
  error: string | null
  paciente: PersonaFhirDTO | null
  buscarPorCui: (cui: string) => Promise<PersonaFhirDTO | null>
  buscarPorFhirId: (fhirId: string) => Promise<PersonaFhirDTO | null>
  limpiar: () => void
}

/**
 * Hook para buscar pacientes en el servidor FHIR.
 * Soporta búsqueda por CUI/DPI o por ID interno de FHIR.
 */
export function useFhirPatient(): UseFhirPatientReturn {
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paciente, setPaciente] = useState<PersonaFhirDTO | null>(null)

  const buscarPorCui = async (cui: string): Promise<PersonaFhirDTO | null> => {
    if (!cui || cui.trim() === '') {
      setError('Debe ingresar un CUI/DPI')
      return null
    }
    return ejecutarBusqueda(() => fhirApi.buscarPorCui(cui))
  }

  const buscarPorFhirId = async (fhirId: string): Promise<PersonaFhirDTO | null> => {
    if (!fhirId || fhirId.trim() === '') {
      setError('Debe ingresar un ID de FHIR')
      return null
    }
    return ejecutarBusqueda(() => fhirApi.buscarPorFhirId(fhirId))
  }

  const ejecutarBusqueda = async (
    llamada: () => Promise<PersonaFhirDTO>
  ): Promise<PersonaFhirDTO | null> => {
    setBuscando(true)
    setError(null)
    setPaciente(null)

    try {
      const resultado = await llamada()
      if (resultado.encontrado) {
        setPaciente(resultado)
        return resultado
      } else {
        setError(resultado.mensajeError || 'Paciente no encontrado')
        return null
      }
    } catch (err: unknown) {
      const mensaje =
        err instanceof Error ? err.message : 'Error al conectar con el servidor FHIR'
      setError(mensaje)
      return null
    } finally {
      setBuscando(false)
    }
  }

  const limpiar = () => {
    setBuscando(false)
    setError(null)
    setPaciente(null)
  }

  return { buscando, error, paciente, buscarPorCui, buscarPorFhirId, limpiar }
}
