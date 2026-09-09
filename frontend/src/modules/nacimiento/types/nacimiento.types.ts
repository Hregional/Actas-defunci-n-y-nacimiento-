export interface InformeNacimientoDTO {
  id?: number
  estado?: string
  createdAt?: string
  updatedAt?: string

  // ── Sección I ──────────────────────────────────────────
  suscribeNombresApellidos: string
  suscribeCuiCedula: string          // Requerido con validación CUI
  suscribeNoColegiado?: string | null
  suscribeNoRegistroComadrona?: string | null
  suscribeQuienInforma: number       // Requerido

  // ── Sección II ─────────────────────────────────────────
  lugarDepartamento: string
  lugarMunicipio: string
  lugarDireccion?: string | null
  lugarOcurrioNacimiento?: number | null

  // ── Sección III ────────────────────────────────────────
  ninoPrimerNombre?: string | null   // Opcional — recién nacido puede no tener nombre aún
  ninoSegundoNombre?: string | null
  ninoTercerNombre?: string | null
  ninoPrimerApellido?: string | null // Opcional
  ninoSegundoApellido?: string | null
  ninoFechaNacimiento: string        // Requerido
  ninoHoraNacimiento?: string | null
  ninoSexo: number                   // Requerido
  ninoPesoLibras: number             // Requerido
  ninoPesoOnzas?: number | null
  ninoTallaCm: number                // Requerido
  ninoEdadGestacionalSemanas: number // Requerido
  ninoAnomaliasCongenitas: number    // Requerido
  ninoTipoParto: number              // Requerido
  ninoNumHijosNacidosParto: number | null
  ninoPersonaAtendioElParto: number  // Requerido
  ninoTotalHijosMadre: number | null
  ninoHijosNacidosMuertos: number | null
  ninoHijosViven: number | null

  // ── Sección IV ─────────────────────────────────────────
  madrePrimerNombre: string          // Requerido
  madreSegundoNombre?: string | null
  madrePrimerApellido: string        // Requerido
  madreSegundoApellido?: string | null
  madreApellidoCasada?: string | null
  madreCuiCedula: string             // Requerido con validación CUI
  madreEdad: number                  // Requerido
  madreNacionalidad: string          // Requerido
  madreOcupacion: string             // Requerido
  madreDireccion: string             // Requerido
  madreZona?: string | null
  madreMunicipio: string             // Requerido
  madreDepartamento: string          // Requerido
  madrePuebloPertenencia: number     // Requerido
  madreEstadoCivil: number           // Requerido
  madreEscolaridad: number           // Requerido

  // ── Sección V (todos opcionales) ───────────────────────
  padrePrimerNombre?: string | null
  padreSegundoNombre?: string | null
  padrePrimerApellido?: string | null
  padreSegundoApellido?: string | null
  padreCuiCedula?: string | null
  padreEdad?: number | null
  padreNacionalidad?: string | null
  padreOcupacion?: string | null
  padreDireccion?: string | null
  padreZona?: string | null
  padreMunicipio?: string | null
  padreDepartamento?: string | null
  padrePuebloPertenencia?: number | null
  padreEstadoCivil?: number | null
  padreEscolaridad?: number | null
}

export interface InformeNacimientoListDTO {
  id: number
  estado: string
  ninoNombreCompleto: string
  ninoPrimerApellido?: string
  ninoSexo?: number
  ninoFechaNacimiento: string
  lugarDepartamento: string
  lugarMunicipio: string
  madrePrimerNombre: string
  madrePrimerApellido: string
  suscribeNombresApellidos?: string
  createdAt: string
}
