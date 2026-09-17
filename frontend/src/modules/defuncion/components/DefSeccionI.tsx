import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Alert, Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockOutlinedIcon  from '@mui/icons-material/LockOutlined'
import dayjs from 'dayjs'
import SectionCard    from '@/shared/components/common/SectionCard'
import TimeWheelField from '@/shared/components/common/TimeWheelField'
import { useCurrentUser } from '@/shared/context/UserContext'
import { INSTITUCION }    from '@/shared/constants/institucion'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const QUIEN_INFORMA_OPTIONS = [
  { value: 1, label: 'Médico' },
  { value: 2, label: 'Paramédico' },
  { value: 3, label: 'Autoridad' },
]

export default function DefSeccionI() {
  const { usuario }          = useCurrentUser()
  const { control, setValue, watch } = useFormContext<DefuncionFormValues>()

  const tienesDatos = !usuario.cargando && !!usuario.nombresApellidos
  const quienInformaTipo = watch('infoQuienInformaTipo')
  const esMedico = quienInformaTipo === 1

  useEffect(() => {
    if (usuario.cargando) return
    if (usuario.nombresApellidos)
      setValue('infoQuienInformaNombres', usuario.nombresApellidos)
    if (usuario.cui)
      setValue('infoDocumentoIdentificacion', usuario.cui)
    if (usuario.noColegiado)
      setValue('infoNoColegiado', usuario.noColegiado)
    const tipo = usuario.tipoInformante <= 3 ? usuario.tipoInformante : 1
    setValue('infoQuienInformaTipo',  tipo)
    setValue('infoFechaDefuncion',    dayjs().format('YYYY-MM-DD'))
    setValue('infoLugarMunicipio',    INSTITUCION.MUNICIPIO)
    setValue('infoLugarDepartamento', INSTITUCION.DEPARTAMENTO)
  }, [
    usuario.nombresApellidos, usuario.cui, usuario.tipoInformante,
    usuario.noColegiado, usuario.cargando, setValue,
  ])

  return (
    <SectionCard title="I. Información General">

      {usuario.cargando ? (
        <Alert severity="info" sx={{ mb: 2, py: 0.5 }}>
          <Typography variant="caption">Cargando datos del perfil…</Typography>
        </Alert>
      ) : usuario.advertencia ? (
        <Alert severity="warning" sx={{ mb: 2, py: 0.5 }}>
          <Typography variant="caption">{usuario.advertencia}</Typography>
        </Alert>
      ) : (
        <Alert severity="success" icon={<AccountCircleIcon />} sx={{ mb: 2, py: 0.5 }}>
          <Typography variant="caption">
            <strong>{usuario.nombresApellidos}</strong>
            {usuario.numeroEmpleado ? ` · Emp. ${usuario.numeroEmpleado}` : ''}
            {usuario.renglon        ? ` · Renglón ${usuario.renglon}`     : ''}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>

        {/* ── Quién informa ── */}
        <Grid item xs={12} sm={8}>
          <Controller name="infoQuienInformaNombres" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="1. Nombres y apellidos *"
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (tienesDatos ? 'Del perfil del sistema' : 'Ingrese sus nombres y apellidos')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 255, readOnly: tienesDatos }}
              InputProps={tienesDatos ? {
                endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
              } : undefined}
              sx={tienesDatos ? { '& .MuiInputBase-input': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>

        <Grid item xs={12} sm={4}>
          <Controller name="infoQuienInformaTipo" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel>3. Quién informa es *</InputLabel>
              <Select
                {...field}
                value={field.value ?? ''}
                label="3. Quién informa es *"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
              >
                <MenuItem value=""><em>Seleccionar</em></MenuItem>
                {QUIEN_INFORMA_OPTIONS.map(o => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>

        {/* ── Documento ── */}
        <Grid item xs={12} sm={8}>
          <Controller name="infoDocumentoIdentificacion" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="2. DPI / Documento"
              helperText={tienesDatos ? 'Del perfil del sistema' : 'Ingrese su DPI (13 dígitos)'}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 100, readOnly: tienesDatos }}
              InputProps={tienesDatos ? {
                endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
              } : undefined}
              sx={tienesDatos ? { '& .MuiInputBase-input': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>

        {/* ── Colegiado ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="infoNoColegiado" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={`3.1 No. de colegiado${esMedico ? ' *' : ''}`}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (esMedico ? 'Requerido para médicos' : 'Opcional')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 50 }}
            />
          )} />
        </Grid>

        {/* ── Fecha defunción ── */}
        <Grid item xs={12} sm={5}>
          <Controller name="infoFechaDefuncion" control={control} render={({ field, fieldState }) => (
            <DatePicker
              label="4. Fecha de la defunción *"
              value={field.value ? dayjs(field.value) : null}
              onChange={(d) => field.onChange(d ? d.format('YYYY-MM-DD') : '')}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small', fullWidth: true,
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message ?? 'Seleccione del calendario',
                  InputLabelProps: { shrink: true },
                  inputProps: { readOnly: true },
                },
              }}
            />
          )} />
        </Grid>

        {/* ── Hora defunción — TimeWheelField ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="infoHoraDefuncion" control={control} render={({ field, fieldState }) => (
            <TimeWheelField
              label="5. Hora de defunción *"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Establecida por el médico tratante'}
            />
          )} />
        </Grid>

      </Grid>
    </SectionCard>
  )
}
