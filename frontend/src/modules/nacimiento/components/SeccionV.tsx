/**
 * Sección V — Datos del padre (todos opcionales)
 *
 * - DPI opcional con validación
 * - Si el DPI es guatemalteco válido (13 dígitos, checksum correcto):
 *   → Departamento y Municipio se autocompletan y bloquean
 *   → Nacionalidad se fija a "Guatemalteco" y se bloquea
 */
import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Typography, TextField,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SectionCard from '@/shared/components/common/SectionCard'
import DpiField from '@/shared/components/common/DpiField'
import SmartField from '@/shared/components/common/SmartField'
import DeptoMuniSelector from '@/shared/components/common/DeptoMuniSelector'
import { cuiValido, deptoMuniDesdeCui } from '@/shared/utils/cuiValidator'
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

const PUEBLO_OPTIONS = [
  { value: 1, label: 'Maya' }, { value: 2, label: 'Garífuna' },
  { value: 3, label: 'Xinka' }, { value: 4, label: 'Mestizo / Ladino' },
  { value: 5, label: 'Otro' },
]
const ESTADO_CIVIL_PADRE = [
  { value: 1, label: 'Soltero' }, { value: 2, label: 'Casado' },
  { value: 3, label: 'Unido' }, { value: 4, label: 'Viudo' },
  { value: 5, label: 'Divorciado' }, { value: 6, label: 'Unión no declarada' },
]
const ESCOLARIDAD_OPTIONS = [
  { value: 1, label: 'Ninguna' }, { value: 2, label: 'Primaria' },
  { value: 3, label: 'Básico' }, { value: 4, label: 'Diversificado' },
  { value: 5, label: 'Universitario' },
]

export default function SeccionV() {
  const { control, watch, setValue } = useFormContext<NacimientoFormValues>()

  const dpi = watch('padreCuiCedula')

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
    setValue('padreDepartamento', info.depto, { shouldValidate: true })

    // Autocompletar municipio usando el índice
    const deptoData = DEPARTAMENTOS_GUATEMALA.find(d => d.title === info.depto)
    if (deptoData && deptoData.mun[info.muniIndex]) {
      setValue('padreMunicipio', deptoData.mun[info.muniIndex], { shouldValidate: true })
    }

    // Fijar nacionalidad a guatemalteco
    setValue('padreNacionalidad', 'Guatemalteco', { shouldValidate: true })
  }, [dpi, setValue])

  return (
    <SectionCard title="V. Datos del padre">
      <Grid container spacing={1.5}>
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

        <Grid item xs={12}>
          <Controller name="padreCuiCedula" control={control} render={({ field, fieldState }) => (
            <DpiField
              label="27. DPI"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (dpiGuatemalteco
                ? '✓ DPI guatemalteco — depto. y municipio precargados'
                : 'Opcional: Ingrese el DPI (13 dígitos) para autocompletar'
              )}
            />
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
              label="29. Nacionalidad"
              inputProps={{ maxLength: 100, readOnly: !!dpiGuatemalteco }}
              InputProps={dpiGuatemalteco ? {
                endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
              } : undefined}
              sx={dpiGuatemalteco ? { '& .MuiInputBase-input': { bgcolor: 'action.hover' } } : undefined}
              helperText={dpiGuatemalteco ? 'Del DPI' : undefined}
              InputLabelProps={{ shrink: true }}
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
        <Grid item xs={12} sm={6}>
          <Controller name="padreDireccion" control={control} render={({ field }) => (
            <SmartField label="Dirección" fieldType="text" maxLen={255}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>
        <Grid item xs={4} sm={2}>
          <Controller name="padreZona" control={control} render={({ field }) => (
            <SmartField label="Zona" fieldType="alphanumeric" maxLen={10}
              value={field.value ?? ''} onChange={field.onChange} />
          )} />
        </Grid>

        {/* ── Depto / Municipio — bloqueados si DPI guatemalteco ── */}
        {dpiGuatemalteco ? (
          <>
            <Grid item xs={12} sm={2}>
              <Controller name="padreDepartamento" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  label="Departamento"
                  inputProps={{ readOnly: true }}
                  InputProps={{ endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} /> }}
                  sx={{ '& .MuiInputBase-input': { bgcolor: 'action.hover' } }}
                  helperText="Del DPI"
                  InputLabelProps={{ shrink: true }}
                />
              )} />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controller name="padreMunicipio" control={control} render={({ field }) => (
                <TextField
                  {...field}
                  label="Municipio"
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
                    deptoLabel="Departamento"
                    muniLabel="Municipio"
                  />
                )}
              />
            )}
          />
        )}

        <Grid item xs={12} sm={4}>
          <Controller name="padrePuebloPertenencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>32. Pueblo de pertenencia</InputLabel>
              <Select {...field} value={field.value ?? ''} label="32. Pueblo de pertenencia"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {PUEBLO_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name="padreEstadoCivil" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>33. Estado civil</InputLabel>
              <Select {...field} value={field.value ?? ''} label="33. Estado civil"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {ESTADO_CIVIL_PADRE.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller name="padreEscolaridad" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>34. Escolaridad</InputLabel>
              <Select {...field} value={field.value ?? ''} label="34. Escolaridad"
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
