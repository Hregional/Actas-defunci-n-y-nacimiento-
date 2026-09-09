export interface InformeDefuncionDTO {
  id?: number
  estado?: string
  createdAt?: string
  updatedAt?: string

  // ── Sección I ──────────────────────────────────────────
  infoQuienInformaNombres: string
  infoDocumentoIdentificacion?: string | null
  infoQuienInformaTipo: number
  infoNoColegiado?: string | null
  infoFechaDefuncion: string
  infoHoraDefuncion?: string
  infoLugarDireccion?: string | null
  infoLugarMunicipio?: string | null
  infoLugarDepartamento?: string | null

  // ── Sección II ─────────────────────────────────────────
  fallecidoNombreCompleto: string
  fallecidoSexo: number
  fallecidoEdadHoras?: number | null
  fallecidoEdadDias?: number | null
  fallecidoEdadMeses?: number | null
  fallecidoEdadAnos?: number | null
  fallecidoDocNumero: string
  fallecidoDocLibro?: string | null
  fallecidoDocFolio?: string | null
  fallecidoDocPartida?: string | null
  fallecidoLugarNacPais: string
  fallecidoLugarNacDepartamento: string
  fallecidoLugarNacMunicipio: string
  fallecidoNacionalidad: string
  fallecidoOcupacion: string
  fallecidoEstadoCivil: number
  fallecidoPuebloPertenencia: number
  fallecidoResidenciaDireccion: string
  fallecidoResidenciaMunicipio: string
  fallecidoResidenciaDepartamento: string
  fallecidoEscolaridad: number

  // ── Sección III ────────────────────────────────────────
  fertilMuerteDurante?: number | null

  // ── Sección IV ─────────────────────────────────────────
  causaIa: string
  causaIaIntervalo?: string | null
  causaIb?: string | null
  causaIbIntervalo?: string | null
  causaIc?: string | null
  causaIcIntervalo?: string | null
  causaId?: string | null
  causaIdIntervalo?: string | null
  causaIi?: string | null

  // ── Sección V ──────────────────────────────────────────
  accidentalFuePresunto?: number | null
  accidentalLugarLesion?: number | null
  accidentalOcurrioTrabajo?: number | null
  accidentalFueTransito?: number | null
  accidentalArmaProdujo?: string | null

  // ── Sección VI — Mortinato ─────────────────────────────
  mortinatoMadreNombre?: string | null
  mortinatoMadreDocNumero?: string | null
  mortinatoMadreDocLibro?: string | null
  mortinatoMadreDocFolio?: string | null
  mortinatoMadreDocPartida?: string | null
  mortinatoMadreLugarNacPais?: string | null
  mortinatoMadreLugarNacDepartamento?: string | null
  mortinatoMadreLugarNacMunicipio?: string | null
  mortinatoMadreEdad?: number | null
  mortinatoMadreEstadoCivil?: number | null
  mortinatoMadrePuebloPertenencia?: number | null
  mortinatoMadreResidenciaDireccion?: string | null
  mortinatoMadreResidenciaMunicipio?: string | null
  mortinatoMadreResidenciaDepartamento?: string | null
  mortinatoMadreOcupacion?: string | null
  mortinatoMadreSabeLeer?: number | null
  mortinatoMadreEscolaridad?: number | null
  mortinatoMadreNacionalidad?: string | null
  mortinatoEmbarazosNacidosVivos?: number | null
  mortinatoEmbarazosNacidosMuertos?: number | null
  mortinatoFetoSexo?: number | null
  mortinatoFetoMurio?: number | null
  mortinatoPartoFue?: number | null
  mortinatoClaseParto?: number | null
  mortinatoViaParto?: number | null
  mortinatoSemanasGestacion?: number | null
  mortinatoCausasFetales?: string | null
  mortinatoCausasMaternas?: string | null

  // ── Sección VII ────────────────────────────────────────
  otrosHuboNecropsia: number
  otrosClaseAsistencia: number
  otrosLugarDefuncion: number
}

export interface InformeDefuncionListDTO {
  id: number
  estado: string
  fallecidoNombreCompleto: string
  infoFechaDefuncion: string
  infoLugarDepartamento: string
  infoLugarMunicipio: string
  infoQuienInformaNombres: string
  createdAt: string
}
