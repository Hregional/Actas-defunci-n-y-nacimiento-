/**
 * Sección IV — Datos de la madre
 *
 * - Soporte multi-documento: DPI_GT, INE_MX, PASAPORTE, OTRO
 * - INTEGRACIÓN FHIR: Búsqueda de paciente por CUI/DPI (solo DPI_GT) o Historia Clínica
 * - Autocompletado inteligente con datos de RENAP (FHIR)
 * - Si se cargaron datos desde FHIR → campos bloqueados (solo lectura)
 * - Si el DPI es guatemalteco válido (13 dígitos, checksum correcto):
 *   → Departamento y Municipio se precargan
 *   → Nacionalidad se fija a "Guatemalteca"
 */
import { useEffect, useState } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Typography, TextField, Box,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import SectionCard      from '@/shared/components/common/SectionCard'
import DpiField         from '@/shared/components/common/DpiField'
import SmartField       from '@/shared/components/common/SmartField'
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
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'
import type { PersonaFhirDTO } from '@/shared/api/fhir.api'

const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' }, { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' }, { value: 4, label: 'Mestizo / Ladino' },
  { value: 5, label: 'Otro' },
]
const ESTADO_CIVIL_MADRE = [
  { value: 1, label: 'Soltera', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#9C27B0' },
  { value: 2, label: 'Casada', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#E91E63' },
]
const ESCOLARIDAD_OPTIONS = [
  { value: 1, label: 'Ninguna' }, { value: 2, label: 'Primaria' },
  { value: 3, label: 'Básico' }, { value: 4, label: 'Diversificado' },
  { value: 5, label: 'Universitario' },
]

export default function SeccionIV() {
  const { control, watch, setValue, resetField, formState: { errors } } = useFormContext<NacimientoFormValues>()
  
  // fhirTieneDpi: true cuando el paciente encontrado via FHIR tiene CUI guatemalteco.
  const [fhirTieneDpi, setFhirTieneDpi] = useState(false)

  const [datosDeFhir, setDatosDeFhir] = useState<ModoBusqueda | false>(false)

  const dpi = watch('madreCuiCedula')
  const madreDocTipo = (watch('madreDocTipo') ?? 'DPI_GT') as TipoDocumento
  const madrePaisPasaporte = watch('madrePaisPasaporte') ?? undefined

  const docInfo = getDocumentoInfo(madreDocTipo, madrePaisPasaporte ?? undefined)

  // Detectar si el DPI es guatemalteco válido
  const dpiGuatemalteco = madreDocTipo === 'DPI_GT' && dpi && dpi.replace(/\s/g, '').length === 13 && cuiValido(dpi)

  // Handler cuando cambia el tipo de documento
  const handleTipoChange = (tipo: TipoDocumento) => {
    setValue('madreDocTipo', tipo, { shouldValidate: false })
    // Limpiar campos geográficos
    setValue('madreDepartamento', '', { shouldValidate: false })
    setValue('madreMunicipio', '', { shouldValidate: false })
    setValue('madreCuiCedula', '', { shouldValidate: false })
    // Pre-llenar nacionalidad según tipo
    const info = getDocumentoInfo(tipo)
    if (info.nacionalidadDefault) {
      setValue('madreNacionalidad', info.nacionalidadDefault, { shouldValidate: false })
    }
  }

  // Handler cuando se encuentra un paciente en FHIR
  const handlePacienteEncontrado = (paciente: PersonaFhirDTO, modo: ModoBusqueda) => {
    const tieneDpi = !!paciente.cui

    // ── RESET ──
    setValue('madreCuiCedula', '', { shouldValidate: false })
    setValue('madrePrimerNombre', '', { shouldValidate: false })
    setValue('madreSegundoNombre', '', { shouldValidate: false })
    setValue('madrePrimerApellido', '', { shouldValidate: false })
    setValue('madreSegundoApellido', '', { shouldValidate: false })
    setValue('madreApellidoCasada', '', { shouldValidate: false })
    resetField('madreEdad')
    setValue('madreNacionalidad', '', { shouldValidate: false })
    setValue('madreOcupacion', '', { shouldValidate: false })
    setValue('madreDireccion', '', { shouldValidate: false })
    setValue('madreZona', '', { shouldValidate: false })
    setValue('madreMunicipio', '', { shouldValidate: false })
    setValue('madreDepartamento', '', { shouldValidate: false })
    resetField('madrePuebloPertenencia')
    resetField('madreEstadoCivil')
    resetField('madreEscolaridad')

    // ── Fijar tipo de documento ──
    if (tieneDpi) {
      setValue('madreDocTipo', 'DPI_GT', { shouldValidate: false })
      setValue('madreCuiCedula', paciente.cui!, { shouldValidate: true })
    }

    if (paciente.primerNombre) setValue('madrePrimerNombre', paciente.primerNombre, { shouldValidate: true })
    if (paciente.segundoNombre) setValue('madreSegundoNombre', paciente.segundoNombre, { shouldValidate: true })
    if (paciente.primerApellido) setValue('madrePrimerApellido', paciente.primerApellido, { shouldValidate: true })
    if (paciente.segundoApellido) setValue('madreSegundoApellido', paciente.segundoApellido, { shouldValidate: true })
    if (paciente.apellidoCasada) setValue('madreApellidoCasada', paciente.apellidoCasada, { shouldValidate: true })
    if (paciente.edad != null) setValue('madreEdad', paciente.edad, { shouldValidate: true })
    if (paciente.ocupacion) setValue('madreOcupacion', paciente.ocupacion, { shouldValidate: true })
    if (paciente.direccion) setValue('madreDireccion', paciente.direccion, { shouldValidate: true })

    const resultadoMapeo = mapearDatosFhirCompleto({
      departamento: paciente.departamento,
      municipio: paciente.municipio,
      cui: paciente.cui,
      estadoCivil: paciente.estadoCivil,
      puebloPertenencia: paciente.puebloPertenencia,
      nacionalidad: paciente.nacionalidad
    }, 'femenino')

    if (resultadoMapeo.data.departamento) setValue('madreDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
    if (resultadoMapeo.data.municipio) setValue('madreMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
    if (resultadoMapeo.data.estadoCivil) setValue('madreEstadoCivil', resultadoMapeo.data.estadoCivil, { shouldValidate: true })
    if (resultadoMapeo.data.puebloPertenencia) setValue('madrePuebloPertenencia', resultadoMapeo.data.puebloPertenencia, { shouldValidate: true })

    // ── Nacionalidad: si tiene DPI siempre guatemalteca; si no, usar lo que devuelva FHIR ──
    if (tieneDpi) {
      setValue('madreNacionalidad', 'Guatemalteca', { shouldValidate: true })
    } else if (resultadoMapeo.data.nacionalidad) {
      setValue('madreNacionalidad', resultadoMapeo.data.nacionalidad, { shouldValidate: true })
    }

    if (resultadoMapeo.warnings.length > 0) {
      console.warn('[SeccionIV] Advertencias de mapeo FHIR:', resultadoMapeo.warnings)
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
      setValue('madreNacionalidad', docInfo.nacionalidadDefault, { shouldValidate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [madreDocTipo, madrePaisPasaporte])

  // Autocompletar depto/municipio/nacionalidad al ingresar DPI válido MANUALMENTE
  // Solo cuando tipo = DPI_GT y no vienen de FHIR
  useEffect(() => {
    if (madreDocTipo !== 'DPI_GT') return
    if (!dpi || datosDeFhir) return

    const digits = dpi.replace(/\s/g, '')
    if (digits.length !== 13 || !cuiValido(digits)) return

    const info = deptoMuniDesdeCui(digits)
    if (!info) return

    setValue('madreDepartamento', info.depto, { shouldValidate: true })

    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('madreMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    setValue('madreNacionalidad', 'Guatemalteca', { shouldValidate: true })
  }, [dpi, datosDeFhir, madreDocTipo, setValue])

  return (
    <SectionCard title="IV. Datos de la madre" variant="nacimiento">
      <Grid container spacing={1.5}>

        {/* ── BÚSQUEDA FHIR ── */}
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
            tipo={madreDocTipo}
            onTipoChange={handleTipoChange}
            paisPasaporte={madrePaisPasaporte ?? ''}
            onPaisChange={(pais) => setValue('madrePaisPasaporte', pais, { shouldValidate: false })}
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

        {/* ── 17. Nombre ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>17. NOMBRE</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Controller name="madrePrimerNombre" control={control} render={({ field }) => (
            <SmartField label="Primer nombre *" fieldType="onlyLetters" maxLen={100} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.madrePrimerNombre} helperText={errors.madrePrimerNombre?.message} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="madreSegundoNombre" control={control} render={({ field }) => (
            <SmartField label="Segundo nombre" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="madrePrimerApellido" control={control} render={({ field }) => (
            <SmartField label="Primer apellido *" fieldType="onlyLetters" maxLen={100} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.madrePrimerApellido} helperText={errors.madrePrimerApellido?.message} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="madreSegundoApellido" control={control} render={({ field }) => (
            <SmartField label="Segundo apellido" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Controller name="madreApellidoCasada" control={control} render={({ field }) => (
            <SmartField label="Apellido de casada" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* ── 18. Documento — condicional según tipo ── */}
        <Grid item xs={12}>
          <Controller name="madreCuiCedula" control={control} render={({ field, fieldState }) => (
            madreDocTipo === 'DPI_GT' ? (
              <DpiField
                label={`18. ${docInfo.labelNumero} *`}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (
                  dpiGuatemalteco
                    ? '✓ DPI guatemalteco — depto. y municipio precargados'
                    : 'Ingrese el DPI (13 dígitos) para autocompletar depto. y municipio'
                )}
              />
            ) : (
              <SmartField
                label={`18. ${docInfo.labelNumero} *`}
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

        {/* ── 19. Edad — requerida ── */}
        <Grid item xs={6} sm={3}>
          <Controller name="madreEdad" control={control} render={({ field, fieldState }) => (
            <SmartField
              label="19. Edad (años) *"
              fieldType="onlyNumbers" maxLen={2} required
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v ? Number(v) : null)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (!field.value ? '10–99 años' : undefined)}
            />
          )} />
        </Grid>

        {/* ── 20. Nacionalidad ── */}
        <Grid item xs={6} sm={3}>
          <Controller name="madreNacionalidad" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              label="20. Nacionalidad *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (!field.value ? 'Requerida' : undefined)}
              inputProps={{ maxLength: 100, readOnly: fhirTieneDpi }}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              sx={fhirTieneDpi ? { '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>

        {/* ── 21. Ocupación — requerida ── */}
        <Grid item xs={12} sm={6}>
          <Controller name="madreOcupacion" control={control} render={({ field, fieldState }) => (
            <SmartField
              label="21. Ocupación u oficio *"
              fieldType="text" maxLen={150} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (!field.value ? 'Ocupación requerida' : undefined)}
            />
          )} />
        </Grid>

        {/* ── 22. Dirección ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            22. Dirección de residencia actual
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller name="madreDireccion" control={control} render={({ field }) => (
            <SmartField label="Dirección *" fieldType="text" maxLen={150} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.madreDireccion} helperText={errors.madreDireccion?.message} />
          )} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <Controller name="madreZona" control={control} render={({ field }) => (
            <SmartField label="Zona" fieldType="alphanumeric" maxLen={10}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* ── Depto / Municipio — condicional según tipo de documento ── */}
        {docInfo.usaSelectorGT && (
          <Controller
            name="madreMunicipio"
            control={control}
            render={({ field: muni, fieldState: muniState }) => (
              <Controller
                name="madreDepartamento"
                control={control}
                render={({ field: depto, fieldState: deptoState }) => (
                  <DeptoMuniSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoError={deptoState.error?.message}
                    muniError={muniState.error?.message}
                    deptoGrid={{ xs: 12, sm: 2 }}
                    muniGrid={{ xs: 12, sm: 2 }}
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
            name="madreMunicipio"
            control={control}
            render={({ field: muni, fieldState: muniState }) => (
              <Controller
                name="madreDepartamento"
                control={control}
                render={({ field: depto, fieldState: deptoState }) => (
                  <DeptoMuniMexSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoError={deptoState.error?.message}
                    muniError={muniState.error?.message}
                    deptoGrid={{ xs: 12, sm: 2 }}
                    muniGrid={{ xs: 12, sm: 2 }}
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
            <Grid item xs={12} sm={3}>
              <Controller name="madreDepartamento" control={control} render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={docInfo.labelDepto}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller name="madreMunicipio" control={control} render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={docInfo.labelMuni}
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

        {/* ── Estado civil en tarjetas ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            24. ESTADO CIVIL *
          </Typography>
          <Controller name="madreEstadoCivil" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={ESTADO_CIVIL_MADRE}
              value={field.value ?? null}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              direction="row"
              size="sm"
            />
          )} />
        </Grid>

        {/* ── Selects de pueblo y escolaridad ── */}
        <Grid item xs={12} sm={6}>
          <Controller name="madrePuebloPertenencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>23. Pueblo de pertenencia</InputLabel>
              <Select {...field} value={field.value ?? ''} label="23. Pueblo de pertenencia"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="madreEscolaridad" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>25. Escolaridad</InputLabel>
              <Select {...field} value={field.value ?? ''} label="25. Escolaridad"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                {ESCOLARIDAD_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        
      </Grid>
    </SectionCard>
  )
}
