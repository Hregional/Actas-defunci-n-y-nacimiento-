import { useState, useEffect, useRef } from 'react'
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
import { cuiValido } from '@/shared/utils/cuiValidator'
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
  // Ref mutable: indica si el submit fue disparado por un botón explícito del usuario.
  // Se usa ref (no state) para que sea síncrono — el handler lo lee en el mismo ciclo
  // en que handleSubmit lo llama, sin esperar un re-render.
  const submitIntentRef = useRef(false)
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
      madreEstadoCivil: null as unknown as number,
      madrePuebloPertenencia: null as unknown as number,
      madreEscolaridad: null as unknown as number,
    },
  })

  const { handleSubmit, reset, watch, formState: { isSubmitting } } = methods
  const formValues = watch()

  // Al cambiar de paso, resetear el intent de submit y hacer scroll al inicio
  useEffect(() => {
    submitIntentRef.current = false
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
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

    // Validación especial paso 2 (Sección IV - Madre): Si NO hay DPI guatemalteco válido,
    // departamento y municipio deben seleccionarse manualmente
    if (activeStep === 2) {
      const dpiMadre = currentValues.madreCuiCedula as string | undefined
      const esGuatemalteco = dpiMadre && dpiMadre.replace(/\s/g, '').length === 13 && cuiValido(dpiMadre)
      
      if (!esGuatemalteco) {
        // Sin DPI guatemalteco, validar que departamento y municipio estén completos
        if (!currentValues.madreDepartamento || (currentValues.madreDepartamento as string).trim() === '') {
          if (!missingFields.includes('Departamento de la madre')) {
            missingFields.push('Departamento de la madre')
          }
        }
        if (!currentValues.madreMunicipio || (currentValues.madreMunicipio as string).trim() === '') {
          if (!missingFields.includes('Municipio de la madre')) {
            missingFields.push('Municipio de la madre')
          }
        }
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
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const onSubmit = async (data: NacimientoFormValues) => {
    // Verificar que el submit fue iniciado por un botón explícito del usuario
    if (!submitIntentRef.current) return
    submitIntentRef.current = false

    try {
      if (editId) {
        await actualizar.mutateAsync({ id: editId, dto: data })
        setSnackbar({ open: true, message: 'Informe actualizado exitosamente', severity: 'success' })
        setTimeout(() => navigate('/nacimientos'), 1500)
      } else {
        const saved = await crear.mutateAsync(data)
        if (saved.id) {
          await nacimientoApi.cambiarEstado(saved.id, 'COMPLETADO')
        }
        setSnackbar({ open: true, message: 'Informe creado exitosamente', severity: 'success' })
        setTimeout(() => navigate('/nacimientos'), 1500)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el informe'
      setSnackbar({ open: true, message: msg, severity: 'error' })
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
    submitIntentRef.current = false
    const errorFields = Object.keys(errors) as (keyof NacimientoFormValues)[]
    const firstField = errorFields[0]
    const targetStep = firstField ? (FIELD_TO_STEP[firstField] ?? 0) : 0
    setActiveStep(targetStep)
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
        onSubmit={(e) => e.preventDefault()}
        noValidate
        onKeyDown={(e) => {
          // Bloquear Enter para prevenir submit accidental
          if (e.key === 'Enter' && (e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault()
          }
        }}
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 }, mb: 3,
            border: 1, borderColor: 'divider',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #0057B8 0%, #00A8CC 60%, #26C6DA 100%)',
            color: 'white',
            boxShadow: '0 6px 30px rgba(0, 87, 184, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
              borderRadius: '50%',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" fontWeight={800} align="center" sx={{ 
              letterSpacing: '0.08em',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
            }}>
              REPÚBLICA DE GUATEMALA
            </Typography>
            <Typography variant="subtitle2" align="center" sx={{ 
              opacity: 0.95, 
              mt: 0.5,
              fontWeight: 600,
            }}>
              INFORME DE NACIMIENTO
            </Typography>
          </Box>
        </Paper>

        {/* Stepper */}
        <Paper elevation={0} sx={{ 
          p: 2, mb: 3, 
          border: 1, borderColor: 'divider', borderRadius: 2.5,
          background: 'linear-gradient(180deg, rgba(0, 168, 204, 0.03) 0%, rgba(0, 87, 184, 0.06) 50%, rgba(0, 48, 135, 0.03) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 1.5 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{!isMobile ? label : ''}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <LinearProgress 
            variant="determinate" 
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'rgba(0, 168, 204, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, #0057B8 0%, #00A8CC 50%, #26C6DA 100%)',
              },
            }}
          />
          {isMobile && (
            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1} fontWeight={600}>
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
                    type="button"
                    variant="outlined"
                    color="success"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting || actualizar.isPending}
                    onClick={() => {
                      submitIntentRef.current = true
                      handleSubmit(onSubmit, onInvalid)()
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
                  type="button"
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || crear.isPending || actualizar.isPending}
                  size="large"
                  onClick={() => {
                    submitIntentRef.current = true
                    handleSubmit(onSubmit, onInvalid)()
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
