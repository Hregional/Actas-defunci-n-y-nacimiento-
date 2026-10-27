/**
 * Sección V — Datos del padre (todos opcionales)
 *
 * - Soporte multi-documento: DPI_GT, INE_MX, PASAPORTE, OTRO
 * - INTEGRACIÓN FHIR: Búsqueda de paciente por CUI/DPI (solo DPI_GT) o Historia Clínica
 * - Autocompletado inteligente con datos de RENAP (FHIR)
 * - DPI opcional con validación condicional
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
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'
import type { PersonaFhirDTO } from '@/shared/api/fhir.api'

const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' }, { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' }, { value: 4, label: 'Mestizo / Ladino' },
  { value: 5, label: 'Otro' },
]
const ESTADO_CIVIL_PADRE = [
  { value: 1, label: 'Soltero', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#2196F3' },
  { value: 2, label: 'Casado', icon: <Diversity3Icon sx={{ fontSize: 20 }} />, color: '#1565C0' },
]
const ESCOLARIDAD_OPTIONS = [
  { value: 1, label: 'Ninguna' }, { value: 2, label: 'Primaria' },
  { value: 3, label: 'Básico' }, { value: 4, label: 'Diversificado' },
  { value: 5, label: 'Universitario' },
]

export default function SeccionV() {
  const { control, watch, setValue, resetField } = useFormContext<NacimientoFormValues>()
  
  // fhirTieneDpi: true cuando el paciente encontrado via FHIR tiene CUI guatemalteco.
  const [fhirTieneDpi, setFhirTieneDpi] = useState(false)

  const [datosDeFhir, setDatosDeFhir] = useState<ModoBusqueda | false>(false)

  const dpi = watch('padreCuiCedula')
  const padreDocTipo = ((watch('padreDocTipo') ?? 'DPI_GT') as TipoDocumento)
  const padrePaisPasaporte = watch('padrePaisPasaporte') ?? undefined

  const docInfo = getDocumentoInfo(padreDocTipo, padrePaisPasaporte ?? undefined)

  // Detectar si el DPI es guatemalteco válido
  const dpiGuatemalteco = padreDocTipo === 'DPI_GT' && dpi && dpi.replace(/\s/g, '').length === 13 && cuiValido(dpi)

  // Handler cuando cambia el tipo de documento
  const handleTipoChange = (tipo: TipoDocumento) => {
    setValue('padreDocTipo', tipo, { shouldValidate: false })
    // Limpiar campos geográficos
    setValue('padreDepartamento', '', { shouldValidate: false })
    setValue('padreMunicipio', '', { shouldValidate: false })
    setValue('padreCuiCedula', '', { shouldValidate: false })
    // Pre-llenar nacionalidad según tipo
    const info = getDocumentoInfo(tipo)
    if (info.nacionalidadDefault) {
      // Para el padre ajustar género: Mexicana → Mexicano
      const nac = info.nacionalidadDefault === 'Mexicana' ? 'Mexicano' : info.nacionalidadDefault
      setValue('padreNacionalidad', nac, { shouldValidate: false })
    }
  }

  // Handler cuando se encuentra un paciente en FHIR
  const handlePacienteEncontrado = (paciente: PersonaFhirDTO, modo: ModoBusqueda) => {
    const tieneDpi = !!paciente.cui

    // ── RESET ──
    setValue('padreCuiCedula', '', { shouldValidate: false })
    setValue('padrePrimerNombre', '', { shouldValidate: false })
    setValue('padreSegundoNombre', '', { shouldValidate: false })
    setValue('padrePrimerApellido', '', { shouldValidate: false })
    setValue('padreSegundoApellido', '', { shouldValidate: false })
    resetField('padreEdad')
    setValue('padreNacionalidad', '', { shouldValidate: false })
    setValue('padreOcupacion', '', { shouldValidate: false })
    setValue('padreDireccion', '', { shouldValidate: false })
    setValue('padreZona', '', { shouldValidate: false })
    setValue('padreMunicipio', '', { shouldValidate: false })
    setValue('padreDepartamento', '', { shouldValidate: false })
    resetField('padrePuebloPertenencia')
    resetField('padreEstadoCivil')
    resetField('padreEscolaridad')

    // ── Fijar tipo de documento ──
    if (tieneDpi) {
      setValue('padreDocTipo', 'DPI_GT', { shouldValidate: false })
      setValue('padreCuiCedula', paciente.cui!, { shouldValidate: true })
    }

    if (paciente.primerNombre) setValue('padrePrimerNombre', paciente.primerNombre, { shouldValidate: true })
    if (paciente.segundoNombre) setValue('padreSegundoNombre', paciente.segundoNombre, { shouldValidate: true })
    if (paciente.primerApellido) setValue('padrePrimerApellido', paciente.primerApellido, { shouldValidate: true })
    if (paciente.segundoApellido) setValue('padreSegundoApellido', paciente.segundoApellido, { shouldValidate: true })
    if (paciente.edad != null) setValue('padreEdad', paciente.edad, { shouldValidate: true })
    if (paciente.ocupacion) setValue('padreOcupacion', paciente.ocupacion, { shouldValidate: true })

    const resultadoMapeo = mapearDatosFhirCompleto({
      departamento: paciente.departamento,
      municipio: paciente.municipio,
      cui: paciente.cui,
      estadoCivil: paciente.estadoCivil,
      puebloPertenencia: paciente.puebloPertenencia,
      nacionalidad: paciente.nacionalidad
    }, 'masculino')

    if (resultadoMapeo.data.departamento) setValue('padreDepartamento', resultadoMapeo.data.departamento, { shouldValidate: true })
    if (resultadoMapeo.data.municipio) setValue('padreMunicipio', resultadoMapeo.data.municipio, { shouldValidate: true })
    if (resultadoMapeo.data.estadoCivil) setValue('padreEstadoCivil', resultadoMapeo.data.estadoCivil, { shouldValidate: true })
    if (resultadoMapeo.data.puebloPertenencia) setValue('padrePuebloPertenencia', resultadoMapeo.data.puebloPertenencia, { shouldValidate: true })

    // ── Nacionalidad: si tiene DPI siempre guatemalteco; si no, usar lo que devuelva FHIR ──
    if (tieneDpi) {
      setValue('padreNacionalidad', 'Guatemalteco', { shouldValidate: true })
    } else if (resultadoMapeo.data.nacionalidad) {
      const nac = resultadoMapeo.data.nacionalidad === 'Guatemalteca' ? 'Guatemalteco' : resultadoMapeo.data.nacionalidad
      setValue('padreNacionalidad', nac, { shouldValidate: true })
    }

    if (resultadoMapeo.warnings.length > 0) {
      console.warn('[SeccionV] Advertencias de mapeo FHIR:', resultadoMapeo.warnings)
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
      const nac = docInfo.nacionalidadDefault === 'Mexicana' ? 'Mexicano' : docInfo.nacionalidadDefault
      setValue('padreNacionalidad', nac, { shouldValidate: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [padreDocTipo, padrePaisPasaporte])

  // Autocompletar depto/municipio/nacionalidad al ingresar DPI válido MANUALMENTE
  // Solo cuando tipo = DPI_GT
  useEffect(() => {
    if (padreDocTipo !== 'DPI_GT') return
    if (!dpi || datosDeFhir) return

    const digits = dpi.replace(/\s/g, '')
    if (digits.length !== 13 || !cuiValido(digits)) return

    const info = deptoMuniDesdeCui(digits)
    if (!info) return

    setValue('padreDepartamento', info.depto, { shouldValidate: true })

    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('padreMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    setValue('padreNacionalidad', 'Guatemalteco', { shouldValidate: true })
  }, [dpi, datosDeFhir, padreDocTipo, setValue])

  return (
    <SectionCard title="V. Datos del padre" variant="nacimiento">
      <Grid container spacing={1.5}>
        
        {/* ── BÚSQUEDA FHIR ── */}
        <Grid item xs={12}>
          <BuscadorPacienteFhir
            label="Buscar padre en RENAP por CUI/DPI"
            onPacienteEncontrado={handlePacienteEncontrado}
            onLimpiar={handleLimpiarFhir}
            ocultarModoDpi={!docInfo.mostrarFhirDpi}
          />
        </Grid>

        {/* ── Selector de tipo de documento ── */}
        <Grid item xs={12}>
          <DocumentoSelector
            tipo={padreDocTipo}
            onTipoChange={handleTipoChange}
            paisPasaporte={padrePaisPasaporte ?? ''}
            onPaisChange={(pais) => setValue('padrePaisPasaporte', pais, { shouldValidate: false })}
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
        
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>26. NOMBRE</Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Controller name="padrePrimerNombre" control={control} render={({ field }) => (
            <SmartField label="Primer nombre" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="padreSegundoNombre" control={control} render={({ field }) => (
            <SmartField label="Segundo nombre (opcional)" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="padrePrimerApellido" control={control} render={({ field }) => (
            <SmartField label="Primer apellido" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Controller name="padreSegundoApellido" control={control} render={({ field }) => (
            <SmartField label="Segundo apellido" fieldType="onlyLetters" maxLen={100}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* ── 27. Documento — condicional según tipo ── */}
        <Grid item xs={12}>
          <Controller name="padreCuiCedula" control={control} render={({ field, fieldState }) => (
            padreDocTipo === 'DPI_GT' ? (
              <DpiField
                label={`27. ${docInfo.labelNumero}`}
                value={field.value ?? ''}
                onChange={field.onChange}
                error={!!fieldState.error}
                helperText={fieldState.error?.message ?? (
                  dpiGuatemalteco
                    ? '✓ DPI guatemalteco — depto. y municipio precargados'
                    : 'Opcional: Ingrese el DPI (13 dígitos) para autocompletar'
                )}
              />
            ) : (
              <SmartField
                label={`27. ${docInfo.labelNumero}`}
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

        <Grid item xs={6} sm={3}>
          <Controller name="padreEdad" control={control} render={({ field }) => (
            <SmartField label="28. Edad (años)" fieldType="onlyNumbers" maxLen={2}
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v ? Number(v) : null)} />
          )} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Controller name="padreNacionalidad" control={control} render={({ field }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
              label="29. Nacionalidad"
              inputProps={{ maxLength: 100, readOnly: fhirTieneDpi }}
              InputLabelProps={{ shrink: true }}
              size="small"
              fullWidth
              sx={fhirTieneDpi ? { '& .MuiOutlinedInput-root': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="padreOcupacion" control={control} render={({ field }) => (
            <SmartField label="30. Ocupación u oficio" fieldType="text" maxLen={150}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            31. Dirección de residencia actual
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Controller name="padreDireccion" control={control} render={({ field }) => (
            <SmartField label="Dirección" fieldType="text" maxLen={150}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <Controller name="padreZona" control={control} render={({ field }) => (
            <SmartField label="Zona" fieldType="alphanumeric" maxLen={10}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* ── Depto / Municipio — condicional según tipo de documento ── */}
        {docInfo.usaSelectorGT && (
          <Controller
            name="padreMunicipio"
            control={control}
            render={({ field: muni }) => (
              <Controller
                name="padreDepartamento"
                control={control}
                render={({ field: depto }) => (
                  <DeptoMuniSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 2 }}
                    muniGrid={{ xs: 12, sm: 2 }}
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
            name="padreMunicipio"
            control={control}
            render={({ field: muni }) => (
              <Controller
                name="padreDepartamento"
                control={control}
                render={({ field: depto }) => (
                  <DeptoMuniMexSelector
                    deptoValue={depto.value ?? ''}
                    muniValue={muni.value ?? ''}
                    onDeptoChange={(v) => { depto.onChange(v); muni.onChange('') }}
                    onMuniChange={muni.onChange}
                    deptoGrid={{ xs: 12, sm: 2 }}
                    muniGrid={{ xs: 12, sm: 2 }}
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
            <Grid item xs={12} sm={3}>
              <Controller name="padreDepartamento" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={docInfo.labelDepto}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: true }}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller name="padreMunicipio" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ''}
                  label={docInfo.labelMuni}
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 100 }}
                  InputLabelProps={{ shrink: true }}
                />
              )} />
            </Grid>
          </>
        )}

        {/* ── Estado civil en tarjetas ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 1 }}>
            33. ESTADO CIVIL
          </Typography>
          <Controller name="padreEstadoCivil" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={ESTADO_CIVIL_PADRE}
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
          <Controller name="padrePuebloPertenencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>32. Pueblo de pertenencia</InputLabel>
              <Select {...field} value={field.value ?? ''} label="32. Pueblo de pertenencia"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="padreEscolaridad" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>34. Escolaridad</InputLabel>
              <Select {...field} value={field.value ?? ''} label="34. Escolaridad"
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
