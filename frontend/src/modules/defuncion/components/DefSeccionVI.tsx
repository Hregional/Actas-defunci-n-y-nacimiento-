import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio,
  Typography, Divider, Alert,
} from '@mui/material'
import SectionCard from '@/shared/components/common/SectionCard'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const ESTADO_CIVIL_OPTIONS = [
  { value: 1, label: '1. Soltera' },
  { value: 2, label: '2. Casada' },
  { value: 3, label: '3. Unida' },
  { value: 9, label: '9. Ignorado' },
]

const PUEBLO_OPTIONS = [
  { value: 1, label: '1. Maya' },
  { value: 2, label: '2. Garífuna' },
  { value: 3, label: '3. Xinka' },
  { value: 4, label: '4. Mestizo, Ladino' },
  { value: 5, label: '5. Ninguno' },
  { value: 9, label: '9. Ignorado' },
]

const ESCOLARIDAD_OPTIONS = [
  { value: 0, label: '0. Ninguna' },
  { value: 1, label: '1. Primaria incompleta' },
  { value: 2, label: '2. Primaria completa' },
  { value: 3, label: '3. Básico incompleto' },
  { value: 4, label: '4. Básico completo' },
  { value: 5, label: '5. Diversificado incompleto' },
  { value: 6, label: '6. Diversificado completo' },
  { value: 7, label: '7. Universitario incompleto' },
  { value: 8, label: '8. Universitario completo' },
  { value: 9, label: '9. Ignorado' },
]

export default function DefSeccionVI() {
  const { register, control } = useFormContext<DefuncionFormValues>()

  return (
    <SectionCard
      title="VI. Datos de la defunción fetal (Mortinato)"
      subtitle="Completar solo si la muerte es fetal"
    >
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>SI LA MUERTE ES FETAL</strong>, complete esta sección.
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
            label="20. Nombres completos"
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
          <TextField label="Doc. (CUI / Cédula / Otro)" {...register('mortinatoMadreDocNumero')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
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
        <Grid item xs={12} sm={4}>
          <TextField label="Departamento" {...register('mortinatoMadreLugarNacDepartamento')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField label="Municipio" {...register('mortinatoMadreLugarNacMunicipio')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>

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
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoMadreEstadoCivil"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>24. Estado civil</InputLabel>
                <Select {...field} value={field.value ?? ''} label="24. Estado civil"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                  <MenuItem value=""><em>Seleccionar</em></MenuItem>
                  {ESTADO_CIVIL_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoMadrePuebloPertenencia"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>25. Pueblo de pertenencia</InputLabel>
                <Select {...field} value={field.value ?? ''} label="25. Pueblo de pertenencia"
                  onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}>
                  <MenuItem value=""><em>Seleccionar</em></MenuItem>
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
        <Grid item xs={12} sm={6}>
          <TextField label="Dirección exacta" {...register('mortinatoMadreResidenciaDireccion')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 255 }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Municipio" {...register('mortinatoMadreResidenciaMunicipio')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField label="Departamento" {...register('mortinatoMadreResidenciaDepartamento')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField label="27. Ocupación" {...register('mortinatoMadreOcupacion')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 150 }} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="mortinatoMadreSabeLeer"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>28. Sabe leer y escribir</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Sí" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. No" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="9. Ignorado" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Controller
            name="mortinatoMadreEscolaridad"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl error={!!fieldState.error} fullWidth size="small">
                <InputLabel>29. Escolaridad</InputLabel>
                <Select {...field} value={field.value ?? ''} label="29. Escolaridad"
                  onChange={(e) => field.onChange(e.target.value !== '' ? Number(e.target.value) : null)}>
                  <MenuItem value=""><em>Seleccionar</em></MenuItem>
                  {ESCOLARIDAD_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField label="30. Nacionalidad" {...register('mortinatoMadreNacionalidad')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
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
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>32. Sexo</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Hombre" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. Mujer" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="9. Ignorado" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoFetoMurio"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>33. Murió</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Antes del Parto" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. Durante el Parto" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoPartoFue"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>34. El parto fue</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Simple" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. Doble" />
                  <FormControlLabel value={3} control={<Radio size="small" />} label="3. Múltiple" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoClaseParto"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>35. Clase de parto</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Eutócico" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. Distócico" />
                </RadioGroup>
              </FormControl>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="mortinatoViaParto"
            control={control}
            render={({ field }) => (
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>36. Vía del parto</FormLabel>
                <RadioGroup row {...field} value={field.value ?? ''} onChange={(e) => field.onChange(Number(e.target.value))}>
                  <FormControlLabel value={1} control={<Radio size="small" />} label="1. Vaginal" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="2. Cesárea" />
                </RadioGroup>
              </FormControl>
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
            helperText="Ej: Asfixia perinatal, circular del cordón..."
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Maternas"
            {...register('mortinatoCausasMaternas')}
            InputLabelProps={{ shrink: true }}
            multiline
            rows={3}
            helperText="Ej: Eclampsia, insuficiencia placentaria..."
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
