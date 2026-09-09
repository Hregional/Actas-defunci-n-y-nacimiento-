import { z } from 'zod'
import { cuiValido } from '@/shared/utils/cuiValidator'

// CUI requerido con validación oficial
const cuiReq = z
  .string()
  .min(13, 'El DPI debe tener 13 dígitos')
  .refine(cuiValido, { message: 'DPI inválido — verifique el número' })

// CUI opcional (se valida solo si se ingresa)
const cuiOpt = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.trim() === '' || cuiValido(val),
    { message: 'DPI inválido — verifique el número' }
  )

const req = (msg = 'Requerido') => z.string().min(1, msg)

export const defuncionSchema = z.object({
  // ── Sección I — Información General ────────────────────────
  infoQuienInformaNombres:    req('Nombre de quien informa es requerido').max(255),
  infoDocumentoIdentificacion: z.string().max(100).nullable().optional().or(z.literal('')),
  infoQuienInformaTipo:        z.number({ required_error: 'Seleccione quién informa' }).min(1).max(3),
  infoNoColegiado:             z.string().max(50).nullable().optional().or(z.literal('')),
  infoFechaDefuncion:          req('Fecha de defunción es requerida'),
  infoHoraDefuncion: z
    .string({ required_error: 'La hora de defunción es requerida' })
    .min(1, 'La hora de defunción es requerida')
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato HH:mm inválido'),
  infoLugarDireccion:          z.string().nullable().optional().or(z.literal('')),
  infoLugarMunicipio:          z.string().nullable().optional().or(z.literal('')),
  infoLugarDepartamento:       z.string().nullable().optional().or(z.literal('')),

  // ── Sección II — Datos del fallecido ─────────────────────
  fallecidoNombreCompleto:    req('Nombre del fallecido es requerido').max(255),
  fallecidoSexo:              z.number({ required_error: 'Seleccione sexo' }).min(1).max(9),
  // Edad: al menos uno de los campos debe tener valor (se valida en handleNext)
  fallecidoEdadHoras:         z.number().min(0).max(23).optional().nullable(),
  fallecidoEdadDias:          z.number().min(1).max(29).optional().nullable(),
  fallecidoEdadMeses:         z.number().min(1).max(11).optional().nullable(),
  fallecidoEdadAnos:          z.number().min(1).optional().nullable(),
  fallecidoDocNumero:         cuiReq,
  fallecidoDocLibro:          z.string().max(50).nullable().optional().or(z.literal('')),
  fallecidoDocFolio:          z.string().max(50).nullable().optional().or(z.literal('')),
  fallecidoDocPartida:        z.string().max(50).nullable().optional().or(z.literal('')),
  fallecidoLugarNacPais:      req('Requerido').max(100),
  fallecidoLugarNacDepartamento: req('Requerido').max(100),
  fallecidoLugarNacMunicipio: req('Requerido').max(100),
  fallecidoNacionalidad:      req('Requerido').max(100),
  fallecidoOcupacion:         req('Requerido').max(150),
  fallecidoEstadoCivil:       z.number({ required_error: 'Seleccione estado civil' }).min(1).max(9),
  fallecidoPuebloPertenencia: z.number({ required_error: 'Seleccione pueblo de pertenencia' }).min(1).max(9),
  fallecidoResidenciaDireccion:   req('Requerido').max(255),
  fallecidoResidenciaMunicipio:   req('Requerido').max(100),
  fallecidoResidenciaDepartamento: req('Requerido').max(100),
  fallecidoEscolaridad:       z.number({ required_error: 'Seleccione escolaridad' }).min(0).max(9),

  // ── Sección III — Mujeres fértiles (opcional) ────────────
  fertilMuerteDurante:        z.number().min(1).max(9).optional().nullable(),

  // ── Sección IV — Causa de defunción ──────────────────────
  causaIa:          req('La causa directa de muerte es requerida'),
  causaIaIntervalo: z.string().max(100).nullable().optional().or(z.literal('')),
  causaIb:          z.string().nullable().optional().or(z.literal('')),
  causaIbIntervalo: z.string().max(100).nullable().optional().or(z.literal('')),
  causaIc:          z.string().nullable().optional().or(z.literal('')),
  causaIcIntervalo: z.string().max(100).nullable().optional().or(z.literal('')),
  causaId:          z.string().nullable().optional().or(z.literal('')),
  causaIdIntervalo: z.string().max(100).nullable().optional().or(z.literal('')),
  causaIi:          z.string().nullable().optional().or(z.literal('')),

  // ── Sección V — Defunciones accidentales (opcional) ──────
  accidentalFuePresunto:   z.number().min(1).max(9).optional().nullable(),
  accidentalLugarLesion:   z.number().min(0).max(9).optional().nullable(),
  accidentalOcurrioTrabajo: z.number().min(1).max(9).optional().nullable(),
  accidentalFueTransito:   z.number().min(1).max(9).optional().nullable(),
  accidentalArmaProdujo:   z.string().max(255).nullable().optional().or(z.literal('')),

  // ── Sección VI — Mortinato: Datos de la madre ────────────
  // Esta sección solo aplica si la muerte es fetal
  mortinatoMadreNombre:    z.string().max(255).nullable().optional().or(z.literal('')),
  mortinatoMadreDocNumero: cuiOpt,
  mortinatoMadreDocLibro:  z.string().max(50).nullable().optional().or(z.literal('')),
  mortinatoMadreDocFolio:  z.string().max(50).nullable().optional().or(z.literal('')),
  mortinatoMadreDocPartida: z.string().max(50).nullable().optional().or(z.literal('')),
  mortinatoMadreLugarNacPais:         z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoMadreLugarNacDepartamento: z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoMadreLugarNacMunicipio:    z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoMadreEdad:          z.number().min(10).max(99).optional().nullable(),
  mortinatoMadreEstadoCivil:   z.number().min(1).max(9).optional().nullable(),
  mortinatoMadrePuebloPertenencia: z.number().min(1).max(9).optional().nullable(),
  mortinatoMadreResidenciaDireccion:   z.string().max(255).nullable().optional().or(z.literal('')),
  mortinatoMadreResidenciaMunicipio:   z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoMadreResidenciaDepartamento: z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoMadreOcupacion:     z.string().max(150).nullable().optional().or(z.literal('')),
  mortinatoMadreSabeLeer:      z.number().min(1).max(9).optional().nullable(),
  mortinatoMadreEscolaridad:   z.number().min(0).max(9).optional().nullable(),
  mortinatoMadreNacionalidad:  z.string().max(100).nullable().optional().or(z.literal('')),
  mortinatoEmbarazosNacidosVivos:   z.number().min(0).optional().nullable(),
  mortinatoEmbarazosNacidosMuertos: z.number().min(0).optional().nullable(),

  // ── Sección VI — Mortinato: Datos del feto ───────────────
  mortinatoFetoSexo:        z.number().min(1).max(9).optional().nullable(),
  mortinatoFetoMurio:       z.number().min(1).max(2).optional().nullable(),
  mortinatoPartoFue:        z.number().min(1).max(3).optional().nullable(),
  mortinatoClaseParto:      z.number().min(1).max(2).optional().nullable(),
  mortinatoViaParto:        z.number().min(1).max(2).optional().nullable(),
  mortinatoSemanasGestacion: z.number().min(1).max(45).optional().nullable(),
  mortinatoCausasFetales:   z.string().nullable().optional().or(z.literal('')),
  mortinatoCausasMaternas:  z.string().nullable().optional().or(z.literal('')),

  // ── Sección VII — Otros datos ────────────────────────────
  otrosHuboNecropsia:    z.number({ required_error: 'Indique si hubo necropsia' }).min(1).max(2),
  otrosClaseAsistencia:  z.number({ required_error: 'Seleccione clase de asistencia' }).min(1).max(9),
  otrosLugarDefuncion:   z.number({ required_error: 'Seleccione lugar de defunción' }).min(1).max(9),
}).refine(
  (data) => {
    // Si es médico (tipo 1), el número de colegiado es obligatorio
    if (data.infoQuienInformaTipo === 1) {
      return data.infoNoColegiado && data.infoNoColegiado.trim().length > 0
    }
    return true
  },
  {
    message: 'El número de colegiado es requerido para médicos',
    path: ['infoNoColegiado']
  }
)

export type DefuncionFormValues = z.infer<typeof defuncionSchema>
