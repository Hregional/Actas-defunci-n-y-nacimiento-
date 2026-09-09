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

  const [activeStep, setActiveStep] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{
    open: boolean; message: string; severity: 'success' | 'error'
  }>({ open: false, message: '', severity: 'success' })

  const { data: existing, isLoading } = useDefuncionById(editId)
  const crear      = useCrearDefuncion()
  const actualizar = useActualizarDefuncion()

  const methods = useForm<DefuncionFormValues>({
    resolver: zodResolver(defuncionSchema),
    mode: 'onTouched',
    defaultValues: {
      infoQuienInformaNombres: '',
      infoFechaDefuncion:      '',
      fallecidoNombreCompleto: '',
    },
  })

  const { handleSubmit, reset, trigger, watch, formState: { isSubmitting } } = methods
  const formValues = watch()

  useEffect(() => {
    if (existing) reset(existing as DefuncionFormValues)
  }, [existing, reset])

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

  const handleNext = async () => {
    const fields = STEP_FIELDS[activeStep]
    if (fields.length === 0) {
      setActiveStep((prev) => prev + 1)
      return
    }
    const valid = await trigger(fields)
    if (valid) {
      setActiveStep((prev) => prev + 1)
    } else {
      setSnackbar({
        open: true,
        message: 'Corrija los campos marcados en rojo antes de continuar',
        severity: 'error',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => setActiveStep((prev) => prev - 1)

  const onSubmit = async (data: DefuncionFormValues) => {
    try {
      if (editId) {
        await actualizar.mutateAsync({ id: editId, dto: data })
        setSnackbar({ open: true, message: 'Informe actualizado exitosamente', severity: 'success' })
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

  const onInvalid = () => {
    setSnackbar({
      open: true,
      message: 'Hay campos con errores — revise todos los pasos antes de guardar',
      severity: 'error',
    })
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
              <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
                Anterior
              </Button>
            )}
            <Button variant="outlined" color="error" onClick={() => navigate('/defunciones')}>
              Cancelar
            </Button>
          </Stack>

          {/* Derecha: Siguiente / Preview + Guardar */}
          <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
            {activeStep < STEPS.length - 1 ? (
              <Button endIcon={<ArrowForwardIcon />} onClick={handleNext} variant="contained">
                Siguiente
              </Button>
            ) : (
              <>
                <Button
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
