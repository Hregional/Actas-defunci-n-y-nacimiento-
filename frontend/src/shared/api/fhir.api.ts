import { apiClient } from './client'

export interface PersonaFhirDTO {
  // Identificación
  cui: string | null
  fhirId: string | null
  
  // Datos personales
  nombreCompleto: string | null
  primerNombre: string | null
  segundoNombre: string | null
  tercerNombre: string | null
  primerApellido: string | null
  segundoApellido: string | null
  apellidoCasada: string | null
  
  // Información demográfica
  sexo: string | null  // "male" | "female" | "other" | "unknown"
  fechaNacimiento: string | null  // ISO date
  edad: number | null
  
  // Dirección
  direccion: string | null
  departamento: string | null
  municipio: string | null
  pais: string | null
  
  // Contacto
  telefono: string | null
  email: string | null
  
  // Datos adicionales
  nacionalidad: string | null
  estadoCivil: string | null
  puebloPertenencia: string | null
  ocupacion: string | null
  
  // Metadatos
  encontrado: boolean
  mensajeError: string | null
}

/**
 * API para consultar pacientes desde el servidor FHIR.
 * Utiliza el backend como intermediario para seguridad y transformación.
 */
export const fhirApi = {
  /**
   * Busca un paciente por su CUI/DPI.
   * El CUI se limpia automáticamente en el backend (quita espacios y guiones).
   */
  buscarPorCui: async (cui: string): Promise<PersonaFhirDTO> => {
    const response = await apiClient.get<PersonaFhirDTO>(
      `/fhir/pacientes/buscar-por-cui/${cui}`
    )
    return response.data
  },

  /**
   * Busca un paciente por su ID interno de FHIR.
   */
  buscarPorFhirId: async (fhirId: string): Promise<PersonaFhirDTO> => {
    const response = await apiClient.get<PersonaFhirDTO>(
      `/fhir/pacientes/buscar-por-id/${fhirId}`
    )
    return response.data
  },

  /**
   * Verifica la conectividad con el servidor FHIR.
   */
  healthCheck: async (): Promise<string> => {
    const response = await apiClient.get<string>('/fhir/pacientes/health')
    return response.data
  },
}
