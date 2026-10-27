import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
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
import { defuncionSchema, type DefuncionFormValues } from '../schemas/defuncion.schema'
import { defuncionApi } from '../api/defuncion.api'
import { useDefuncionById, useCrearDefuncion, useActualizarDefuncion } from '../hooks/useDefuncion'
import DefSeccionI from '../components/DefSeccionI'
import DefSeccionII from '../components/DefSeccionII'
import DefSeccionIII from '../components/DefSeccionIII'
import DefSeccionIV from '../components/DefSeccionIV'
import DefSeccionV from '../components/DefSeccionV'
import DefSeccionVI from '../components/DefSeccionVI'
import DefSeccionVII from '../components/DefSeccionVII'
import DefuncionPreview from '../components/DefuncionPreview'
import LoadingScreen from '@/shared/components/common/LoadingScreen'
import { useCurrentUser } from '@/shared/context/UserContext'
import { cuiValido } from '@/shared/utils/cuiValidator'

// Labels para mostrar en los mensajes de error (constante estática)
const FIELD_LABELS: Partial<Record<keyof DefuncionFormValues, string>> = {
  infoQuienInformaNombres: 'Nombres de quien informa',
  infoFechaDefuncion: 'Fecha de defunción',
  infoQuienInformaTipo: 'Quién informa',
  infoHoraDefuncion: 'Hora de defunción',
  infoTipoMuerte: 'Tipo de defunción',
  fallecidoNombreCompleto: 'Nombre del fallecido',
  fallecidoSexo: 'Sexo del fallecido',
  fallecidoDocNumero: 'DPI del fallecido',
  fallecidoLugarNacPais: 'País de nacimiento',
  fallecidoLugarNacDepartamento: 'Departamento de nacimiento',
  fallecidoLugarNacMunicipio: 'Municipio de nacimiento',
  fallecidoNacionalidad: 'Nacionalidad',
  fallecidoOcupacion: 'Ocupación',
  fallecidoEstadoCivil: 'Estado civil',
  fallecidoPuebloPertenencia: 'Pueblo de pertenencia',
  fallecidoResidenciaDireccion: 'Dirección de residencia',
  fallecidoResidenciaMunicipio: 'Municipio de residencia',
  fallecidoResidenciaDepartamento: 'Departamento de residencia',
  fallecidoEscolaridad: 'Escolaridad',
  causaIa: 'Causa directa de muerte',
  otrosHuboNecropsia: 'Hubo necropsia',
  otrosClaseAsistencia: 'Clase de asistencia',
  otrosLugarDefuncion: 'Lugar de defunción',
}

export default function DefuncionFormPage() {
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

  const { data: existing, isLoading, error: loadError } = useDefuncionById(editId)
  const crear = useCrearDefuncion()
  const actualizar = useActualizarDefuncion()

  const methods = useForm<DefuncionFormValues>({
    resolver: zodResolver(defuncionSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      infoQuienInformaNombres: '',
      infoFechaDefuncion: '',
      fallecidoNombreCompleto: '',
      infoQuienInformaTipo: 1,
      infoTipoMuerte: 1,
      // Valores por defecto para campos de selección (CardOptionGroup)
      // null evita que RHF los resetee al re-renderizar
      fallecidoSexo: null as unknown as number,
      fallecidoEstadoCivil: null as unknown as number,
      fallecidoPuebloPertenencia: null as unknown as number,
      fallecidoEscolaridad: null as unknown as number,
      // Sección VII
      otrosHuboNecropsia: null as unknown as number,
      otrosClaseAsistencia: null as unknown as number,
      otrosLugarDefuncion: null as unknown as number,
    },
  })

  const { handleSubmit, reset, watch, clearErrors, formState: { isSubmitting } } = methods
  const formValues = watch()
  const tipoMuerte = watch('infoTipoMuerte') // Observar el tipo de muerte

  // Generar pasos dinámicos según el tipo de muerte (memoizado para evitar re-renders)
  const STEPS = useMemo(() => tipoMuerte === 2
    ? [
      'I. Info General',
      'VI. Datos Fetal',
      'VII. Otros',
    ]
    : [
      'I. Info General',
      'II. Fallecido(a)',
      'III. Mujeres Fértiles',
      'IV. Causa',
      'V. Accidental',
      'VII. Otros',
    ], [tipoMuerte])

  // Resetear intent y limpiar errores al cambiar de paso
  useEffect(() => {
    submitIntentRef.current = false
    clearErrors()
    setSnackbar({ open: false, message: '', severity: 'success' })
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [activeStep, clearErrors])

  // Resetear paso activo si cambia el tipo de muerte y el paso actual ya no existe
  useEffect(() => {
    if (activeStep >= STEPS.length) {
      console.log(`[DefuncionForm] Tipo de muerte cambió. Reseteando al paso 0.`)
      setActiveStep(0)
      clearErrors() // Limpiar errores al cambiar tipo
    }
  }, [tipoMuerte, activeStep, STEPS.length, clearErrors])

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

  // Memoizar STEP_FIELDS para evitar re-renders
  const STEP_FIELDS = useMemo<(keyof DefuncionFormValues)[][]>(() =>
    tipoMuerte === 2
      ? [
        // MUERTE FETAL: Solo 3 pasos
        // Paso 0: Sección I — información general (infoNoColegiado se valida condicionalmente)
        ['infoQuienInformaNombres', 'infoFechaDefuncion', 'infoQuienInformaTipo', 'infoHoraDefuncion', 'infoTipoMuerte'],
        // Paso 1: Sección VI — datos fetal (todos opcionales según schema, puede estar vacío)
        [],
        // Paso 2: Sección VII — otros (requeridos)
        ['otrosHuboNecropsia', 'otrosClaseAsistencia', 'otrosLugarDefuncion'],
      ]
      : [
        // DEFUNCIÓN NORMAL: 6 pasos
        // Paso 0: Sección I — información general (infoNoColegiado se valida condicionalmente)
        ['infoQuienInformaNombres', 'infoFechaDefuncion', 'infoQuienInformaTipo', 'infoHoraDefuncion', 'infoTipoMuerte'],
        // Paso 1: Sección II — datos del fallecido (edad se valida condicionalmente)
        [
          'fallecidoNombreCompleto', 'fallecidoSexo', 'fallecidoDocNumero',
          'fallecidoLugarNacPais', 'fallecidoLugarNacDepartamento', 'fallecidoLugarNacMunicipio',
          'fallecidoNacionalidad', 'fallecidoOcupacion',
          'fallecidoEstadoCivil', 'fallecidoPuebloPertenencia',
          'fallecidoResidenciaDireccion', 'fallecidoResidenciaMunicipio',
          'fallecidoResidenciaDepartamento', 'fallecidoEscolaridad',
        ],
        // Paso 2: Sección III — mujeres fértiles (opcional, pasa siempre)
        [],
        // Paso 3: Sección IV — causa de defunción (causa directa requerida)
        ['causaIa'],
        // Paso 4: Sección V — accidental/violenta (opcional, pasa siempre)
        [],
        // Paso 5: Sección VII — otros (requeridos)
        ['otrosHuboNecropsia', 'otrosClaseAsistencia', 'otrosLugarDefuncion'],
      ]
    , [tipoMuerte])

  // Mapeo campo → paso para navegar al paso con error en onInvalid (memoizado)
  const FIELD_TO_STEP = useMemo<Partial<Record<keyof DefuncionFormValues, number>>>(() =>
    tipoMuerte === 2
      ? {
        // MUERTE FETAL: 3 pasos (índices 0, 1, 2)
        infoQuienInformaNombres: 0, infoFechaDefuncion: 0,
        infoQuienInformaTipo: 0, infoHoraDefuncion: 0, infoTipoMuerte: 0,
        // Paso 1: Sección VI (opcional)
        // Paso 2: Sección VII
        otrosHuboNecropsia: 2, otrosClaseAsistencia: 2, otrosLugarDefuncion: 2,
      }
      : {
        // DEFUNCIÓN NORMAL: 6 pasos (índices 0, 1, 2, 3, 4, 5)
        infoQuienInformaNombres: 0, infoFechaDefuncion: 0,
        infoQuienInformaTipo: 0, infoHoraDefuncion: 0, infoTipoMuerte: 0,
        fallecidoNombreCompleto: 1, fallecidoSexo: 1, fallecidoDocNumero: 1,
        fallecidoLugarNacPais: 1, fallecidoNacionalidad: 1, fallecidoOcupacion: 1,
        fallecidoEstadoCivil: 1, fallecidoPuebloPertenencia: 1, fallecidoEscolaridad: 1,
        fallecidoResidenciaDireccion: 1, fallecidoResidenciaMunicipio: 1,
        causaIa: 3,
        // Paso 5: Sección VII (no paso 6)
        otrosHuboNecropsia: 5, otrosClaseAsistencia: 5, otrosLugarDefuncion: 5,
      }
    , [tipoMuerte])

  const handleNext = () => {
    const fields = STEP_FIELDS[activeStep]

    // Si el paso no tiene campos requeridos, avanzar directamente
    if (fields.length === 0) {
      clearErrors() // Limpiar errores antes de cambiar paso
      setActiveStep((prev) => prev + 1)
      return
    }

    // Validación sin trigger() para no poner campos rojos al navegar
    const currentValues = methods.getValues()
    const missing: string[] = []

    // ── 1. Validar campos del array STEP_FIELDS ──────────────────────────
    for (const field of fields) {
      const val = currentValues[field as keyof DefuncionFormValues]
      const empty = val === null || val === undefined || val === '' ||
        (typeof val === 'number' && isNaN(val))
      if (empty) {
        const label = FIELD_LABELS[field as keyof DefuncionFormValues] ?? String(field)
        missing.push(label)
      }
    }

    // ── 2. Validaciones especiales condicionales ──────────────────────────

    // Paso 0: Si es médico (tipo 1), el número de colegiado es obligatorio
    if (activeStep === 0 && currentValues.infoQuienInformaTipo === 1) {
      if (!currentValues.infoNoColegiado || currentValues.infoNoColegiado.trim() === '') {
        missing.push('No. de colegiado (requerido para médicos)')
        // Activar error visual en el campo
        methods.setError('infoNoColegiado', {
          type: 'manual',
          message: 'El número de colegiado es requerido para médicos'
        })
      }
    }

    // Paso 1 (Defunción Normal): Validar edad y depto/muni sin DPI
    if (tipoMuerte === 1 && activeStep === 1) {
      // Validar que al menos un campo de edad esté completo
      const tieneEdad = (currentValues.fallecidoEdadHoras != null && currentValues.fallecidoEdadHoras > 0) ||
        (currentValues.fallecidoEdadDias != null && currentValues.fallecidoEdadDias > 0) ||
        (currentValues.fallecidoEdadMeses != null && currentValues.fallecidoEdadMeses > 0) ||
        (currentValues.fallecidoEdadAnos != null && currentValues.fallecidoEdadAnos > 0)

      if (!tieneEdad) {
        missing.push('Edad del fallecido (horas, días, meses o años)')
      }

      // Si NO hay DPI guatemalteco válido, los departamentos y municipios deben seleccionarse manualmente
      const dpi = currentValues.fallecidoDocNumero
      const esGuatemalteco = dpi && dpi.replace(/\s/g, '').length === 13 && cuiValido(dpi)

      if (!esGuatemalteco) {
        // Validar departamento y municipio de nacimiento
        if (!currentValues.fallecidoLugarNacDepartamento || currentValues.fallecidoLugarNacDepartamento.trim() === '') {
          if (!missing.includes('Departamento de nacimiento')) {
            missing.push('Departamento de nacimiento')
          }
        }
        if (!currentValues.fallecidoLugarNacMunicipio || currentValues.fallecidoLugarNacMunicipio.trim() === '') {
          if (!missing.includes('Municipio de nacimiento')) {
            missing.push('Municipio de nacimiento')
          }
        }
        // Validar departamento y municipio de residencia
        if (!currentValues.fallecidoResidenciaDepartamento || currentValues.fallecidoResidenciaDepartamento.trim() === '') {
          if (!missing.includes('Departamento de residencia')) {
            missing.push('Departamento de residencia')
          }
        }
        if (!currentValues.fallecidoResidenciaMunicipio || currentValues.fallecidoResidenciaMunicipio.trim() === '') {
          if (!missing.includes('Municipio de residencia')) {
            missing.push('Municipio de residencia')
          }
        }
      }
    }

    // ── 3. Mostrar errores si los hay ─────────────────────────────────────
    if (missing.length > 0) {
      const msg = missing.length === 1
        ? `Falta completar: ${missing[0]}`
        : `Faltan ${missing.length} campos. Primero: ${missing[0]}`
      console.warn(`[DefuncionForm] Validación de paso ${activeStep} falló:`, missing)
      setSnackbar({ open: true, message: msg, severity: 'error' })
      return
    }

    // ── 4. Validación pasada, avanzar ─────────────────────────────────────
    console.log(`[DefuncionForm] Validación pasada. Avanzando de paso ${activeStep} a ${activeStep + 1}`)
    clearErrors() // Limpiar errores acumulados antes de mostrar el siguiente paso
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const onSubmit = async (data: DefuncionFormValues) => {
    if (!submitIntentRef.current) return
    submitIntentRef.current = false

    try {
      if (editId) {
        await actualizar.mutateAsync({ id: editId, dto: data })
        setSnackbar({ open: true, message: 'Informe actualizado exitosamente', severity: 'success' })
        setTimeout(() => navigate('/defunciones'), 1500)
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
    submitIntentRef.current = false
    const errorFields = Object.keys(errors) as (keyof DefuncionFormValues)[]
    const firstField = errorFields[0]
    const targetStep = firstField ? (FIELD_TO_STEP[firstField] ?? 0) : 0
    setActiveStep(targetStep)
    const label = firstField ? (FIELD_LABELS[firstField] ?? String(firstField)) : 'desconocido'
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
      <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 }, mb: 3,
            border: 1, borderColor: 'divider',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #003087 0%, #0057B8 60%, #1976D2 100%)',
            color: 'white',
            boxShadow: '0 6px 30px rgba(0, 48, 135, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              right: '-10%',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            },
          }}
        >
          <Typography variant="h6" fontWeight={800} align="center" sx={{
            letterSpacing: '0.08em',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            zIndex: 1,
          }}>
            REPÚBLICA DE GUATEMALA
          </Typography>
          <Typography variant="subtitle2" align="center" sx={{
            opacity: 0.95,
            mt: 0.5,
            fontWeight: 600,
            position: 'relative',
            zIndex: 1,
          }}>
            INFORME DE DEFUNCIÓN
          </Typography>
          <Typography variant="caption" align="center" display="block" sx={{
            opacity: 0.88,
            mt: 0.5,
            fontStyle: 'italic',
            position: 'relative',
            zIndex: 1,
          }}>
            (INCLUYE DEFUNCIONES FETALES) — Revisión 2016
          </Typography>
        </Paper>

        {/* Stepper */}
        <Paper elevation={0} sx={{
          p: 2, mb: 3,
          border: 1, borderColor: 'divider', borderRadius: 2.5,
          background: 'linear-gradient(180deg, rgba(0, 48, 135, 0.03) 0%, rgba(0, 87, 184, 0.06) 50%, rgba(0, 168, 204, 0.03) 100%)',
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
              backgroundColor: 'rgba(0, 48, 135, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                background: 'linear-gradient(90deg, #003087 0%, #0057B8 50%, #00A8CC 100%)',
              },
            }}
          />
          {isMobile && (
            <Typography variant="caption" color="text.secondary" align="center" display="block" mt={1} fontWeight={600}>
              {STEPS[activeStep]}
            </Typography>
          )}
        </Paper>

        {/* Secciones - Renderizado dinámico según tipo de muerte */}
        {tipoMuerte === 2 ? (
          // MUERTE FETAL - Solo 3 secciones
          <>
            {activeStep === 0 && <DefSeccionI />}
            {activeStep === 1 && <DefSeccionVI />}
            {activeStep === 2 && <DefSeccionVII />}
          </>
        ) : (
          // DEFUNCIÓN NORMAL - 6 secciones (pasos 0-5)
          <>
            {activeStep === 0 && <DefSeccionI />}
            {activeStep === 1 && <DefSeccionII />}
            {activeStep === 2 && <DefSeccionIII />}
            {activeStep === 3 && <DefSeccionIV />}
            {activeStep === 4 && <DefSeccionV />}
            {activeStep === 5 && <DefSeccionVII />}
          </>
        )}

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
                {/* En modo edición: Actualizar disponible en cada paso SOLO si el registro ya estaba completo */}
                {editId && existing?.otrosHuboNecropsia && (
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
