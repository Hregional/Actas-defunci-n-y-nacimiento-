import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, TextField,
  Typography, Divider, Box,
} from '@mui/material'
import MaleIcon from '@mui/icons-material/Male'
import FemaleIcon from '@mui/icons-material/Female'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import PersonIcon from '@mui/icons-material/Person'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import SectionCard from '@/shared/components/common/SectionCard'
import DpiField from '@/shared/components/common/DpiField'
import SmartField from '@/shared/components/common/SmartField'
import DeptoMuniSelector from '@/shared/components/common/DeptoMuniSelector'
import DeptoMuniMexSelector from '@/shared/components/common/DeptoMuniMexSelector'
import DocumentoSelector from '@/shared/components/common/DocumentoSelector'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
import BuscadorPacienteFhir, { type ModoBusqueda } from '@/shared/components/common/BuscadorPacienteFhir'
import { cuiValido, deptoMuniDesdeCui } from '@/shared/utils/cuiValidator'
import { mapearDatosFhirCompleto } from '@/shared/utils/fhirMapper'
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'
import { getDocumentoInfo } from '@/shared/hooks/useDocumentoInfo'
import type { TipoDocumento } from '@/shared/hooks/useDocumentoInfo'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'
import type { PersonaFhirDTO } from '@/shared/api/fhir.api'

// Opciones de sexo (igual estilo que nacimientos)
const SEXO_OPTS = [
  { value: 1, label: 'Hombre', icon: <MaleIcon sx={{ fontSize: 20 }} />, color: '#1565C0' },
  { value: 2, label: 'Mujer', icon: <FemaleIcon sx={{ fontSize: 20 }} />, color: '#AD1457' },
  { value: 9, label: 'Ignorado', icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, color: '#757575' },
]

const ESTADO_CIVIL_MASCULINO = [
  { value: 1, label: 'Soltero', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#2196F3' },
  { value: 2, label: 'Casado', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#1565C0' },
]
const ESTADO_CIVIL_FEMENINO = [
  { value: 1, label: 'Soltera', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#9C27B0' },
  { value: 2, label: 'Casada', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#E91E63' },
]
const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' }, { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' }, { value: 4, label: 'Mestizo, Ladino' },
  { value: 5, label: 'Ninguno' }, { value: 9, label: 'Ignorado' },
]
const ESCOLARIDAD_OPTIONS = [
  { value: 0, label: 'Ninguna' },
  { value: 1, label: 'Primaria incompleta' }, { value: 2, label: 'Primaria completa' },
  { value: 3, label: 'Básico incompleto' }, { value: 4, label: 'Básico completo' },
  { value: 5, label: 'Diversificado incompleto' }, { value: 6, label: 'Diversificado completo' },
  { value: 7, label: 'Universitario incompleto' }, { value: 8, label: 'Universitario completo' },
  { value: 9, label: 'Ignorado' },
]

export default function DefSeccionII() {
  const { control, watch, setValue, resetField, formState: { errors } } = useFormContext<DefuncionFormValues>()
  
  // fhirTieneDpi: true cuando el paciente encontrado via FHIR tiene CUI guatemalteco.
  // Controla el bloqueo de tipo de documento y nacionalidad.
  const [fhirTieneDpi, setFhirTieneDpi] = useState(false)

  const [datosDeFhir, setDatosDeFhir] = useState<ModoBusqueda | false>(false)

  const sexo = watch('fallecidoSexo')
  const dpi = watch('fallecidoDocNumero')
  const fallecidoDocTipo = ((watch('fallecidoDocTipo') ?? 'DPI_GT') as TipoDocumento)
  const fallecidoPaisPasaporte = watch('fallecidoPaisPasaporte') ?? undefined

  const docInfo = getDocumentoInfo(fallecidoDocTipo, fallecidoPaisPasaporte ?? undefined)

  // Detectar si el DPI es guatemalteco válido
  const dpiGuatemalteco = fallecidoDocTipo === 'DPI_GT' && dpi && dpi.replace(/\s/g, '').length === 13 && cuiValido(dpi)

  // Handler cuando cambia el tipo de documento
  const handleTipoChange = (tipo: TipoDocumento) => {
    setValue('fallecidoDocTipo', tipo, { shouldValidate: false })
    setValue('fallecidoLugarNacDepartamento', '', { shouldValidate: false })
    setValue('fallecidoLugarNacMunicipio', '', { shouldValidate: false })
    setValue('fallecidoDocNumero', '', { shouldValidate: false })
    const info = getDocumentoInfo(tipo)
    if (info.nacionalidadDefault) {
      setValue('fallecidoNacionalidad', info.nacionalidadDefault, { shouldValidate: false })
    }
  }

  // Handler cuando se encuentra un paciente en FHIR
  const handlePacienteEncontrado = (paciente: PersonaFhirDTO, modo: ModoBusqueda) => {
    const tieneDpi = !!paciente.cui

    // ── RESET ──
    setValue('fallecidoDocNumero', '', { shouldValidate: false })
    setValue('fallecidoNombreCompleto', '', { shouldValidate: false })
    resetField('fallecidoSexo')
    resetField('fallecidoEdadAnos')
    resetField('fallecidoEdadMeses')
    resetField('fallecidoEdadDias')
    resetField('fallecidoEdadHoras')
    setValue('fallecidoNacionalidad', '', { shouldValidate: false })
    setValue('fallecidoOcupacion', '', { shouldValidate: false })
    setValue('fallecidoLugarNacPais', '', { shouldValidate: false })
    setValue('fallecidoLugarNacDepartamento', '', { shouldValidate: false })
    setValue('fallecidoLugarNacMunicipio', '', { shouldValidate: false })
    setValue('fallecidoResidenciaDireccion', '', { shouldValidate: false })
    setValue('fallecidoResidenciaMunicipio', '', { shouldValidate: false })
    setValue('fallecidoResidenciaDepartamento', '', { shouldValidate: false })
    resetField('fallecidoEstadoCivil')
    resetField('fallecidoPuebloPertenencia')
    resetField('fallecidoEscolaridad')

    // ── Fijar tipo de documento ──
    if (tieneDpi) {
      setValue('fallecidoDocTipo', 'DPI_GT', { shouldValidate: false })
      setValue('fallecidoDocNumero', paciente.cui!, { shouldValidate: true })
    }

    if (paciente.nombreCompleto) {
      setValue('fallecidoNombreCompleto', paciente.nombreCompleto, { shouldValidate: true })
    }
    if (paciente.sexo) {
      const sexoMap: Record<string, number> = { 'male': 1, 'female': 2, 'unknown': 9 }
      const sexoValue = sexoMap[paciente.sexo]
      if (sexoValue) setValue('fallecidoSexo', sexoValue, { shouldValidate: true })
    }
    if (paciente.edad != null) {
      setValue('fallecidoEdadAnos', paciente.edad, { shouldValidate: true })
    }
    if (paciente.ocupacion) {
      setValue('fallecidoOcupacion', paciente.ocupacion, { shouldValidate: true })
    }
    if (paciente.direccion) {
      setValue('fallecidoResidenciaDireccion', paciente.direccion, { shouldValidate: true })
    }

    const resultadoMapeo = mapearDatosFhirCompleto({
      departamento: paciente.departamento,
      municipio: paciente.municipio,
      cui: paciente.cui,
      estadoCivil: paciente.estadoCivil,
      puebloPertenencia: paciente.puebloPertenencia,
      nacionalidad: paciente.nacionalidad
    })

    if (resultadoMapeo.data.departamento) {
      setValue('fallecidoLugarNacDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
      setValue('fallecidoResidenciaDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
    }
    if (resultadoMapeo.data.municipio) {
      setValue('fallecidoLugarNacMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
      setValue('fallecidoResidenciaMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
    }
    if (resultadoMapeo.data.estadoCivil) {
      setValue('fallecidoEstadoCivil', resultadoMapeo.data.estadoCivil, { shouldValidate: true })
    }
    if (resultadoMapeo.data.puebloPertenencia) {
      setValue('fallecidoPuebloPertenencia', resultadoMapeo.data.puebloPertenencia, { shouldValidate: true })
    }
    if (paciente.pais) {
      setValue('fallecidoLugarNacPais', paciente.pais, { shouldValidate: true })
    } else if (tieneDpi) {
      setValue('fallecidoLugarNacPais', 'Guatemala', { shouldValidate: true })
    }

    // ── Nacionalidad: si tiene DPI siempre guatemalteca; si no, usar lo que devuelva FHIR ──
    if (tieneDpi) {
      setValue('fallecidoNacionalidad', 'Guatemalteca', { shouldValidate: true })
    } else if (resultadoMapeo.data.nacionalidad) {
      setValue('fallecidoNacionalidad', resultadoMapeo.data.nacionalidad, { shouldValidate: true })
    }

    if (resultadoMapeo.warnings.length > 0) {
      console.warn('[DefSeccionII] Advertencias de mapeo FHIR:', resultadoMapeo.warnings)
    }

    setFhirTieneDpi(tieneDpi)
    setDatosDeFhir(modo)
  }

  const handleLimpiarFhir = () => {
    setFhirTieneDpi(false)
    setDatosDeFhir(false)
  }

  // Determinar opciones de estado civil según sexo
  const estadoCivilOptions = sexo === 1 ? ESTADO_CIVIL_MASCULINO :
    sexo === 2 ? ESTADO_CIVIL_FEMENINO :
      ESTADO_CIVIL_MASCULINO

  // Pre-llenar nacionalidad al cambiar tipo de documento (solo si no hay DPI desde FHIR)
  useEffect(() => {
    if (fhirTieneDpi) return
    if (docInfo.nacionalidadDefault) {
      setValue('fallecidoNacionalidad', docInfo.nacionalidadDefault, { shouldValidate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fallecidoDocTipo, fallecidoPaisPasaporte])

  // Autocompletar depto/municipio/nacionalidad al ingresar DPI válido MANUALMENTE
  // Solo cuando tipo = DPI_GT
  useEffect(() => {
    if (fallecidoDocTipo !== 'DPI_GT') return
    if (!dpi || datosDeFhir) return

    const digits = dpi.replace(/\s/g, '')
    if (digits.length !== 13 || !cuiValido(digits)) return

    const info = deptoMuniDesdeCui(digits)
    if (!info) return

    setValue('fallecidoLugarNacDepartamento', info.depto, { shouldValidate: true })

    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('fallecidoLugarNacMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    setValue('fallecidoNacionalidad', 'Guatemalteca', { shouldValidate: true })
  }, [dpi, datosDeFhir, fallecidoDocTipo, setValue])

  return (
    <SectionCard title="II. Datos del fallecido (a)" subtitle="FALLECIÓ:" variant="defuncion">
      <Grid container spacing={1.5}>
        
        {/* ── BÚSQUEDA FHIR ── */}
        <Grid item xs={12}>
          <BuscadorPacienteFhir
            label="Buscar fallecido(a) en RENAP por CUI/DPI"
            onPacienteEncontrado={handlePacienteEncontrado}
            onLimpiar={handleLimpiarFhir}
            ocultarModoDpi={!docInfo.mostrarFhirDpi}
          />
        </Grid>

        {/* ── Selector de tipo de documento ── */}
        <Grid item xs={12}>
          <DocumentoSelector
            tipo={fallecidoDocTipo}
            onTipoChange={handleTipoChange}
            paisPasaporte={fallecidoPaisPasaporte ?? ''}
            onPaisChange={(pais) => setValue('fallecidoPaisPasaporte', pais, { shouldValidate: false })}
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

        {/* Nombre completo */}
        <Grid item xs={12}>
          <Controller name="fallecidoNombreCompleto" control={control} render={({ field }) => (
            <SmartField label="6. Nombre completo *"
              fieldType="text" maxLen={255} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoNombreCompleto}
              helperText={errors.fallecidoNombreCompleto?.message} />
          )} />
        </Grid>

        {/* Sexo en tarjetas */}
        <Grid item xs={12} sm={4}>
          <Controller name="fallecidoSexo" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label="7. Sexo *"
              options={SEXO_OPTS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(Number(v))}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Seleccione'}
            />
          )} />
        </Grid>

        {/* Edad cumplida */}
        <Grid item xs={12} sm={8}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
            8. Edad cumplida (complete solo el campo que corresponda)
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            <Controller name="fallecidoEdadHoras" control={control} render={({ field }) => (
              <SmartField label="Horas (menos de 1 día)" fieldType="onlyNumbers" maxLen={2}
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => field.onChange(v ? Number(v) : null)} sx={{ width: 160 }} />
            )} />
            <Controller name="fallecidoEdadDias" control={control} render={({ field }) => (
              <SmartField label="Días (menos de 1 mes)" fieldType="onlyNumbers" maxLen={2}
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => field.onChange(v ? Number(v) : null)} sx={{ width: 160 }} />
            )} />
            <Controller name="fallecidoEdadMeses" control={control} render={({ field }) => (
              <SmartField label="Meses (menos de 1 año)" fieldType="onlyNumbers" maxLen={2}
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => field.onChange(v ? Number(v) : null)} sx={{ width: 165 }} />
            )} />
            <Controller name="fallecidoEdadAnos" control={control} render={({ field }) => (
              <SmartField label="Años cumplidos" fieldType="onlyNumbers" maxLen={3}
                value={field.value != null ? String(field.value) : ''}
                onChange={(v) => field.onChange(v ? Number(v) : null)} sx={{ width: 130 }} />
            )} />
          </Box>
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* Documento — condicional según tipo */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            9. Documento de Identificación *
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoDocNumero" control={control} render={({ field, fieldState }) => (
            fallecidoDocTipo === 'DPI_GT' ? (
              <DpiField label={`${docInfo.labelNumero} *`}
                value={field.value ?? ''} onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (
                  dpiGuatemalteco
                    ? '✓ DPI guatemalteco — depto. y municipio precargados'
                    : 'Ingrese el DPI (13 dígitos) para autocompletar depto. y municipio'
                )}
              />
            ) : (
              <SmartField
                label={`${docInfo.labelNumero} *`}
                fieldType="alphanumeric"
                maxLen={docInfo.maxLengthDoc}
                required
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )
          )} />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', gap: 1 }}>
          <Controller name="fallecidoDocLibro" control={control} render={({ field }) => (
            <SmartField label="No. Libro" fieldType="alphanumeric" maxLen={50}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
          <Controller name="fallecidoDocFolio" control={control} render={({ field }) => (
            <SmartField label="No. Folio" fieldType="alphanumeric" maxLen={50}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
          <Controller name="fallecidoDocPartida" control={control} render={({ field }) => (
            <SmartField label="No. Partida" fieldType="alphanumeric" maxLen={50}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* Lugar de nacimiento */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            10. Lugar de nacimiento *
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name="fallecidoLugarNacPais" control={control} render={({ field }) => (
            <SmartField label="País *" fieldType="onlyLetters" maxLen={100} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoLugarNacPais} helperText={errors.fallecidoLugarNacPais?.message} />
          )} />
        </Grid>

        {/* Depto / Municipio de nacimiento — condicional según tipo */}
        {docInfo.usaSelectorGT && (
          <Controller
            name="fallecidoLugarNacMunicipio"
            control={control}
            render={({ field: muni, fieldState: muniState }) => (
              <Controller
                name="fallecidoLugarNacDepartamento"
                control={control}
                render={({ field: depto, fieldState: deptoState }) => (
                  <DeptoMuniSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoError={deptoState.error?.message}
                    muniError={muniState.error?.message}
                    deptoGrid={{ xs: 12, sm: 4 }}
                    muniGrid={{ xs: 12, sm: 4 }}
                    deptoLabel={docInfo.labelDepto}
                    muniLabel={docInfo.labelMuni}
                    required
                  />
                )}
              />
            )}
          />
        )}

        {docInfo.usaSelectorMX && (
          <Controller
            name="fallecidoLugarNacMunicipio"
            control={control}
            render={({ field: muni, fieldState: muniState }) => (
              <Controller
                name="fallecidoLugarNacDepartamento"
                control={control}
                render={({ field: depto, fieldState: deptoState }) => (
                  <DeptoMuniMexSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoError={deptoState.error?.message}
                    muniError={muniState.error?.message}
                    deptoGrid={{ xs: 12, sm: 4 }}
                    muniGrid={{ xs: 12, sm: 4 }}
                    deptoLabel={docInfo.labelDepto}
                    muniLabel={docInfo.labelMuni}
                    required
                  />
                )}
              />
            )}
          />
        )}

        {!docInfo.usaSelectorGT && !docInfo.usaSelectorMX && (
          <>
            <Grid item xs={12} sm={4}>
              <Controller name="fallecidoLugarNacDepartamento" control={control} render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={`${docInfo.labelDepto} *`}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Controller name="fallecidoLugarNacMunicipio" control={control} render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={`${docInfo.labelMuni} *`}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )} />
            </Grid>
          </>
        )}

        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoNacionalidad" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              label="11. Nacionalidad *"
              size="small"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (!field.value ? 'Requerida' : undefined)}
              inputProps={{ maxLength: 100, readOnly: fhirTieneDpi }}
              InputLabelProps={{ shrink: true }}
              sx={fhirTieneDpi ? { '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoOcupacion" control={control} render={({ field }) => (
            <SmartField label="12. Ocupación *" fieldType="text" maxLen={150} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoOcupacion} helperText={errors.fallecidoOcupacion?.message} />
          )} />
        </Grid>

        {/* Estado civil en tarjetas */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            13. ESTADO CIVIL *
          </Typography>
          <Controller name="fallecidoEstadoCivil" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={estadoCivilOptions}
              value={field.value ?? null}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              direction="row"
              size="sm"
            />
          )} />
        </Grid>

        {/* Pueblo y escolaridad */}
        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoPuebloPertenencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>14. Pueblo de pertenencia *</InputLabel>
              <Select {...field} value={field.value ?? ''} label="14. Pueblo de pertenencia *"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoEscolaridad" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>16. Escolaridad *</InputLabel>
              <Select {...field} value={field.value ?? ''} label="16. Escolaridad *"
                onChange={(e) => field.onChange(e.target.value !== '' ? Number(e.target.value) : null)}>
                {ESCOLARIDAD_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>

        {/* Residencia */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            15. Residencia *
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller name="fallecidoResidenciaDireccion" control={control} render={({ field }) => (
            <SmartField label="Dirección exacta *" fieldType="text" maxLen={150} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoResidenciaDireccion} helperText={errors.fallecidoResidenciaDireccion?.message} />
          )} />
        </Grid>
        <Controller
          name="fallecidoResidenciaMunicipio"
          control={control}
          render={({ field: muni, fieldState: muniState }) => (
            <Controller
              name="fallecidoResidenciaDepartamento"
              control={control}
              render={({ field: depto, fieldState: deptoState }) => (
                <DeptoMuniSelector
                  deptoValue={depto.value ?? ''}
                  muniValue={muni.value ?? ''}
                  onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                  onMuniChange={muni.onChange}
                  deptoError={deptoState.error?.message}
                  muniError={muniState.error?.message}
                  deptoGrid={{ xs: 12, sm: 3 }}
                  muniGrid={{ xs: 12, sm: 3 }}
                  required
                />
              )}
            />
          )}
        />
      </Grid>
    </SectionCard>
  )
}
