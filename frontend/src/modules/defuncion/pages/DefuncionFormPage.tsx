import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box, Stepper, Step, StepLabel, Button, Stack,
  Alert, Snackbar, Paper, Typography, LinearProgress,
  useMediaQuery, useTheme,
} from '@mui/material'
import ArrowBackIcon    from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SaveIcon          from '@mui/icons-material/Save'
import VisibilityIcon    from '@mui/icons-material/Visibility'
import { defuncionSchema, type DefuncionFormValues } from '../schemas/defuncion.schema'
import { defuncionApi } from '../api/defuncion.api'
import { useDefuncionById, useCrearDefuncion, useActualizarDefuncion } from '../hooks/useDefuncion'
import DefSeccionI   from '../components/DefSeccionI'
import DefSeccionII  from '../components/DefSeccionII'
import DefSeccionIII from '../components/DefSeccionIII'
import DefSeccionIV  from '../components/DefSeccionIV'
import DefSeccionV   from '../components/DefSeccionV'
import DefSeccionVI  from '../components/DefSeccionVI'
import DefSeccionVII from '../components/DefSeccionVII'
import DefuncionPreview from '../components/DefuncionPreview'
import LoadingScreen from '@/shared/components/common/LoadingScreen'
import { useCurrentUser } from '@/shared/context/UserContext'

const STEPS = [
  'I. Info General',
  'II. Fallecido(a)',
  'III. Mujeres Fértiles',
  'IV. Causa',
  'V. Accidental',
  'VI. Fetal',
  'VII. Otros',
]

export default function DefuncionFormPage() {
  const { id } = useParams()
  const editId  = id ? Number(id) : undefined
  const navigate  = useNavigate()
  const theme     = useTheme()
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'))
  const { usuario } = useCurrentUser()

  // IMPORTANTE: Todos los hooks deben estar ANTES de cualquier early return
  const [activeStep, setActiveStep] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [allowSubmit, setAllowSubmit] = useState(false)  // ← Flag de control de submit
  const [snackbar, setSnackbar] = useState<{
    open: boolean; message: string; severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const { data: existing, isLoading, error: loadError } = useDefuncionById(editId)
  const crear      = useCrearDefuncion()
  const actualizar = useActualizarDefuncion()

  const methods = useForm<DefuncionFormValues>({
    resolver: zodResolver(defuncionSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      infoQuienInformaNombres: '',
      infoFechaDefuncion:      '',
      fallecidoNombreCompleto: '',
      infoQuienInformaTipo:    1,  // Médico por defecto
    },
  })

  const { handleSubmit, reset, watch, formState: { isSubmitting } } = methods
  const formValues = watch()

  // Resetear allowSubmit al cambiar de paso
  useEffect(() => {
    console.log(`[DefuncionForm] activeStep cambió a: ${activeStep} (${STEPS[activeStep]})`)
    setAllowSubmit(false)
  }, [activeStep])

  useEffect(() => {
    if (existing) reset(existing as DefuncionFormValues)
  }, [existing, reset])

  // Detectar error 404 y redirigir al listado
  useEffect(() => {
    if (loadError && editId) {
      const errorMsg = (loadError as Error).message
      if (errorMsg.includes('404')) {
        console.warn(`[DefuncionForm] Registro ${editId} no encontrado (404). Redirigiendo al listado.`)
        setSnackbar({
          open: true,
          message: `El registro #${editId} no existe o fue eliminado`,
          severity: 'error'
        })
        // Redirigir después de 2 segundos para que el usuario vea el mensaje
        setTimeout(() => navigate('/defunciones'), 2000)
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

  const STEP_FIELDS: (keyof DefuncionFormValues)[][] = [
    // Sección I — información general (requeridos)
    ['infoQuienInformaNombres', 'infoFechaDefuncion', 'infoQuienInformaTipo', 'infoHoraDefuncion'],
    // Sección II — datos del fallecido (requeridos)
    [
      'fallecidoNombreCompleto', 'fallecidoSexo', 'fallecidoDocNumero',
      'fallecidoLugarNacPais', 'fallecidoLugarNacDepartamento', 'fallecidoLugarNacMunicipio',
      'fallecidoNacionalidad', 'fallecidoOcupacion',
      'fallecidoEstadoCivil', 'fallecidoPuebloPertenencia',
      'fallecidoResidenciaDireccion', 'fallecidoResidenciaMunicipio',
      'fallecidoResidenciaDepartamento', 'fallecidoEscolaridad',
    ],
    // Sección III — mujeres fértiles (opcional, pasa siempre)
    [],
    // Sección IV — causa de defunción (causa directa requerida)
    ['causaIa'],
    // Sección V — accidental/violenta (opcional)
    [],
    // Sección VI — mortinato (opcional, solo si muerte fetal)
    [],
    // Sección VII — otros (requeridos)
    ['otrosHuboNecropsia', 'otrosClaseAsistencia', 'otrosLugarDefuncion'],
  ]

  // Labels para mostrar en los mensajes de error
  const FIELD_LABELS: Partial<Record<keyof DefuncionFormValues, string>> = {
    infoQuienInformaNombres:       'Nombres de quien informa',
    infoFechaDefuncion:            'Fecha de defunción',
    infoQuienInformaTipo:          'Quién informa',
    infoHoraDefuncion:             'Hora de defunción',
    fallecidoNombreCompleto:       'Nombre del fallecido',
    fallecidoSexo:                 'Sexo del fallecido',
    fallecidoDocNumero:            'DPI del fallecido',
    fallecidoLugarNacPais:         'País de nacimiento',
    fallecidoLugarNacDepartamento: 'Departamento de nacimiento',
    fallecidoLugarNacMunicipio:    'Municipio de nacimiento',
    fallecidoNacionalidad:         'Nacionalidad',
    fallecidoOcupacion:            'Ocupación',
    fallecidoEstadoCivil:          'Estado civil',
    fallecidoPuebloPertenencia:    'Pueblo de pertenencia',
    fallecidoResidenciaDireccion:  'Dirección de residencia',
    fallecidoResidenciaMunicipio:  'Municipio de residencia',
    fallecidoResidenciaDepartamento: 'Departamento de residencia',
    fallecidoEscolaridad:          'Escolaridad',
    causaIa:                       'Causa directa de muerte',
    otrosHuboNecropsia:            'Hubo necropsia',
    otrosClaseAsistencia:          'Clase de asistencia',
    otrosLugarDefuncion:           'Lugar de defunción',
  }

  // Mapeo campo → paso para navegar al paso con error en onInvalid
  const FIELD_TO_STEP: Partial<Record<keyof DefuncionFormValues, number>> = {
    infoQuienInformaNombres: 0, infoFechaDefuncion: 0,
    infoQuienInformaTipo: 0,    infoHoraDefuncion: 0,
    fallecidoNombreCompleto: 1, fallecidoSexo: 1, fallecidoDocNumero: 1,
    fallecidoLugarNacPais: 1,   fallecidoNacionalidad: 1, fallecidoOcupacion: 1,
    fallecidoEstadoCivil: 1,    fallecidoPuebloPertenencia: 1, fallecidoEscolaridad: 1,
    fallecidoResidenciaDireccion: 1, fallecidoResidenciaMunicipio: 1,
    causaIa: 3,
    otrosHuboNecropsia: 6, otrosClaseAsistencia: 6, otrosLugarDefuncion: 6,
  }

  const handleNext = () => {
    const fields = STEP_FIELDS[activeStep]
    if (fields.length === 0) {
      setActiveStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Validación manual sin trigger() para no poner campos rojos al navegar
    const currentValues = methods.getValues()
    const missing: string[] = []
    for (const field of fields) {
      const val = currentValues[field as keyof DefuncionFormValues]
      const empty = val === null || val === undefined || val === '' ||
                    (typeof val === 'number' && isNaN(val))
      if (empty) missing.push(FIELD_LABELS[field as keyof DefuncionFormValues] ?? String(field))
    }
    if (missing.length > 0) {
      const msg = missing.length === 1
        ? `Falta completar: ${missing[0]}`
        : `Faltan ${missing.length} campos. Primero: ${missing[0]}`
      setSnackbar({ open: true, message: msg, severity: 'error' })
      return
    }
    setActiveStep((prev) => prev + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onSubmit = async (data: DefuncionFormValues) => {
    console.log('[DefuncionForm] onSubmit EJECUTADO')
    console.log('  - editId:', editId)
    console.log('  - allowSubmit:', allowSubmit)
    console.log('  - Modo:', editId ? 'EDICIÓN' : 'CREACIÓN')

    // ── PROTECCIÓN: Flag de control (para CREACIÓN y EDICIÓN) ──────────────
    if (!allowSubmit) {
      console.error(' [DefuncionForm] SUBMIT BLOQUEADO: allowSubmit es false')
      console.error('   El usuario NO ha presionado el botón Guardar explícitamente')
      return
    }

    try {
      if (editId) {
        await actualizar.mutateAsync({ id: editId, dto: data })
        setSnackbar({ open: true, message: 'Informe actualizado exitosamente', severity: 'success' })
        // Solo navegar si estamos en el último paso — en pasos intermedios, quedarse
        if (activeStep === STEPS.length - 1) {
          setTimeout(() => navigate('/defunciones'), 1500)
        }
      } else {
        const saved = await crear.mutateAsync(data)
        if (saved.id) {
          await defuncionApi.cambiarEstado(saved.id, 'COMPLETADO')
        }
        setSnackbar({ open: true, message: 'Informe creado exitosamente', severity: 'success' })
        setTimeout(() => navigate('/defunciones'), 1500)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar el informe'
      setSnackbar({ open: true, message: msg, severity: 'error' })
    }
  }

  const onInvalid = (errors: Record<string, unknown>) => {
    const errorFields = Object.keys(errors) as (keyof DefuncionFormValues)[]
    const firstField  = errorFields[0]
    const targetStep  = firstField ? (FIELD_TO_STEP[firstField] ?? 0) : 0
    setActiveStep(targetStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const label = firstField ? (FIELD_LABELS[firstField] ?? String(firstField)) : 'desconocido'
    const total = errorFields.length
    const msg   = total === 1
      ? `Campo con error: ${label}`
      : `${total} campos con errores. Primero: ${label}`
    setSnackbar({ open: true, message: msg, severity: 'error' })
  }

  if (isLoading) return <LoadingScreen message="Cargando informe..." />

  const progress = ((activeStep + 1) / STEPS.length) * 100

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 }, mb: 2.5,
            border: 1, borderColor: 'divider', borderRadius: 2,
            background: 'linear-gradient(135deg, #003087 0%, #0057B8 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h6" fontWeight={800} align="center" sx={{ letterSpacing: '0.05em' }}>
            REPÚBLICA DE GUATEMALA
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{ opacity: 0.9 }}>
            INFORME DE DEFUNCIÓN
          </Typography>
          <Typography variant="caption" align="center" display="block" sx={{ opacity: 0.75, mt: 0.3 }}>
            (INCLUYE DEFUNCIONES FETALES) — Revisión 2016
          </Typography>
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

        {/* Secciones */}
        {activeStep === 0 && <DefSeccionI />}
        {activeStep === 1 && <DefSeccionII />}
        {activeStep === 2 && <DefSeccionIII />}
        {activeStep === 3 && <DefSeccionIV />}
        {activeStep === 4 && <DefSeccionV />}
        {activeStep === 5 && <DefSeccionVI />}
        {activeStep === 6 && <DefSeccionVII />}

        {/* Navegación */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2.5} flexWrap="wrap" gap={1}>
          {/* Izquierda: Anterior + Cancelar */}
          <Stack direction="row" gap={1}>
            {activeStep > 0 && (
              <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined" type="button">
                Anterior
              </Button>
            )}
            <Button type="button" variant="outlined" color="error" onClick={() => navigate('/defunciones')}>
              Cancelar
            </Button>
          </Stack>

          {/* Derecha: Siguiente / Preview + Guardar */}
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
                    onClick={() => setAllowSubmit(true)}
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
                  onClick={() => setAllowSubmit(true)}
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </Button>
              </>
            )}
          </Stack>
        </Stack>
      </Box>

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

      <DefuncionPreview
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        data={formValues}
      />
    </FormProvider>
  )
}
