import { z } from 'zod'
import { cuiValido } from '@/shared/utils/cuiValidator'

// CUI requerido con validación oficial
const cuiReq = z
  .string()
  .min(13, 'El DPI debe tener 13 dígitos')
  .refine(cuiValido, { message: 'DPI inválido — verifique el número' })

// CUI opcional (datos del padre) — solo valida si tiene contenido
const cuiOpt = z
  .string()
  .optional()
  .nullable()
  .refine(
    (val) => !val || val.trim() === '' || (val.length === 13 && cuiValido(val)),
    { message: 'DPI inválido — debe tener 13 dígitos' }
  )
  .transform(val => val && val.trim() !== '' ? val : undefined)

const req = (msg = 'Requerido') => z.string().min(1, msg)

export const nacimientoSchema = z.object({
  // ── Sección I — Datos del que suscribe ────────────────────
  suscribeNombresApellidos:    req('Nombres y apellidos son requeridos').max(255),
  suscribeCuiCedula:           cuiReq,
  suscribeNoColegiado:         z.string().max(50).nullable().optional().or(z.literal('')),
  suscribeNoRegistroComadrona: z.string().max(50).nullable().optional().or(z.literal('')),
  suscribeQuienInforma:        z.number({ required_error: 'Seleccione quién informa' }).min(1).max(5),

  // ── Sección II — Lugar (valores estáticos, siempre válidos) ─
  lugarDepartamento:      z.string().min(1),
  lugarMunicipio:         z.string().min(1),
  lugarDireccion:         z.string().nullable().optional(),
  lugarOcurrioNacimiento: z.number().optional().nullable(),

  // ── Sección III — Datos del niño ──────────────────────────
  // Los nombres son opcionales — el recién nacido puede no tener nombre asignado aún
  ninoPrimerNombre:    z.string().max(100).nullable().optional().or(z.literal('')),
  ninoSegundoNombre:   z.string().max(100).nullable().optional().or(z.literal('')),
  ninoTercerNombre:    z.string().max(100).nullable().optional().or(z.literal('')),
  ninoPrimerApellido:  z.string().max(100).nullable().optional().or(z.literal('')),
  ninoSegundoApellido: z.string().max(100).nullable().optional().or(z.literal('')),
  ninoFechaNacimiento: req('Fecha de nacimiento es requerida'),
  ninoHoraNacimiento:  z.string()
                        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm inválido')
                        .nullable().optional().or(z.literal('')),
  ninoSexo:                    z.number({ required_error: 'Seleccione sexo' }).min(1).max(2),
  ninoPesoLibras:              z.number({ required_error: 'Requerido' }).min(0.5, 'Mínimo 0.5 lb').max(15, 'Máximo 15 lb'),
  ninoPesoOnzas:               z.number().min(0).max(15.9).optional().nullable(),
  ninoTallaCm:                 z.number({ required_error: 'Requerido' }).min(20, 'Mínimo 20 cm').max(100, 'Máximo 100 cm'),
  ninoEdadGestacionalSemanas:  z.number({ required_error: 'Requerido' }).min(1).max(45),
  ninoAnomaliasCongenitas:     z.number({ required_error: 'Indique si hubo anomalías' }).min(1).max(2),
  ninoTipoParto:               z.number({ required_error: 'Seleccione tipo de parto' }).min(1).max(2),
  ninoNumHijosNacidosParto:    z.number().min(1).max(9).nullable(),
  ninoPersonaAtendioElParto:   z.number({ required_error: 'Seleccione quien atendió el parto' }).min(1).max(9),
  ninoTotalHijosMadre:         z.number().min(1).max(99).nullable(),
  ninoHijosNacidosMuertos:     z.number().min(0).max(9).nullable(),
  ninoHijosViven:              z.number().min(0).max(99).nullable(),

  // ── Sección IV — Datos de la madre ────────────────────────
  madrePrimerNombre:      req('Primer nombre de la madre es requerido').max(100),
  madreSegundoNombre:     z.string().max(100).nullable().optional().or(z.literal('')),
  madrePrimerApellido:    req('Primer apellido de la madre es requerido').max(100),
  madreSegundoApellido:   z.string().max(100).nullable().optional().or(z.literal('')),
  madreApellidoCasada:    z.string().max(100).nullable().optional().or(z.literal('')),
  madreCuiCedula:         cuiReq,
  madreEdad:              z.number({ required_error: 'Edad es requerida' }).min(10, 'Mínimo 10 años').max(99),
  madreNacionalidad:      req('Nacionalidad es requerida').max(100),
  madreOcupacion:         req('Ocupación es requerida').max(150),
  madreDireccion:         req('Dirección es requerida').max(255),
  madreZona:              z.string().max(20).nullable().optional().or(z.literal('')),
  madreMunicipio:         req('Municipio es requerido').max(100),
  madreDepartamento:      req('Departamento es requerido').max(100),
  madrePuebloPertenencia: z.number({ required_error: 'Seleccione pueblo de pertenencia' }).min(1).max(5),
  madreEstadoCivil:       z.number({ required_error: 'Seleccione estado civil' }).min(1).max(6),
  madreEscolaridad:       z.number({ required_error: 'Seleccione escolaridad' }).min(1).max(5),

  // ── Sección V — Datos del padre (todos opcionales) ────────
  padrePrimerNombre:      z.string().max(100).nullable().optional().or(z.literal('')),
  padreSegundoNombre:     z.string().max(100).nullable().optional().or(z.literal('')),
  padrePrimerApellido:    z.string().max(100).nullable().optional().or(z.literal('')),
  padreSegundoApellido:   z.string().max(100).nullable().optional().or(z.literal('')),
  padreCuiCedula:         cuiOpt,
  padreEdad:              z.number().min(10).max(99).optional().nullable(),
  padreNacionalidad:      z.string().max(100).nullable().optional().or(z.literal('')),
  padreOcupacion:         z.string().max(150).nullable().optional().or(z.literal('')),
  padreDireccion:         z.string().max(255).nullable().optional().or(z.literal('')),
  padreZona:              z.string().max(20).nullable().optional().or(z.literal('')),
  padreMunicipio:         z.string().max(100).nullable().optional().or(z.literal('')),
  padreDepartamento:      z.string().max(100).nullable().optional().or(z.literal('')),
  padrePuebloPertenencia: z.number().min(1).max(5).optional().nullable(),
  padreEstadoCivil:       z.number().min(1).max(6).optional().nullable(),
  padreEscolaridad:       z.number().min(1).max(5).optional().nullable(),
}).refine(
  (data) => {
    // Si es médico (tipo 1), el número de colegiado es obligatorio
    if (data.suscribeQuienInforma === 1) {
      return data.suscribeNoColegiado && data.suscribeNoColegiado.trim().length > 0
    }
    return true
  },
  {
    message: 'El número de colegiado es requerido para médicos',
    path: ['suscribeNoColegiado']
  }
)

export type NacimientoFormValues = z.infer<typeof nacimientoSchema>
