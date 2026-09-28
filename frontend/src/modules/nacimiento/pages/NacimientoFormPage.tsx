import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider, type FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box, Stepper, Step, StepLabel, Button, Stack,
  Alert, Snackbar, Paper, Typography, LinearProgress,
  useMediaQuery, useTheme,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SaveIcon from '@mui/icons-material/Save'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { nacimientoSchema, type NacimientoFormValues } from '../schemas/nacimiento.schema'
import { nacimientoApi } from '../api/nacimiento.api'
import { useNacimientoById, useCrearNacimiento, useActualizarNacimiento } from '../hooks/useNacimiento'
import { useCurrentUser } from '@/shared/context/UserContext'
import { INSTITUCION } from '@/shared/constants/institucion'
import SeccionI from '../components/SeccionI'
import SeccionIII from '../components/SeccionIII'
import SeccionIV from '../components/SeccionIV'
import SeccionV from '../components/SeccionV'
import NacimientoPreview from '../components/NacimientoPreview'
import LoadingScreen from '@/shared/components/common/LoadingScreen'

// La Sección II (lugar) es estática — no necesita un paso propio
// Los datos se precargan en el formulario automáticamente
const STEPS = [
  'I. Quien Suscribe',
  'II. Niño(a)',
  'III. Madre',
  'IV. Padre (opcional)',
]

const STEP_FIELDS: (keyof NacimientoFormValues)[][] = [
  // Paso 0 — Sección I: quien suscribe
  ['suscribeNombresApellidos', 'suscribeCuiCedula', 'suscribeQuienInforma', 'suscribeNoColegiado'],
  // Paso 1 — Sección III: datos del niño (nombres opcionales)
  [
    'ninoFechaNacimiento',
    'ninoSexo', 'ninoPesoLibras', 'ninoTallaCm', 'ninoEdadGestacionalSemanas',
    'ninoAnomaliasCongenitas', 'ninoTipoParto', 'ninoNumHijosNacidosParto',
    'ninoPersonaAtendioElParto', 'ninoTotalHijosMadre',
    'ninoHijosNacidosMuertos', 'ninoHijosViven',
  ],
  // Paso 2 — Sección IV: datos de la madre (todos requeridos)
  [
    'madrePrimerNombre', 'madrePrimerApellido', 'madreCuiCedula',
    'madreEdad', 'madreNacionalidad', 'madreOcupacion',
    'madreDireccion', 'madreMunicipio', 'madreDepartamento',
    'madrePuebloPertenencia', 'madreEstadoCivil', 'madreEscolaridad',
  ],
  // Paso 3 — Sección V: datos del padre (todos opcionales)
  [],
]

export default function NacimientoFormPage() {
  const { id } = useParams()
  const editId = id ? Number(id) : undefined
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { usuario } = useCurrentUser()

  // IMPORTANTE: Todos los hooks deben estar ANTES de cualquier early return
  const [activeStep, setActiveStep] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [allowSubmit, setAllowSubmit] = useState(false)  // ← Flag de control de submit
  const [snackbar, setSnackbar] = useState<{
    open: boolean; message: string; severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const { data: existing, isLoading, error: loadError } = useNacimientoById(editId)
  const crear = useCrearNacimiento()
  const actualizar = useActualizarNacimiento()

  const methods = useForm<NacimientoFormValues>({
    resolver: zodResolver(nacimientoSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      // Sección I — precargada con datos del usuario
      suscribeNombresApellidos: usuario.nombresApellidos,
      suscribeCuiCedula: usuario.cui,
      suscribeNoColegiado: usuario.noColegiado ?? '',
      suscribeNoRegistroComadrona: usuario.noRegistroComadrona ?? '',
      suscribeQuienInforma: 1,  // Siempre Médico/Doctor — predeterminado del sistema
      // Sección II — valores estáticos institucionales
      lugarDepartamento: INSTITUCION.DEPARTAMENTO,
      lugarMunicipio: INSTITUCION.MUNICIPIO,
      lugarDireccion: INSTITUCION.DIRECCION,
      lugarOcurrioNacimiento: INSTITUCION.LUGAR_NACIMIENTO,
      // Sección III — vacíos
      ninoPrimerNombre: '',
      ninoPrimerApellido: '',
      ninoFechaNacimiento: '',
      ninoNumHijosNacidosParto: null,
      ninoHijosNacidosMuertos: null,
      ninoHijosViven: null,
      ninoTotalHijosMadre: null,
      ninoPersonaAtendioElParto: 1,
      // Sección IV — vacíos
      madrePrimerNombre: '',
      madrePrimerApellido: '',
      madreCuiCedula: '',
    },
  })

  const { handleSubmit, reset, watch, formState: { isSubmitting } } = methods
  const formValues = watch()

  // Logging de cambios de paso para diagnóstico
  useEffect(() => {
    console.log(`[NacimientoForm] activeStep cambió a: ${activeStep} (${STEPS[activeStep]})`)
    // CRÍTICO: Al cambiar de paso, resetear allowSubmit para prevenir auto-submit
    setAllowSubmit(false)
  }, [activeStep])

  useEffect(() => {
    if (!existing) return
    // Crear copia para no mutar el objeto original de react-query
    const data = { ...(existing as NacimientoFormValues) }
    // Asegurar campos que pueden llegar null/undefined del servidor
    if (!data.suscribeNoColegiado) data.suscribeNoColegiado = usuario.noColegiado ?? ''
    if (!data.suscribeQuienInforma || typeof data.suscribeQuienInforma !== 'number')
      data.suscribeQuienInforma = 1  // Siempre Médico/Doctor
    if (!data.suscribeNoRegistroComadrona) data.suscribeNoRegistroComadrona = ''
    reset(data)
  }, [existing, reset, usuario.noColegiado, usuario.tipoInformante])

  // Detectar error 404 y redirigir al listado
  useEffect(() => {
    if (loadError && editId) {
      const errorMsg = (loadError as Error).message
      if (errorMsg.includes('404')) {
        console.warn(`[NacimientoForm] Registro ${editId} no encontrado (404). Redirigiendo al listado.`)
        setSnackbar({
          open: true,
          message: `El registro #${editId} no existe o fue eliminado`,
          severity: 'error'
        })
        // Redirigir después de 2 segundos para que el usuario vea el mensaje
        setTimeout(() => navigate('/nacimientos'), 2000)
      }
    }
  }, [loadError, editId, navigate])

  // ── EARLY RETURNS: Después de todos los hooks ──
  // Esperar a que el usuario se cargue antes de renderizar el formulario
  if (usuario.cargando) {
    return <LoadingScreen message="Cargando datos del usuario..." />
  }

  // Si está en modo edición y aún está cargando los datos existentes
  if (editId && isLoading) {
    return (
      <LoadingScreen 
        message="Cargando datos del registro" 
        subtitle="Conectando con el servidor..."
        showProgress={true}
      />
    )
  }

  const handleNext = () => {
    console.log(`[NacimientoForm] handleNext llamado desde paso ${activeStep}`)

    const fields = STEP_FIELDS[activeStep]
    // Si es el último paso, no debe avanzar más (el botón Guardar maneja el submit)
    if (activeStep >= STEPS.length - 1) {
      console.warn('[NacimientoForm] Ya estamos en el último paso. No se puede avanzar más.')
      return
    }

    if (fields.length === 0) {
      console.log(`[NacimientoForm] Paso ${activeStep} sin campos requeridos. Avanzando directamente.`)
      setActiveStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Validar usando safeParse del schema — NO toca el estado del formulario
    // así los campos NO se ponen rojos al presionar Siguiente
    const currentValues = methods.getValues()
    const partial: Partial<Record<string, unknown>> = {}
    fields.forEach(f => { partial[f] = currentValues[f as keyof NacimientoFormValues] })

    // Verificar si los campos requeridos del paso tienen valor
    const missingFields: string[] = []
    const fieldLabelsLocal: Partial<Record<string, string>> = {
      suscribeNombresApellidos: 'Nombres y apellidos',
      suscribeCuiCedula: 'DPI',
      suscribeQuienInforma: 'Quién informa',
      suscribeNoColegiado: 'Número de colegiado',
      ninoFechaNacimiento: 'Fecha de nacimiento',
      ninoSexo: 'Sexo del niño',
      ninoPesoLibras: 'Peso (libras)',
      ninoTallaCm: 'Talla (cm)',
      ninoEdadGestacionalSemanas: 'Semanas de gestación',
      ninoAnomaliasCongenitas: 'Anomalías congénitas',
      ninoTipoParto: 'Tipo de parto',
      ninoNumHijosNacidosParto: 'Hijos en el parto',
      ninoPersonaAtendioElParto: 'Persona que atendió',
      ninoTotalHijosMadre: 'Total hijos de la madre',
      madrePrimerNombre: 'Primer nombre de la madre',
      madrePrimerApellido: 'Primer apellido de la madre',
      madreCuiCedula: 'DPI de la madre',
      madreEdad: 'Edad de la madre',
      madreNacionalidad: 'Nacionalidad de la madre',
      madreOcupacion: 'Ocupación de la madre',
      madreDireccion: 'Dirección de la madre',
      madreMunicipio: 'Municipio de la madre',
      madreDepartamento: 'Departamento de la madre',
      madrePuebloPertenencia: 'Pueblo de pertenencia',
      madreEstadoCivil: 'Estado civil',
      madreEscolaridad: 'Escolaridad',
    }

    for (const field of fields) {
      const val = currentValues[field as keyof NacimientoFormValues]
      const isEmpty = val === null || val === undefined || val === '' ||
        (typeof val === 'number' && isNaN(val))
      if (isEmpty) {
        missingFields.push(fieldLabelsLocal[field] ?? field)
      }
    }

    if (missingFields.length > 0) {
      const msg = missingFields.length === 1
        ? `Falta completar: ${missingFields[0]}`
        : `Faltan ${missingFields.length} campos. Primero: ${missingFields[0]}`
      console.warn(`[NacimientoForm] Validación de paso ${activeStep} falló:`, missingFields)
      setSnackbar({ open: true, message: msg, severity: 'error' })
      return
    }

    console.log(`[NacimientoForm] Validación pasada. Avanzando de paso ${activeStep} a ${activeStep + 1}`)
    setActiveStep((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: NacimientoFormValues) => {
    // ── LOGGING DE DIAGNÓSTICO ──────────────────────────────────────────────
    console.log('═══════════════════════════════════════════════════════════')
    console.log('[NacimientoForm] onSubmit EJECUTADO')
    console.log('  - activeStep actual:', activeStep)
    console.log('  - STEPS.length - 1 (último paso):', STEPS.length - 1)
    console.log('  - editId:', editId)
    console.log('  - allowSubmit:', allowSubmit)
    console.log('  - Modo:', editId ? 'EDICIÓN' : 'CREACIÓN')
    console.log('═══════════════════════════════════════════════════════════')

    // ── PROTECCIÓN: Flag de control (para CREACIÓN y EDICIÓN) ──────────────
    if (!allowSubmit) {
      console.error(' [NacimientoForm] SUBMIT BLOQUEADO: allowSubmit es false')
      console.error('   El usuario NO ha presionado el botón Guardar explícitamente')
      return
    }

    // ── PROTECCIÓN 2: Validación de paso (SOLO para creación) ──────────────
    if (!editId) {
      // En creación: SOLO guardar si estamos exactamente en el último paso (activeStep === 3)
      if (activeStep !== STEPS.length - 1) {
        console.error(` [NacimientoForm] GUARDADO BLOQUEADO`)
        console.error(`   Motivo: Intento de guardar en paso ${activeStep}, pero solo se permite en paso ${STEPS.length - 1}`)
        console.error(`   Estado: Creación (sin editId)`)
        setSnackbar({
          open: true,
          message: 'No se puede guardar en este paso. Avance hasta el paso final.',
          severity: 'error'
        })
        return
      }
      console.log(' [NacimientoForm] Validación pasada: activeStep === último paso en modo creación')
    } else {
      console.log(' [NacimientoForm] Modo edición: permitido guardar en cualquier paso')
    }

    try {
      if (editId) {
        console.log(' [NacimientoForm] Ejecutando actualización...')
        await actualizar.mutateAsync({ id: editId, dto: data })
        setSnackbar({ open: true, message: 'Informe actualizado exitosamente', severity: 'success' })
        // Solo navegar si estamos en el último paso — en pasos intermedios, quedarse
        if (activeStep === STEPS.length - 1) {
          setTimeout(() => navigate('/nacimientos'), 1500)
        }
      } else {
        console.log(' [NacimientoForm] Ejecutando creación...')
        const saved = await crear.mutateAsync(data)
        if (saved.id) {
          await nacimientoApi.cambiarEstado(saved.id, 'COMPLETADO')
        }
        setSnackbar({ open: true, message: 'Informe creado exitosamente', severity: 'success' })
        setTimeout(() => navigate('/nacimientos'), 1500)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el informe'
      console.error(' [NacimientoForm] Error al guardar:', msg)
      setSnackbar({ open: true, message: msg, severity: 'error' })
    } finally {
      // Resetear el flag después del intento de guardado (solo en creación)
      if (!editId) {
        setAllowSubmit(false)
      }
    }
  }

  // Mapeo de campos a pasos para navegar al paso con error
  const FIELD_TO_STEP: Partial<Record<keyof NacimientoFormValues, number>> = {
    suscribeNombresApellidos: 0, suscribeCuiCedula: 0,
    suscribeQuienInforma: 0, suscribeNoColegiado: 0,
    ninoFechaNacimiento: 1, ninoSexo: 1, ninoPesoLibras: 1,
    ninoTallaCm: 1, ninoEdadGestacionalSemanas: 1,
    ninoAnomaliasCongenitas: 1, ninoTipoParto: 1,
    madrePrimerNombre: 2, madrePrimerApellido: 2,
    madreCuiCedula: 2, madreEdad: 2,
  }

  const onInvalid = (errors: FieldErrors<NacimientoFormValues>) => {
    // Log de todos los errores para diagnóstico
    console.error('[NacimientoForm] Errores:', Object.entries(errors).map(([k, v]) => `${k}: ${(v as { message?: string })?.message}`))
    console.error('[NacimientoForm] Errores detalle:', errors) // Log adicional para ver estructura completa
    const errorFields = Object.keys(errors) as (keyof NacimientoFormValues)[]
    const firstField = errorFields[0]
    const targetStep = firstField ? (FIELD_TO_STEP[firstField] ?? 0) : 0

    // Navegar al paso con error
    setActiveStep(targetStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Mostrar cuál campo tiene error
    const fieldLabels: Partial<Record<keyof NacimientoFormValues, string>> = {
      suscribeNombresApellidos: 'Nombres y apellidos',
      suscribeCuiCedula: 'DPI',
      suscribeQuienInforma: 'Quién informa',
      suscribeNoColegiado: 'Número de colegiado',
      ninoFechaNacimiento: 'Fecha de nacimiento',
      ninoSexo: 'Sexo del niño',
      ninoPesoLibras: 'Peso (libras)',
      ninoTallaCm: 'Talla (cm)',
      ninoEdadGestacionalSemanas: 'Semanas de gestación',
      ninoAnomaliasCongenitas: 'Anomalías congénitas',
      ninoTipoParto: 'Tipo de parto',
      madrePrimerNombre: 'Primer nombre de la madre',
      madrePrimerApellido: 'Primer apellido de la madre',
      madreCuiCedula: 'DPI de la madre',
      madreEdad: 'Edad de la madre',
    }

    const label = firstField ? (fieldLabels[firstField] ?? firstField) : 'desconocido'
    const total = errorFields.length
    const msg = total === 1
      ? `Campo con error: ${label}`
      : `${total} campos con errores. Primero: ${label}`

    setSnackbar({ open: true, message: msg, severity: 'error' })
  }

  if (isLoading) return <LoadingScreen message="Cargando informe..." />

  const progress = ((activeStep + 1) / STEPS.length) * 100

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
        onKeyDown={(e) => {
          // PROTECCIÓN: Bloquear Enter en todo el formulario excepto en botones
          // Esto previene que presionar Enter en un campo de texto dispare submit accidental
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault()
          }
        }}
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 }, mb: 2.5,
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(127deg, #0B1437 0%, #1a237e 55%, #0BC5EA 100%)',
            color: 'white',
          }}
        >
          {/* Círculos decorativos */}
          <Box sx={{
            position: 'absolute', right: -30, top: -30,
            width: 120, height: 120, borderRadius: '50%',
            background: 'rgba(11,197,234,0.12)', pointerEvents: 'none',
          }} />
          <Box sx={{
            position: 'absolute', right: 60, bottom: -40,
            width: 90, height: 90, borderRadius: '50%',
            background: 'rgba(67,97,238,0.18)', pointerEvents: 'none',
          }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight={800} align="center" sx={{ letterSpacing: '0.06em' }}>
              REPÚBLICA DE GUATEMALA
            </Typography>
            <Typography variant="subtitle2" align="center" sx={{ opacity: 0.80, fontWeight: 600 }}>
              INFORME DE NACIMIENTO
            </Typography>
          </Box>
        </Paper>

        {/* Stepper */}
        <Paper elevation={0} sx={{ p: 1.5, mb: 2.5, border: 1, borderColor: 'divider', borderRadius: 2 }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{!isMobile ? label : ''}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <LinearProgress variant="determinate" value={progress} />
          {isMobile && (
            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={0.5}>
              {STEPS[activeStep]}
            </Typography>
          )}
        </Paper>

        {/* Secciones — Sección II se incluye silenciosamente (ya precargada) */}
        {activeStep === 0 && <SeccionI />}
        {activeStep === 1 && <SeccionIII />}
        {activeStep === 2 && <SeccionIV />}
        {activeStep === 3 && (
          <>
            <Alert
              severity="info"
              sx={{ mb: 2, borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={600}>
                Datos del padre — opcionales
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 0.25 }}>
                Complete estos datos si están disponibles. Puede dejarlos en blanco y guardar el informe igual.
                Use el botón <strong>Guardar</strong> cuando termine.
              </Typography>
            </Alert>
            <SeccionV />
          </>
        )}

        {/* Navegación */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2.5}
          flexWrap="wrap"
          gap={1}
        >
          {/* Izquierda: Anterior / Cancelar */}
          <Stack direction="row" gap={1}>
            {activeStep > 0 && (
              <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined" type="button">
                Anterior
              </Button>
            )}
            <Button
              type="button"
              variant="outlined"
              color="error"
              onClick={() => navigate('/nacimientos')}
            >
              Cancelar
            </Button>
          </Stack>

          {/* Derecha: Siguiente / Preview+Guardar */}
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
            {activeStep < STEPS.length - 1 ? (
              <>
                {/* En modo edición: Actualizar disponible en cada paso */}
                {editId && (
                  <Button
                    type="submit"
                    variant="outlined"
                    color="success"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting || actualizar.isPending}
                    onClick={() => {
                      console.log('[NacimientoForm] 🔘 Botón ACTUALIZAR presionado. Activando allowSubmit.')
                      setAllowSubmit(true)
                    }}
                  >
                    Actualizar
                  </Button>
                )}
                <Button endIcon={<ArrowForwardIcon />} onClick={handleNext} variant="contained" type="button">
                  Siguiente
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  startIcon={<VisibilityIcon />}
                  onClick={() => setPreviewOpen(true)}
                >
                  Vista previa
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || crear.isPending || actualizar.isPending}
                  size="large"
                  onClick={() => {
                    console.log('[NacimientoForm] 🔘 Botón GUARDAR presionado. Activando allowSubmit.')
                    setAllowSubmit(true)
                  }}
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>

      <NacimientoPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formValues}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </FormProvider>
  )
}
