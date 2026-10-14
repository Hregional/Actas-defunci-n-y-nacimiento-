/**
 * Utilidades para mapear datos FHIR a campos del formulario
 * Maneja diferencias entre nombres en FHIR vs opciones del frontend
 */

import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'
import { cuiValido, deptoMuniDesdeCui } from './cuiValidator'

/**
 * Mapea un departamento de FHIR al código usado en el frontend
 * Si no coincide exactamente, intenta encontrar coincidencias parciales
 */
export function mapearDepartamentoFhir(departamentoFhir: string | null | undefined): string | null {
  if (!departamentoFhir) return null
  
  // Buscar coincidencia exacta
  const coincidenciaExacta = DEPARTAMENTOS_GUATEMALA.find(
    depto => depto.title.toLowerCase() === departamentoFhir.toLowerCase()
  )
  
  if (coincidenciaExacta) {
    return coincidenciaExacta.title
  }
  
  // Buscar coincidencia partial (contiene)
  const coincidenciaParcial = DEPARTAMENTOS_GUATEMALA.find(
    depto => depto.title.toLowerCase().includes(departamentoFhir.toLowerCase()) ||
             departamentoFhir.toLowerCase().includes(depto.title.toLowerCase())
  )
  
  if (coincidenciaParcial) {
    console.warn(`[FHIR Mapper] Mapeo aproximado: "${departamentoFhir}" → "${coincidenciaParcial.title}"`)
    return coincidenciaParcial.title
  }
  
  console.error(`[FHIR Mapper] No se pudo mapear departamento: "${departamentoFhir}"`)
  return null
}

/**
 * Mapea un municipio de FHIR verificando que exista en el departamento seleccionado
 */
export function mapearMunicipioFhir(municipioFhir: string | null | undefined, departamento: string | null | undefined): string | null {
  if (!municipioFhir || !departamento) return null
  
  const depto = DEPARTAMENTOS_GUATEMALA.find(d => d.title === departamento)
  if (!depto) {
    console.error(`[FHIR Mapper] Departamento no encontrado: "${departamento}"`)
    return null
  }
  
  // Buscar coincidencia exacta
  const coincidenciaExacta = depto.mun.find(
    muni => muni.toLowerCase() === municipioFhir.toLowerCase()
  )
  
  if (coincidenciaExacta) {
    return coincidenciaExacta
  }
  
  // Buscar coincidencia parcial
  const coincidenciaParcial = depto.mun.find(
    muni => muni.toLowerCase().includes(municipioFhir.toLowerCase()) ||
            municipioFhir.toLowerCase().includes(muni.toLowerCase())
  )
  
  if (coincidenciaParcial) {
    console.warn(`[FHIR Mapper] Mapeo aproximado municipio: "${municipioFhir}" → "${coincidenciaParcial}" (${departamento})`)
    return coincidenciaParcial
  }
  
  console.error(`[FHIR Mapper] No se pudo mapear municipio: "${municipioFhir}" en departamento "${departamento}"`)
  return null
}

/**
 * Determina si un CUI es guatemalteco y asigna nacionalidad automáticamente
 * Permite especificar el género para adaptar la terminación
 */
export function asignarNacionalidadAutomatica(cui: string | null | undefined, genero?: 'masculino' | 'femenino'): string | null {
  if (!cui) return null
  
  const cuiLimpio = cui.replace(/[\s-]/g, '')
  
  // Si es CUI guatemalteco válido (13 dígitos + checksum), es guatemalteco
  if (cuiLimpio.length === 13 && cuiValido(cuiLimpio)) {
    if (genero === 'femenino') {
      return 'Guatemalteca'
    } else if (genero === 'masculino') {
      return 'Guatemalteco'
    } else {
      return 'Guatemalteca' // Por defecto femenino (más común en formularios de madre)
    }
  }
  
  // Para otros tipos de documento, no asumir nacionalidad
  return null
}

/**
 * Mapea estado civil de códigos FHIR a valores del frontend
 */
export function mapearEstadoCivilFhir(estadoCivilFhir: string | null | undefined): number | null {
  if (!estadoCivilFhir) return null
  
  const estadoCivilMap: Record<string, number> = {
    // FHIR standard codes
    'never_married': 1,    // Soltera
    'married': 2,          // Casada
    'divorced': 1,         // Divorciada → mapear a Soltera
    'widowed': 1,          // Viuda → mapear a Soltera
    
    // Posibles variaciones en español
    'soltera': 1,
    'casada': 2,
    'divorciada': 1,
    'viuda': 1,
  }
  
  const codigo = estadoCivilFhir.toLowerCase()
  const resultado = estadoCivilMap[codigo]
  
  if (resultado) {
    return resultado
  }
  
  console.warn(`[FHIR Mapper] Estado civil no reconocido: "${estadoCivilFhir}"`)
  return null
}

/**
 * Mapea pueblo de pertenencia de FHIR a valores del frontend
 */
export function mapearPuebloPertenenciaFhir(puebloFhir: string | null | undefined): number | null {
  if (!puebloFhir) return null
  
  const puebloMap: Record<string, number> = {
    'Maya': 1,
    'Garífuna': 2,
    'Xinka': 3,
    'Mestizo': 4,
    'Ladino': 4,
    'Mestizo/Ladino': 4,
    'Otro': 5,
  }
  
  // Buscar coincidencia exacta o parcial
  for (const [key, value] of Object.entries(puebloMap)) {
    if (puebloFhir.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }
  
  console.warn(`[FHIR Mapper] Pueblo de pertenencia no reconocido: "${puebloFhir}"`)
  return null
}

/**
 * Interface para el resultado del mapeo FHIR
 */
export interface FhirMappingResult {
  success: boolean
  warnings: string[]
  data: {
    departamento?: string
    municipio?: string
    nacionalidad?: string
    estadoCivil?: number
    puebloPertenencia?: number
  }
}

/**
 * Función principal que mapea todos los datos FHIR de ubicación/nacionalidad
 */
export function mapearDatosFhirCompleto(pacienteFhir: {
  departamento?: string | null
  municipio?: string | null
  cui?: string | null
  estadoCivil?: string | null
  puebloPertenencia?: string | null
  nacionalidad?: string | null
}, genero?: 'masculino' | 'femenino'): FhirMappingResult {
  
  const warnings: string[] = []
  const data: FhirMappingResult['data'] = {}
  
  // Mapear departamento desde FHIR; si no viene, intentar calcular desde CUI
  if (pacienteFhir.departamento) {
    const departamentoMapeado = mapearDepartamentoFhir(pacienteFhir.departamento)
    if (departamentoMapeado) {
      data.departamento = departamentoMapeado
      
      // Mapear municipio solo si el departamento es válido
      if (pacienteFhir.municipio) {
        const municipioMapeado = mapearMunicipioFhir(pacienteFhir.municipio, departamentoMapeado)
        if (municipioMapeado) {
          data.municipio = municipioMapeado
        } else {
          warnings.push(`No se pudo mapear municipio: ${pacienteFhir.municipio}`)
        }
      }
    } else {
      warnings.push(`No se pudo mapear departamento: ${pacienteFhir.departamento}`)
    }
  }
  
  // Fallback: si la API no devolvió depto/municipio pero sí hay CUI guatemalteco,
  // calculamos depto y municipio desde el CUI (codificado en los primeros dígitos)
  if (!data.departamento && pacienteFhir.cui) {
    const cuiLimpio = pacienteFhir.cui.replace(/[\s-]/g, '')
    if (cuiLimpio.length === 13 && cuiValido(cuiLimpio)) {
      const infoCui = deptoMuniDesdeCui(cuiLimpio)
      if (infoCui) {
        data.departamento = infoCui.depto
        const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === infoCui.depto)
        if (deptoData && deptoData.mun[infoCui.muniIndex]) {
          data.municipio = deptoData.mun[infoCui.muniIndex]
        }
        console.info(`[FHIR Mapper] Depto/muni calculados desde CUI: ${infoCui.depto} / ${deptoData?.mun[infoCui.muniIndex] ?? ''}`)
      }
    }
  }
  
  // Asignar nacionalidad automática si es CUI guatemalteco
  const nacionalidadAuto = asignarNacionalidadAutomatica(pacienteFhir.cui, genero)
  if (nacionalidadAuto) {
    data.nacionalidad = nacionalidadAuto
  } else if (pacienteFhir.nacionalidad) {
    // Si hay nacionalidad de FHIR, ajustar género si es necesario
    let nacionalidadAjustada = pacienteFhir.nacionalidad
    if (genero === 'masculino' && pacienteFhir.nacionalidad === 'Guatemalteca') {
      nacionalidadAjustada = 'Guatemalteco'
    } else if (genero === 'femenino' && pacienteFhir.nacionalidad === 'Guatemalteco') {
      nacionalidadAjustada = 'Guatemalteca'
    }
    data.nacionalidad = nacionalidadAjustada
  }
  
  // Mapear estado civil
  if (pacienteFhir.estadoCivil) {
    const estadoCivilMapeado = mapearEstadoCivilFhir(pacienteFhir.estadoCivil)
    if (estadoCivilMapeado) {
      data.estadoCivil = estadoCivilMapeado
    } else {
      warnings.push(`No se pudo mapear estado civil: ${pacienteFhir.estadoCivil}`)
    }
  }
  
  // Mapear pueblo de pertenencia
  if (pacienteFhir.puebloPertenencia) {
    const puebloMapeado = mapearPuebloPertenenciaFhir(pacienteFhir.puebloPertenencia)
    if (puebloMapeado) {
      data.puebloPertenencia = puebloMapeado
    } else {
      warnings.push(`No se pudo mapear pueblo de pertenencia: ${pacienteFhir.puebloPertenencia}`)
    }
  }
  
  return {
    success: warnings.length === 0,
    warnings,
    data
  }
}