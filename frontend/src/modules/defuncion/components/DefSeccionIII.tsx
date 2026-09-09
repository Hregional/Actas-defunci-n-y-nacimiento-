import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Alert,
} from '@mui/material'
import SectionCard from '@/shared/components/common/SectionCard'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const MUERTE_DURANTE_OPTIONS = [
  { value: 1, label: '1. El embarazo' },
  { value: 2, label: '2. El parto' },
  { value: 3, label: '3. El puerperio (Dentro de los 42 días siguientes a la terminación del embarazo)' },
  { value: 4, label: '4. De 43 días a 11 meses, después del parto o aborto' },
  { value: 5, label: '5. No estuvo embarazada durante los 11 meses previos a la muerte' },
  { value: 9, label: '9. Ignorado' },
]

export default function DefSeccionIII() {
  const { control } = useFormContext<DefuncionFormValues>()

  return (
    <SectionCard
      title="III. Mujeres en edad fértil"
      subtitle="Aplica únicamente si el fallecido(a) es mujer entre 10 y 54 años"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>17.</strong> Si la defunción corresponde a una mujer entre 10 y 54 años,
            especifique si la muerte ocurrió durante:
          </Alert>
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="fertilMuerteDurante"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>17. La muerte ocurrió durante</InputLabel>
                <Select
                  {...field}
                  value={field.value ?? ''}
                  label="17. La muerte ocurrió durante"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                >
                  <MenuItem value=""><em>No aplica / Seleccionar</em></MenuItem>
                  {MUERTE_DURANTE_OPTIONS.map(o => (
                    <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                  ))}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
