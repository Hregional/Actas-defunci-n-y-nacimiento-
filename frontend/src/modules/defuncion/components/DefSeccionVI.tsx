import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, Typography, Divider, Alert, Box,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PersonIcon from '@mui/icons-material/Person'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import ChildCareIcon from '@mui/icons-material/ChildCare'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import GroupsIcon from '@mui/icons-material/Groups'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EventIcon from '@mui/icons-material/Event'
import ContentCutIcon from '@mui/icons-material/ContentCut'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import SectionCard from '@/shared/components/common/SectionCard'
import SmartField from '@/shared/components/common/SmartField'
import DpiField from '@/shared/components/common/DpiField'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
import DeptoMuniSelector from '@/shared/components/common/DeptoMuniSelector'
import DeptoMuniMexSelector from '@/shared/components/common/DeptoMuniMexSelector'
import DocumentoSelector from '@/shared/components/common/DocumentoSelector'
import BuscadorPacienteFhir, { type ModoBusqueda } from '@/shared/components/common/BuscadorPacienteFhir'
import { cuiValido, deptoMuniDesdeCui } from '@/shared/utils/cuiValidator'
import { mapearDatosFhirCompleto } from '@/shared/utils/fhirMapper'
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'
import { getDocumentoInfo } from '@/shared/hooks/useDocumentoInfo'
import type { TipoDocumento } from '@/shared/hooks/useDocumentoInfo'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'
import type { PersonaFhirDTO } from '@/shared/api/fhir.api'

const SEXO_FETO_OPTS = [
  { value: 1, label: 'Hombre', icon: <MaleIcon sx={{ fontSize: 20 }} />, color: '#1565C0' },
  { value: 2, label: 'Mujer', icon: <FemaleIcon sx={{ fontSize: 20 }} />, color: '#AD1457' },
  { value: 9, label: 'Ignorado', icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, color: '#757575' },
]

const ESTADO_CIVIL_OPTIONS = [
  { value: 1, label: 'Soltera', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#9C27B0' },
  { value: 2, label: 'Casada', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#E91E63' },
]

const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' },
  { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' },
  { value: 4, label: 'Mestizo, Ladino' },
  { value: 5, label: 'Ninguno' },
  { value: 9, label: 'Ignorado' },
]

const ESCOLARIDAD_OPTIONS = [
  { value: 0, label: 'Ninguna' },
  { value: 1, label: 'Primaria incompleta' },
  { value: 2, label: 'Primaria completa' },
  { value: 3, label: 'Básico incompleto' },
  { value: 4, label: 'Básico completo' },
  { value: 5, label: 'Diversificado incompleto' },
  { value: 6, label: 'Diversificado completo' },
  { value: 7, label: 'Universitario incompleto' },
  { value: 8, label: 'Universitario completo' },
  { value: 9, label: 'Ignorado' },
]

const SABE_LEER_OPTIONS = [
  { value: 1, label: 'Sí', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: '#4CAF50' },
  { value: 2, label: 'No', icon: <CancelIcon sx={{ fontSize: 20 }} />, color: '#F44336' },
  { value: 9, label: 'Ignorado', icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, color: '#9E9E9E' },
]

const MURIO_OPTIONS = [
  { value: 1, label: 'Antes del Parto', icon: <EventIcon sx={{ fontSize: 20 }} />, color: '#FF6F00' },
  { value: 2, label: 'Durante el Parto', icon: <PregnantWomanIcon sx={{ fontSize: 20 }} />, color: '#D32F2F' },
]

const PARTO_FUE_OPTIONS = [
  { value: 1, label: 'Simple', icon: <ChildCareIcon sx={{ fontSize: 20 }} />, color: '#1976D2' },
  { value: 2, label: 'Doble', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#7B1FA2' },
  { value: 3, label: 'Múltiple', icon: <GroupsIcon sx={{ fontSize: 20 }} />, color: '#C2185B' },
]

const CLASE_PARTO_OPTIONS = [
  { value: 1, label: 'Eutócico (Normal)', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: '#4CAF50' },
  { value: 2, label: 'Distócico (Complicado)', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: '#F57C00' },
]

const VIA_PARTO_OPTIONS = [
  { value: 1, label: 'Vaginal', icon: <PregnantWomanIcon sx={{ fontSize: 20 }} />, color: '#7B1FA2' },
  { value: 2, label: 'Cesárea', icon: <ContentCutIcon sx={{ fontSize: 20 }} />, color: '#D32F2F' },
]

export default function DefSeccionVI() {
  const { register, control, watch, setValue, resetField } = useFormContext<DefuncionFormValues>()
  
  // fhirTieneDpi: true cuando el paciente encontrado via FHIR tiene CUI guatemalteco.
  const [fhirTieneDpi, setFhirTieneDpi] = useState(false)

  const [datosDeFhir, setDatosDeFhir] = useState<ModoBusqueda | false>(false)
  
  const dpiMadre = watch('mortinatoMadreDocNumero')
  const mortinatoMadreDocTipo = ((watch('mortinatoMadreDocTipo') ?? 'DPI_GT') as TipoDocumento)
  const mortinatoMadrePaisPasaporte = watch('mortinatoMadrePaisPasaporte') ?? undefined

  const docInfo = getDocumentoInfo(mortinatoMadreDocTipo, mortinatoMadrePaisPasaporte ?? undefined)

  // Detectar si el DPI es guatemalteco válido
  const dpiGuatemalteco = mortinatoMadreDocTipo === 'DPI_GT' && dpiMadre && dpiMadre.replace(/\s/g, '').length === 13 && cuiValido(dpiMadre)

  // Handler cuando cambia el tipo de documento
  const handleTipoChange = (tipo: TipoDocumento) => {
    setValue('mortinatoMadreDocTipo', tipo, { shouldValidate: false })
    setValue('mortinatoMadreLugarNacDepartamento', '', { shouldValidate: false })
    setValue('mortinatoMadreLugarNacMunicipio', '', { shouldValidate: false })
    setValue('mortinatoMadreResidenciaDepartamento', '', { shouldValidate: false })
    setValue('mortinatoMadreResidenciaMunicipio', '', { shouldValidate: false })
    setValue('mortinatoMadreDocNumero', '', { shouldValidate: false })
    const info = getDocumentoInfo(tipo)
    if (info.nacionalidadDefault) {
      setValue('mortinatoMadreNacionalidad', info.nacionalidadDefault, { shouldValidate: false })
    }
  }

  // Handler cuando se encuentra un paciente en FHIR
  const handlePacienteEncontrado = (paciente: PersonaFhirDTO, modo: ModoBusqueda) => {
    const tieneDpi = !!paciente.cui

    // ── RESET ──
    setValue('mortinatoMadreDocNumero', '', { shouldValidate: false })
    setValue('mortinatoMadreNombre', '', { shouldValidate: false })
    resetField('mortinatoMadreEdad')
    setValue('mortinatoMadreNacionalidad', '', { shouldValidate: false })
    setValue('mortinatoMadreOcupacion', '', { shouldValidate: false })
    setValue('mortinatoMadreLugarNacPais', '', { shouldValidate: false })
    setValue('mortinatoMadreLugarNacDepartamento', '', { shouldValidate: false })
    setValue('mortinatoMadreLugarNacMunicipio', '', { shouldValidate: false })
    setValue('mortinatoMadreResidenciaDireccion', '', { shouldValidate: false })
    setValue('mortinatoMadreResidenciaMunicipio', '', { shouldValidate: false })
    setValue('mortinatoMadreResidenciaDepartamento', '', { shouldValidate: false })
    resetField('mortinatoMadreEstadoCivil')
    resetField('mortinatoMadrePuebloPertenencia')
    resetField('mortinatoMadreEscolaridad')
    resetField('mortinatoMadreSabeLeer')

    // ── Fijar tipo de documento ──
    if (tieneDpi) {
      setValue('mortinatoMadreDocTipo', 'DPI_GT', { shouldValidate: false })
      setValue('mortinatoMadreDocNumero', paciente.cui!, { shouldValidate: true })
    }

    if (paciente.nombreCompleto) setValue('mortinatoMadreNombre', paciente.nombreCompleto, { shouldValidate: true })
    if (paciente.edad != null) setValue('mortinatoMadreEdad', paciente.edad, { shouldValidate: true })
    if (paciente.ocupacion) setValue('mortinatoMadreOcupacion', paciente.ocupacion, { shouldValidate: true })
    if (paciente.direccion) setValue('mortinatoMadreResidenciaDireccion', paciente.direccion, { shouldValidate: true })

    const resultadoMapeo = mapearDatosFhirCompleto({
      departamento: paciente.departamento,
      municipio: paciente.municipio,
      cui: paciente.cui,
      estadoCivil: paciente.estadoCivil,
      puebloPertenencia: paciente.puebloPertenencia,
      nacionalidad: paciente.nacionalidad
    }, 'femenino')

    if (resultadoMapeo.data.departamento) {
      setValue('mortinatoMadreLugarNacDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
      setValue('mortinatoMadreResidenciaDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
    }
    if (resultadoMapeo.data.municipio) {
      setValue('mortinatoMadreLugarNacMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
      setValue('mortinatoMadreResidenciaMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
    }
    if (resultadoMapeo.data.estadoCivil) setValue('mortinatoMadreEstadoCivil', resultadoMapeo.data.estadoCivil, { shouldValidate: true })
    if (resultadoMapeo.data.puebloPertenencia) setValue('mortinatoMadrePuebloPertenencia', resultadoMapeo.data.puebloPertenencia, { shouldValidate: true })

    if (paciente.pais) {
      setValue('mortinatoMadreLugarNacPais', paciente.pais, { shouldValidate: true })
    } else if (tieneDpi) {
      setValue('mortinatoMadreLugarNacPais', 'Guatemala', { shouldValidate: true })
    }

    // ── Nacionalidad: si tiene DPI siempre guatemalteca; si no, usar lo que devuelva FHIR ──
    if (tieneDpi) {
      setValue('mortinatoMadreNacionalidad', 'Guatemalteca', { shouldValidate: true })
    } else if (resultadoMapeo.data.nacionalidad) {
      const nac = resultadoMapeo.data.nacionalidad === 'Guatemalteco' ? 'Guatemalteca' : resultadoMapeo.data.nacionalidad
      setValue('mortinatoMadreNacionalidad', nac, { shouldValidate: true })
    }

    if (resultadoMapeo.warnings.length > 0) {
      console.warn('[DefSeccionVI] Advertencias de mapeo FHIR:', resultadoMapeo.warnings)
    }

    setFhirTieneDpi(tieneDpi)
    setDatosDeFhir(modo)
  }

  const handleLimpiarFhir = () => {
    setFhirTieneDpi(false)
    setDatosDeFhir(false)
  }

  // Pre-llenar nacionalidad al cambiar tipo de documento (solo si no hay DPI desde FHIR)
  useEffect(() => {
    if (fhirTieneDpi) return
    if (docInfo.nacionalidadDefault) {
      setValue('mortinatoMadreNacionalidad', docInfo.nacionalidadDefault, { shouldValidate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mortinatoMadreDocTipo, mortinatoMadrePaisPasaporte])

  // Autocompletar depto/municipio/nacionalidad al ingresar DPI válido de la madre MANUALMENTE
  // Solo cuando tipo = DPI_GT
  useEffect(() => {
    if (mortinatoMadreDocTipo !== 'DPI_GT') return
    if (!dpiMadre || datosDeFhir) return  // ← No ejecutar si viene de FHIR

    const digits = dpiMadre.replace(/\s/g, '')
    if (digits.length !== 13 || !cuiValido(digits)) return

    const info = deptoMuniDesdeCui(digits)
    if (!info) return

    // Autocompletar departamento de nacimiento de la madre
    setValue('mortinatoMadreLugarNacDepartamento', info.depto, { shouldValidate: true })

    // Autocompletar municipio de nacimiento usando el índice
    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('mortinatoMadreLugarNacMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    // Fijar nacionalidad a guatemalteca
    setValue('mortinatoMadreNacionalidad', 'Guatemalteca', { shouldValidate: true })
  }, [dpiMadre, datosDeFhir, mortinatoMadreDocTipo, setValue])

  return (
    <SectionCard
      title="VI. Datos de la defunción fetal (Mortinato)"
      subtitle="Completar solo si la muerte es fetal"
      variant="defuncion"
    >
      {/* ── BÚSQUEDA FHIR ── */}
      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <BuscadorPacienteFhir
            label="Buscar madre en RENAP por CUI/DPI"
            onPacienteEncontrado={handlePacienteEncontrado}
            onLimpiar={handleLimpiarFhir}
            ocultarModoDpi={!docInfo.mostrarFhirDpi}
          />
        </Grid>

        {/* ── Selector de tipo de documento ── */}
        <Grid item xs={12}>
          <DocumentoSelector
            tipo={mortinatoMadreDocTipo}
            onTipoChange={handleTipoChange}
            paisPasaporte={mortinatoMadrePaisPasaporte ?? ''}
            onPaisChange={(pais) => setValue('mortinatoMadrePaisPasaporte', pais, { shouldValidate: false })}
            disabled={fhirTieneDpi}
          />
        </Grid>

        {/* Indicador de datos desde FHIR */}
        {datosDeFhir && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              p: 1.5, 
              bgcolor: 'success.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'success.200',
            }}>
              <CloudDoneIcon color="success" />
              <Typography variant="body2" color="success.dark" fontWeight={600}>
                Datos cargados desde RENAP (FHIR) — Todos los campos son editables
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        Se entiende por defunción fetal la muerte de un producto de la concepción, antes de su
        expulsión o extracción completa del cuerpo de su madre.
      </Alert>

      {/* Datos de la madre */}
      <Typography variant="subtitle2" fontWeight={700} color="primary.main" mb={1}>
        Datos de la Madre
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="20. Nombre completo"
            {...register('mortinatoMadreNombre')}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 255 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            21. Documento de Identificación
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="mortinatoMadreDocNumero" control={control} render={({ field, fieldState }) => (
            mortinatoMadreDocTipo === 'DPI_GT' ? (
              <DpiField
                label="Doc. (CUI / DPI)"
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (
                  dpiGuatemalteco
                    ? '✓ DPI guatemalteco — depto. y municipio precargados'
                    : 'Ingrese el DPI (13 dígitos) para autocompletar'
                )}
              />
            ) : (
              <SmartField
                label={docInfo.labelNumero}
                fieldType="alphanumeric"
                maxLen={docInfo.maxLengthDoc}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )
          )} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <TextField label="No. Libro" {...register('mortinatoMadreDocLibro')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 50 }} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <TextField label="No. Folio" {...register('mortinatoMadreDocFolio')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 50 }} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <TextField label="No. Partida" {...register('mortinatoMadreDocPartida')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 50 }} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            22. Lugar de nacimiento
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="País" {...register('mortinatoMadreLugarNacPais')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>
        
        {/* Depto / Municipio — condicional según tipo con selector encadenado */}
        {docInfo.usaSelectorGT && (
          <Controller
            name="mortinatoMadreLugarNacMunicipio"
            control={control}
            render={({ field: muni }) => (
              <Controller
                name="mortinatoMadreLugarNacDepartamento"
                control={control}
                render={({ field: depto }) => (
                  <DeptoMuniSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 4 }}
                    muniGrid={{ xs: 12, sm: 4 }}
                    deptoLabel={docInfo.labelDepto}
                    muniLabel={docInfo.labelMuni}
                  />
                )}
              />
            )}
          />
        )}
        {docInfo.usaSelectorMX && (
          <Controller
            name="mortinatoMadreLugarNacMunicipio"
            control={control}
            render={({ field: muni }) => (
              <Controller
                name="mortinatoMadreLugarNacDepartamento"
                control={control}
                render={({ field: depto }) => (
                  <DeptoMuniMexSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 4 }}
                    muniGrid={{ xs: 12, sm: 4 }}
                    deptoLabel={docInfo.labelDepto}
                    muniLabel={docInfo.labelMuni}
                  />
                )}
              />
            )}
          />
        )}
        {!docInfo.usaSelectorGT && !docInfo.usaSelectorMX && (
          <>
            <Grid item xs={12} sm={4}>
              <Controller name="mortinatoMadreLugarNacDepartamento" control={control} render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label={docInfo.labelDepto}
                  size="small" fullWidth inputProps={{ maxLength: 100 }} InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="mortinatoMadreLugarNacMunicipio" control={control} render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label={docInfo.labelMuni}
                  size="small" fullWidth inputProps={{ maxLength: 100 }} InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
          </>
        )}

        <Grid item xs={6} sm={3}>
          <Controller
            name="mortinatoMadreEdad"
            control={control}
            render={({ field }) => (
              <TextField
                label="23. Edad (años)"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 10, max: 99 }}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          />
        </Grid>
        {/* Estado civil en tarjetas */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            24. ESTADO CIVIL
          </Typography>
          <Controller
            name="mortinatoMadreEstadoCivil"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={ESTADO_CIVIL_OPTIONS}
                value={field.value ?? null}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="sm"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="mortinatoMadrePuebloPertenencia"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>25. Pueblo de pertenencia</InputLabel>
                <Select {...field} value={field.value ?? ''} label="25. Pueblo de pertenencia"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                  {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            26. Residencia
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Dirección exacta" {...register('mortinatoMadreResidenciaDireccion')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 150 }} />
        </Grid>
        {/* Depto / Municipio residencia — selector encadenado */}
        {docInfo.usaSelectorGT && (
          <Controller
            name="mortinatoMadreResidenciaDepartamento"
            control={control}
            render={({ field: depto }) => (
              <Controller
                name="mortinatoMadreResidenciaMunicipio"
                control={control}
                render={({ field: muni }) => (
                  <DeptoMuniSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 6 }}
                    muniGrid={{ xs: 12, sm: 6 }}
                    deptoLabel="Departamento"
                    muniLabel="Municipio"
                  />
                )}
              />
            )}
          />
        )}
        {docInfo.usaSelectorMX && (
          <Controller
            name="mortinatoMadreResidenciaDepartamento"
            control={control}
            render={({ field: depto }) => (
              <Controller
                name="mortinatoMadreResidenciaMunicipio"
                control={control}
                render={({ field: muni }) => (
                  <DeptoMuniMexSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 6 }}
                    muniGrid={{ xs: 12, sm: 6 }}
                    deptoLabel="Estado"
                    muniLabel="Municipio"
                  />
                )}
              />
            )}
          />
        )}
        {!docInfo.usaSelectorGT && !docInfo.usaSelectorMX && (
          <>
            <Grid item xs={12} sm={6}>
              <Controller name="mortinatoMadreResidenciaDepartamento" control={control} render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label={docInfo.labelDepto}
                  size="small" fullWidth inputProps={{ maxLength: 100 }} InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller name="mortinatoMadreResidenciaMunicipio" control={control} render={({ field }) => (
                <TextField {...field} value={field.value ?? ''} label={docInfo.labelMuni}
                  size="small" fullWidth inputProps={{ maxLength: 100 }} InputLabelProps={{ shrink: true }} />
              )} />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <TextField label="27. Ocupación" {...register('mortinatoMadreOcupacion')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 150 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            28. ¿Sabe leer y escribir?
          </Typography>
          <Controller
            name="mortinatoMadreSabeLeer"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={SABE_LEER_OPTIONS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="sm"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="mortinatoMadreEscolaridad"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>29. Escolaridad</InputLabel>
                <Select {...field} value={field.value ?? ''} label="29. Escolaridad"
                  onChange={(e) => field.onChange(e.target.value !== '' ? Number(e.target.value) : null)}>
                  {ESCOLARIDAD_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField 
            label="30. Nacionalidad" 
            {...register('mortinatoMadreNacionalidad')} 
            InputLabelProps={{ shrink: true }} 
            inputProps={{ maxLength: 100, readOnly: fhirTieneDpi }}
            sx={fhirTieneDpi ? { '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } } : undefined}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Controller
            name="mortinatoEmbarazosNacidosVivos"
            control={control}
            render={({ field }) => (
              <TextField label="31. Nacidos vivos" type="number" InputLabelProps={{ shrink: true }} inputProps={{ min: 0 }}
                value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={4}>
          <Controller
            name="mortinatoEmbarazosNacidosMuertos"
            control={control}
            render={({ field }) => (
              <TextField label="Muertos" type="number" InputLabelProps={{ shrink: true }} inputProps={{ min: 0 }}
                value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
            )}
          />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* Datos del feto */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" fontWeight={700} color="primary.main">
            Datos del Feto (Mortinato)
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoFetoSexo"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label="32. Sexo"
                options={SEXO_FETO_OPTS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                size="sm"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            33. ¿Cuándo murió?
          </Typography>
          <Controller
            name="mortinatoFetoMurio"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={MURIO_OPTIONS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="md"
              />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            34. El parto fue
          </Typography>
          <Controller
            name="mortinatoPartoFue"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={PARTO_FUE_OPTIONS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="md"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            35. Clase de parto
          </Typography>
          <Controller
            name="mortinatoClaseParto"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={CLASE_PARTO_OPTIONS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="md"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            36. Vía del parto
          </Typography>
          <Controller
            name="mortinatoViaParto"
            control={control}
            render={({ field, fieldState }) => (
              <CardOptionGroup
                label=""
                options={VIA_PARTO_OPTIONS}
                value={field.value ?? null}
                onChange={(v) => field.onChange(Number(v))}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                direction="row"
                size="md"
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoSemanasGestacion"
            control={control}
            render={({ field }) => (
              <TextField
                label="37. Semanas de gestación"
                type="number"
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1, max: 45 }}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            38. Causas del mortinato
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Fetales"
            {...register('mortinatoCausasFetales')}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Maternas"
            {...register('mortinatoCausasMaternas')}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
