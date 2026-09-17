/**
 * Sección IV — Datos de la madre
 *
 * - DPI requerido con validación oficial
 * - Si el DPI es guatemalteco válido (13 dígitos, checksum correcto):
 *   → Departamento y Municipio se autocompletan y bloquean
 *   → Nacionalidad se fija a "Guatemalteca" y se bloquea
 * - Edad, Nacionalidad y Ocupación son requeridos
 */
import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Typography, TextField,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SectionCard      from '@/shared/components/common/SectionCard'
import DpiField         from '@/shared/components/common/DpiField'
import SmartField       from '@/shared/components/common/SmartField'
import DeptoMuniSelector from '@/shared/components/common/DeptoMuniSelector'
import { cuiValido, deptoMuniDesdeCui } from '@/shared/utils/cuiValidator'
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' }, { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' }, { value: 4, label: 'Mestizo / Ladino' },
  { value: 5, label: 'Otro' },
]
const ESTADO_CIVIL_MADRE = [
  { value: 1, label: 'Soltera' }, { value: 2, label: 'Casada' },
  { value: 3, label: 'Unida' }, { value: 4, label: 'Viuda' },
  { value: 5, label: 'Divorciada' }, { value: 6, label: 'Unión no declarada' },
]
const ESCOLARIDAD_OPTIONS = [
  { value: 1, label: 'Ninguna' }, { value: 2, label: 'Primaria' },
  { value: 3, label: 'Básico' }, { value: 4, label: 'Diversificado' },
  { value: 5, label: 'Universitario' },
]

export default function SeccionIV() {
  const { control, watch, setValue, formState: { errors } } = useFormContext<NacimientoFormValues>()

  const dpi = watch('madreCuiCedula')

  // Detectar si el DPI es guatemalteco válido
  const dpiGuatemalteco = dpi && dpi.replace(/\s/g, '').length === 13 && cuiValido(dpi)

  // Autocompletar depto/municipio/nacionalidad al ingresar DPI válido
  useEffect(() => {
    if (!dpi) return

    const digits = dpi.replace(/\s/g, '')
    if (digits.length !== 13 || !cuiValido(digits)) return

    const info = deptoMuniDesdeCui(digits)
    if (!info) return

    // Autocompletar departamento
    setValue('madreDepartamento', info.depto, { shouldValidate: true })

    // Autocompletar municipio usando el índice
    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('madreMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    // Fijar nacionalidad a guatemalteca
    setValue('madreNacionalidad', 'Guatemalteca', { shouldValidate: true })
  }, [dpi, setValue])

  // Limpiar autocompletados si el DPI se borra o cambia a inválido
  useEffect(() => {
    if (!dpi || !cuiValido(dpi)) {
      // Solo limpiar si los campos tienen valores que vendrían del autocompletado
      // No limpiar si el usuario los editó manualmente (cuando el DPI era inválido)
      if (!dpiGuatemalteco) {
        // No borrar — el usuario puede ingresar extranjero con datos manuales
      }
    }
  }, [dpi, dpiGuatemalteco])

  return (
    <SectionCard title="IV. Datos de la madre">
      <Grid container spacing={1.5}>

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

        {/* ── 18. DPI — requerido ── */}
        <Grid item xs={12}>
          <Controller name="madreCuiCedula" control={control} render={({ field, fieldState }) => (
            <DpiField
              label="18. DPI / Documento *"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (dpiGuatemalteco
                ? '✓ DPI guatemalteco — depto. y municipio precargados'
                : 'Ingrese el DPI (13 dígitos) para autocompletar depto. y municipio'
              )}
            />
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

        {/* ── 20. Nacionalidad — requerida, bloqueada si DPI guatemalteco ── */}
        <Grid item xs={6} sm={3}>
          <Controller name="madreNacionalidad" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="20. Nacionalidad *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (dpiGuatemalteco ? 'Del DPI' : !field.value ? 'Requerida' : undefined)}
              inputProps={{ maxLength: 100, readOnly: !!dpiGuatemalteco }}
              InputProps={dpiGuatemalteco ? {
                endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
              } : undefined}
              sx={dpiGuatemalteco ? { '& .MuiInputBase-input': { bgcolor: 'action.hover' } } : undefined}
              InputLabelProps={{ shrink: true }}
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
        <Grid item xs={12} sm={6}>
          <Controller name="madreDireccion" control={control} render={({ field }) => (
            <SmartField label="Dirección *" fieldType="text" maxLen={255} required
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

        {/* ── Depto / Municipio — bloqueados si DPI guatemalteco ── */}
        {dpiGuatemalteco ? (
          <>
            <Grid item xs={12} sm={2}>
              <Controller name="madreDepartamento" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  label="Departamento *"
                  inputProps={{ readOnly: true }}
                  InputProps={{ endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} /> }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'action.hover' } }}
                  helperText="Del DPI"
                  InputLabelProps={{ shrink: true }}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller name="madreMunicipio" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  label="Municipio *"
                  inputProps={{ readOnly: true }}
                  InputProps={{ endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} /> }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'action.hover' } }}
                  helperText="Del DPI"
                  InputLabelProps={{ shrink: true }}
                />
              )} />
            </Grid>
          </>
        ) : (
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
                    deptoLabel="Departamento"
                    muniLabel="Municipio"
                    required
                  />
                )}
              />
            )}
          />
        )}

        {/* ── Selects de pueblo, estado civil, escolaridad ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="madrePuebloPertenencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>23. Pueblo de pertenencia</InputLabel>
              <Select {...field} value={field.value ?? ''} label="23. Pueblo de pertenencia"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name="madreEstadoCivil" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>24. Estado civil</InputLabel>
              <Select {...field} value={field.value ?? ''} label="24. Estado civil"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {ESTADO_CIVIL_MADRE.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name="madreEscolaridad" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>25. Escolaridad</InputLabel>
              <Select {...field} value={field.value ?? ''} label="25. Escolaridad"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
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
