import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio,
  Typography, Divider, Alert,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SectionCard from '@/shared/components/common/SectionCard'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

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
        <Grid item xs={12} sm={12}>
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
        <Grid item xs={12} sm={6}>
          <TextField label="Municipio" {...register('mortinatoMadreResidenciaMunicipio')} InputLabelProps={{ shrink: true }} inputProps={{ maxLength: 100 }} />
        </Grid>
        <Grid item xs={12} sm={6}>
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Sí" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="No" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="Ignorado" />
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Hombre" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="Mujer" />
                  <FormControlLabel value={9} control={<Radio size="small" />} label="Ignorado" />
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Antes del Parto" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="Durante el Parto" />
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Simple" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="Doble" />
                  <FormControlLabel value={3} control={<Radio size="small" />} label="Múltiple" />
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Eutócico" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="Distócico" />
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
                  <FormControlLabel value={1} control={<Radio size="small" />} label="Vaginal" />
                  <FormControlLabel value={2} control={<Radio size="small" />} label="Cesárea" />
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
