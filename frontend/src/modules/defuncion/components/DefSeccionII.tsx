import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, FormLabel, RadioGroup, FormControlLabel, Radio,
  Typography, Divider, Box,
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import SectionCard from '@/shared/components/common/SectionCard'
import DpiField from '@/shared/components/common/DpiField'
import SmartField from '@/shared/components/common/SmartField'
import DeptoMuniSelector from '@/shared/components/common/DeptoMuniSelector'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

// Opciones según sexo
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
  const { control, watch, formState: { errors } } = useFormContext<DefuncionFormValues>()
  const sexo = watch('fallecidoSexo')  // Observar el sexo seleccionado

  // Determinar opciones de estado civil según sexo
  const estadoCivilOptions = sexo === 1 ? ESTADO_CIVIL_MASCULINO :
    sexo === 2 ? ESTADO_CIVIL_FEMENINO :
      ESTADO_CIVIL_MASCULINO  // Por defecto masculino si no hay selección

  return (
    <SectionCard title="II. Datos del fallecido (a)" subtitle="FALLECIÓ:">
      <Grid container spacing={1.5}>
        {/* Nombre completo */}
        <Grid item xs={12}>
          <Controller name="fallecidoNombreCompleto" control={control} render={({ field }) => (
            <SmartField label="6. Nombres completos *"
              fieldType="text" maxLen={255} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoNombreCompleto}
              helperText={errors.fallecidoNombreCompleto?.message} />
          )} />
        </Grid>

        {/* Sexo */}
        <Grid item xs={12} sm={4}>
          <Controller name="fallecidoSexo" control={control} render={({ field, fieldState }) => (
            <FormControl component="fieldset" error={!!fieldState.error}>
              <FormLabel component="legend" sx={{ fontSize: '0.8rem' }}>7. Sexo *</FormLabel>
              <RadioGroup row {...field} value={field.value ?? ''}
                onChange={(e) => field.onChange(Number(e.target.value))}>
                <FormControlLabel value={1} control={<Radio size="small" />} label="Hombre" />
                <FormControlLabel value={2} control={<Radio size="small" />} label="Mujer" />
                <FormControlLabel value={9} control={<Radio size="small" />} label="Ignorado" />
              </RadioGroup>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
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

        {/* Documento CUI — fila completa para que DPI no compita con otros campos */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            9. Documento de Identificación *
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoDocNumero" control={control} render={({ field, fieldState }) => (
            <DpiField label="DPI"
              value={field.value ?? ''} onChange={field.onChange}
              error={!!fieldState.error} helperText={fieldState.error?.message} />
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
                  required
                />
              )}
            />
          )}
        />

        <Grid item xs={12} sm={6}>
          <Controller name="fallecidoNacionalidad" control={control} render={({ field }) => (
            <SmartField label="11. Nacionalidad *" fieldType="onlyLetters" maxLen={100} required
              value={field.value ?? ''} onChange={field.onChange}
              error={!!errors.fallecidoNacionalidad} helperText={errors.fallecidoNacionalidad?.message} />
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
        {/* Dirección en fila completa para dar espacio suficiente */}
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
