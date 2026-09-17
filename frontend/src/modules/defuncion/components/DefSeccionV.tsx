import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio,
  Alert,
} from '@mui/material'
import SectionCard from '@/shared/components/common/SectionCard'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const PRESUNTO_OPTIONS = [
  { value: 1, label: 'Suicidio' },
  { value: 2, label: 'Homicidio' },
  { value: 3, label: 'Accidente' },
  { value: 9, label: 'Ignorado' },
]

const LUGAR_LESION_OPTIONS = [
  { value: 0, label: 'Vivienda' },
  { value: 1, label: 'Institución residencial' },
  { value: 2, label: 'Escuela u oficina pública' },
  { value: 3, label: 'Áreas deportivas' },
  { value: 4, label: 'Calle o carretera (vía pública)' },
  { value: 5, label: 'Área comercial o de servicios' },
  { value: 6, label: 'Área industrial (taller, fábrica u obra)' },
  { value: 7, label: 'Granja (rancho o parcela)' },
  { value: 8, label: 'Otro' },
  { value: 9, label: 'Ignorado' },
]

export default function DefSeccionV() {
  const { register, control } = useFormContext<DefuncionFormValues>()

  return (
    <SectionCard
      title="V. Defunciones accidentales y violentas"
      subtitle="**Únicamente para fines estadísticos"
    >
      <Alert severity="warning" sx={{ mb: 2 }}>
        Estos datos no prejuzgan sobre la calificación del hecho que en definitiva hicieren los
        tribunales, es <strong>ÚNICAMENTE PARA FINES ESTADÍSTICOS</strong>.
      </Alert>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="accidentalFuePresunto"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>19. Fue un presunto</InputLabel>
                <Select
                  {...field}
                  value={field.value ?? ''}
                  label="19. Fue un presunto"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <MenuItem value=""><em>No aplica</em></MenuItem>
                  {PRESUNTO_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="accidentalLugarLesion"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>19.1 Lugar donde ocurrió la lesión</InputLabel>
                <Select
                  {...field}
                  value={field.value ?? ''}
                  label="19.1 Lugar donde ocurrió la lesión"
                  onChange={(e) => field.onChange(e.target.value !== '' ? Number(e.target.value) : null)}
                >
                  <MenuItem value=""><em>No aplica</em></MenuItem>
                  {LUGAR_LESION_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="accidentalOcurrioTrabajo"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>
                  19.2 Ocurrió en el desempeño de su trabajo
                </FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="Ignorado" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller
            name="accidentalFueTransito"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>
                  19.3 Fue accidente de tránsito
                </FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="Ignorado" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="19.4 Arma que lo produjo"
            {...register('accidentalArmaProdujo')}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 255 }}
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
