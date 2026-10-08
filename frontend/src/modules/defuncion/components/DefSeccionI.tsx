import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, TextField, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Alert, Typography, Divider,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockOutlinedIcon  from '@mui/icons-material/LockOutlined'
import PersonIcon from '@mui/icons-material/Person'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import dayjs from 'dayjs'
import SectionCard    from '@/shared/components/common/SectionCard'
import TimeWheelField from '@/shared/components/common/TimeWheelField'
import DateWheelField from '@/shared/components/common/DateWheelField'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
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

  const tienesDatos      = !usuario.cargando && !!usuario.nombresApellidos
  const quienInformaTipo = watch('infoQuienInformaTipo')
  const esMedico         = quienInformaTipo === 1

  useEffect(() => {
    if (usuario.cargando) return
    
    // Solo establecer valores si no existen (primera carga)
    const currentValues = watch()
    
    if (!currentValues.infoQuienInformaNombres && usuario.nombresApellidos)
      setValue('infoQuienInformaNombres', usuario.nombresApellidos)
    if (!currentValues.infoDocumentoIdentificacion && usuario.cui)
      setValue('infoDocumentoIdentificacion', usuario.cui)
    if (!currentValues.infoNoColegiado && usuario.noColegiado)
      setValue('infoNoColegiado', usuario.noColegiado)
    
    // Solo establecer valores por defecto si no existen
    if (currentValues.infoQuienInformaTipo === undefined || currentValues.infoQuienInformaTipo === null)
      setValue('infoQuienInformaTipo', 1) // Médico por defecto
    if (currentValues.infoTipoMuerte === undefined || currentValues.infoTipoMuerte === null)
      setValue('infoTipoMuerte', 1) // Defunción Normal por defecto
    if (!currentValues.infoFechaDefuncion)
      setValue('infoFechaDefuncion', dayjs().format('YYYY-MM-DD'))
    if (!currentValues.infoLugarMunicipio)
      setValue('infoLugarMunicipio', INSTITUCION.MUNICIPIO)
    if (!currentValues.infoLugarDepartamento)
      setValue('infoLugarDepartamento', INSTITUCION.DEPARTAMENTO)
  }, [usuario.cargando, setValue, watch])

  return (
    <SectionCard title="I. Información General" variant="defuncion">

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
            {usuario.renglon ? ` · Renglón ${usuario.renglon}` : ''}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>

        {/* ── Quién informa ── */}
        <Grid item xs={12} sm={8}>
          <Controller name="infoQuienInformaNombres" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              value={field.value ?? ''}
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
                value={field.value ?? 1}
                label="3. Quién informa es *"
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
              >
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
              value={field.value ?? ''}
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
              value={field.value ?? ''}
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
            <DateWheelField
              label="4. Fecha de la defunción"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Seleccione del calendario'}
              required
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

        <Grid item xs={12}><Divider /></Grid>

        {/* ── NUEVO: Tipo de muerte ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            Tipo de defunción *
          </Typography>
          <Controller name="infoTipoMuerte" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={[
                { value: 1, label: 'Defunción Normal', icon: <PersonIcon sx={{ fontSize: 20 }} />, color: '#1976D2'},
                { value: 2, label: 'Defunción Fetal (Mortinato)', icon: <PregnantWomanIcon sx={{ fontSize: 20 }} />, color: '#9C27B0'},
              ]}
              value={field.value ?? null}
              onChange={(v) => field.onChange(Number(v))}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Seleccione el tipo de defunción'}
              direction="row"
              size="md"
            />
          )} />
        </Grid>

      </Grid>
    </SectionCard>
  )
}
