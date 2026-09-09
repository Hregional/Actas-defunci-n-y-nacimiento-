/**
 * Validador de CUI (DPI) de Guatemala
 * Adaptado del algoritmo oficial del complemento 11
 *
 * El CUI tiene el formato: XXXXXXXX-X-XXXXXX
 * donde los primeros 8 dígitos son el número, el 9° es el verificador,
 * los dígitos 10-11 indican el departamento y 12-13 el municipio.
 */
export function cuiValido(cui: string | null | undefined): boolean {
  if (!cui) return false

  const cuiRegExp = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/
  if (!cuiRegExp.test(cui)) return false

  cui = cui.replace(/\s/g, '')

  const depto      = parseInt(cui.substring(9, 11), 10)
  const muni       = parseInt(cui.substring(11, 13), 10)
  const numero     = cui.substring(0, 8)
  const verificador = parseInt(cui.substring(8, 9), 10)

  const munisPorDepto = [
    17, // 01 - Guatemala
     8, // 02 - El Progreso
    16, // 03 - Sacatepéquez
    16, // 04 - Chimaltenango
    13, // 05 - Escuintla
    14, // 06 - Santa Rosa
    19, // 07 - Sololá
     8, // 08 - Totonicapán
    24, // 09 - Quetzaltenango
    21, // 10 - Suchitepéquez
     9, // 11 - Retalhuleu
    30, // 12 - San Marcos
    32, // 13 - Huehuetenango
    21, // 14 - Quiché
     8, // 15 - Baja Verapaz
    17, // 16 - Alta Verapaz
    14, // 17 - Petén
     5, // 18 - Izabal
    11, // 19 - Zacapa
    11, // 20 - Chiquimula
     7, // 21 - Jalapa
    17, // 22 - Jutiapa
  ]

  if (depto === 0 || muni === 0) return false
  if (depto > munisPorDepto.length) return false
  if (muni > munisPorDepto[depto - 1]) return false

  let total = 0
  for (let i = 0; i < numero.length; i++) {
    total += parseInt(numero[i], 10) * (i + 2)
  }

  const modulo = total % 11
  return modulo === verificador
}

/**
 * Retorna el mensaje de error del CUI o null si es válido.
 * Útil para mostrar mensajes descriptivos al usuario.
 */
export function cuiMensajeError(cui: string | null | undefined): string | null {
  if (!cui || cui.trim() === '') return null // vacío es neutral, no error

  const soloDigitos = cui.replace(/\s/g, '')

  if (!/^\d+$/.test(soloDigitos))
    return 'El DPI solo debe contener números'

  if (soloDigitos.length < 13)
    return `Incompleto — faltan ${13 - soloDigitos.length} dígito${13 - soloDigitos.length !== 1 ? 's' : ''}`

  if (soloDigitos.length > 13)
    return 'El DPI no puede tener más de 13 dígitos'

  // Validar departamento y municipio
  const depto = parseInt(soloDigitos.substring(9, 11), 10)
  const muni  = parseInt(soloDigitos.substring(11, 13), 10)

  if (depto === 0 || muni === 0)
    return 'Código de departamento o municipio inválido (no puede ser 00)'

  const munisPorDepto = [17,8,16,16,13,14,19,8,24,21,9,30,32,21,8,17,14,5,11,11,7,17]

  if (depto > munisPorDepto.length)
    return `Departamento inválido (código ${depto} no existe)`

  if (muni > munisPorDepto[depto - 1])
    return `Municipio inválido para el departamento ${depto}`

  if (!cuiValido(cui))
    return 'DPI inválido — el dígito verificador no coincide'

  return null // válido
}

/**
 * Decodifica el departamento y municipio desde un CUI guatemalteco válido.
 * Usa DEPARTAMENTOS_GUATEMALA por código para obtener el nombre oficial.
 * Retorna null si el CUI no es válido o no tiene 13 dígitos.
 */
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'

export function deptoMuniDesdeCui(cui: string | null | undefined): {
  depto: string
  muniIndex: number   // índice 0-based en el array de municipios del departamento
  deptoCode: number
} | null {
  if (!cui) return null
  const digits = cui.replace(/\s/g, '')
  if (digits.length !== 13 || !cuiValido(digits)) return null

  const deptoCode = parseInt(digits.substring(9, 11), 10)
  const muniCode  = parseInt(digits.substring(11, 13), 10)

  const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.code === deptoCode)
  if (!deptoData) return null

  return {
    depto:     deptoData.title,
    muniIndex: muniCode - 1,   // 0-based: código 01 → índice 0
    deptoCode,
  }
}
