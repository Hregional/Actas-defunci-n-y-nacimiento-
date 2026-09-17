import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio,
} from '@mui/material'
import SectionCard from '@/shared/components/common/SectionCard'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const ASISTENCIA_OPTIONS = [
  { value: 1, label: 'Médica' }, { value: 2, label: 'Paramédica' },
  { value: 3, label: 'Comadrona' }, { value: 4, label: 'Empírica' },
  { value: 5, label: 'Ninguna' }, { value: 9, label: 'Ignorado' },
]
const LUGAR_DEFUNCION_OPTIONS = [
  { value: 1, label: 'Hospital Público' }, { value: 2, label: 'Hospital Privado' },
  { value: 3, label: 'Otros servicios de salud pública' }, { value: 4, label: 'IGSS' },
  { value: 5, label: 'Vía Pública' }, { value: 6, label: 'Domicilio' },
  { value: 7, label: 'Lugar de trabajo' }, { value: 8, label: 'Otro' },
  { value: 9, label: 'Ignorado' },
]

export default function DefSeccionVII() {
  const { control } = useFormContext<DefuncionFormValues>()

  return (
    <SectionCard title="VII. Otros datos de la defunción">
      <Grid container spacing={2}>
        {/* Necropsia */}
        <Grid item xs={12} sm={4}>
          <Controller name="otrosHuboNecropsia" control={control} render={({ field, fieldState }) => (
            <FormControl component="fieldset" error={!!fieldState.error}>
              <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>39. Hubo necropsia *</FormLabel>
              <RadioGroup row {...field} value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}>
                <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
              </RadioGroup>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>

        {/* Clase de asistencia */}
        <Grid item xs={12} sm={4}>
          <Controller name="otrosClaseAsistencia" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>40. Clase de asistencia recibida *</InputLabel>
              <Select {...field} value={field.value ?? ''} label="40. Clase de asistencia recibida *"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {ASISTENCIA_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>

        {/* Lugar de defunción */}
        <Grid item xs={12} sm={4}>
          <Controller name="otrosLugarDefuncion" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>41. Lugar de defunción *</InputLabel>
              <Select {...field} value={field.value ?? ''} label="41. Lugar de defunción *"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {LUGAR_DEFUNCION_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
