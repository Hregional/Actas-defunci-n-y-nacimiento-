import { useEffect } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import {
  Grid, FormControl, InputLabel, Select, MenuItem,
  FormHelperText, Alert, Typography, TextField,
} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import SectionCard from '@/shared/components/common/SectionCard'
import { useCurrentUser } from '@/shared/context/UserContext'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

const QUIEN_INFORMA_LABELS: Record<number, string> = {
  1: 'Médico',
  2: 'Personal de enfermería',
  3: 'Personal institucional',
  4: 'Comadrona',
  5: 'Autoridad Local',
}

export default function SeccionI() {
  const { usuario } = useCurrentUser()
  const { control, setValue, getValues, watch } = useFormContext<NacimientoFormValues>()

  const tienesDatos = !usuario.cargando && !!usuario.nombresApellidos
  const quienInforma = watch('suscribeQuienInforma')
  const esMedico = quienInforma === 1

  // Precarga del perfil: corre UNA SOLA VEZ, solo si el nombre del formulario
  // aún está vacío (no sobreescribe datos de un registro en edición).
  useEffect(() => {
    if (usuario.cargando) return
    // Si el nombre ya tiene valor (puede ser del reset de edición), no tocar nada
    if (getValues('suscribeNombresApellidos')) return

    if (usuario.nombresApellidos)
      setValue('suscribeNombresApellidos', usuario.nombresApellidos, { shouldValidate: false })
    if (usuario.cui)
      setValue('suscribeCuiCedula', usuario.cui, { shouldValidate: false })
    if (!getValues('suscribeQuienInforma'))
      setValue('suscribeQuienInforma', usuario.tipoInformante || 1, { shouldValidate: false })
    if (usuario.noColegiado)
      setValue('suscribeNoColegiado', usuario.noColegiado, { shouldValidate: false })
    if (usuario.noRegistroComadrona)
      setValue('suscribeNoRegistroComadrona', usuario.noRegistroComadrona, { shouldValidate: false })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario.cargando])

  return (
    <SectionCard title="I. Datos del que suscribe">

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
            {' · '}{QUIEN_INFORMA_LABELS[usuario.tipoInformante || 1] ?? ''}
            {usuario.renglon ? ` · Renglón ${usuario.renglon}` : ''}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={1.5}>

        <Grid item xs={12}>
          <Controller name="suscribeNombresApellidos" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Nombres y Apellidos *"
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

        <Grid item xs={12}>
          <Controller name="suscribeCuiCedula" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="DPI"
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (tienesDatos ? 'Del perfil del sistema' : 'Ingrese su DPI (13 dígitos)')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 13, readOnly: tienesDatos }}
              InputProps={tienesDatos ? {
                endAdornment: <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', mr: 0.5 }} />,
              } : undefined}
              sx={tienesDatos ? { '& .MuiInputBase-input': { bgcolor: 'action.hover' } } : undefined}
            />
          )} />
        </Grid>

        <Grid item xs={12}>
          <Controller name="suscribeQuienInforma" control={control} render={({ field, fieldState }) => (
            <FormControl error={!!fieldState.error} fullWidth size="small">
              <InputLabel shrink>Quién Informa el nacimiento *</InputLabel>
              <Select
                {...field}
                value={field.value ?? 1}
                label="Quién Informa el nacimiento *"
                notched
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 1)}
              >
                {Object.entries(QUIEN_INFORMA_LABELS).map(([v, l]) => (
                  <MenuItem key={v} value={Number(v)}>{l}</MenuItem>
                ))}
              </Select>
              {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
            </FormControl>
          )} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller name="suscribeNoColegiado" control={control} render={({ field, fieldState }) => (
            <TextField
              {...field}
              label={`No. Colegiado${esMedico ? ' *' : ''}`}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? (esMedico ? 'Requerido para médicos' : 'Opcional')}
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 50 }}
            />
          )} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Controller name="suscribeNoRegistroComadrona" control={control} render={({ field }) => (
            <TextField
              {...field}
              label="Registro comadrona"
              helperText="Opcional — solo si aplica"
              InputLabelProps={{ shrink: true }}
              inputProps={{ maxLength: 50 }}
            />
          )} />
        </Grid>

      </Grid>
    </SectionCard>
  )
}
