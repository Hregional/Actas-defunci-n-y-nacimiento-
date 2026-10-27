export type TipoDocumento = 'DPI_GT' | 'INE_MX' | 'PASAPORTE' | 'OTRO'

export interface DocumentoInfo {
  tipo: TipoDocumento
  labelNumero: string
  labelDepto: string
  labelMuni: string
  labelNacionalidad: string
  nacionalidadDefault: string | null
  usaSelectorGT: boolean
  usaSelectorMX: boolean
  mostrarFhirDpi: boolean
  maxLengthDoc: number
}

export const PAISES_PASAPORTE = [
  { code: 'GT', label: 'Guatemala', nacionalidad: 'Guatemalteca' },
  { code: 'MX', label: 'México', nacionalidad: 'Mexicana' },
  { code: 'SV', label: 'El Salvador', nacionalidad: 'Salvadoreña' },
  { code: 'HN', label: 'Honduras', nacionalidad: 'Hondureña' },
  { code: 'NI', label: 'Nicaragua', nacionalidad: 'Nicaragüense' },
  { code: 'CR', label: 'Costa Rica', nacionalidad: 'Costarricense' },
  { code: 'US', label: 'Estados Unidos', nacionalidad: 'Estadounidense' },
  { code: 'OTHER', label: 'Otro país', nacionalidad: null },
] as const

export function getDocumentoInfo(tipo: TipoDocumento, paisPasaporte?: string): DocumentoInfo {
  switch (tipo) {
    case 'DPI_GT':
      return {
        tipo,
        labelNumero: 'DPI / CUI',
        labelDepto: 'Departamento',
        labelMuni: 'Municipio',
        labelNacionalidad: 'Nacionalidad',
        nacionalidadDefault: null,
        usaSelectorGT: true,
        usaSelectorMX: false,
        mostrarFhirDpi: true,
        maxLengthDoc: 13,
      }
    case 'INE_MX':
      return {
        tipo,
        labelNumero: 'No. Credencial INE',
        labelDepto: 'Estado',
        labelMuni: 'Municipio',
        labelNacionalidad: 'Nacionalidad',
        nacionalidadDefault: 'Mexicana',
        usaSelectorGT: false,
        usaSelectorMX: true,
        mostrarFhirDpi: false,
        maxLengthDoc: 20,
      }
    case 'PASAPORTE': {
      const pais = PAISES_PASAPORTE.find(p => p.code === paisPasaporte)
      return {
        tipo,
        labelNumero: 'No. Pasaporte',
        labelDepto: 'Provincia / Estado',
        labelMuni: 'Ciudad',
        labelNacionalidad: 'Nacionalidad',
        nacionalidadDefault: pais?.nacionalidad ?? null,
        usaSelectorGT: false,
        usaSelectorMX: false,
        mostrarFhirDpi: false,
        maxLengthDoc: 20,
      }
    }
    case 'OTRO':
      return {
        tipo,
        labelNumero: 'No. Documento',
        labelDepto: 'Región / Provincia',
        labelMuni: 'Localidad / Ciudad',
        labelNacionalidad: 'Nacionalidad',
        nacionalidadDefault: null,
        usaSelectorGT: false,
        usaSelectorMX: false,
        mostrarFhirDpi: false,
        maxLengthDoc: 50,
      }
  }
}
