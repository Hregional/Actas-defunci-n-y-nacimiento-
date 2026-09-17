/**
 * Sección III — Datos del niño(a) y del nacimiento
 */
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import {
  Grid, Typography, Divider,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import MaleIcon          from '@mui/icons-material/Male'
import FemaleIcon        from '@mui/icons-material/Female'
import CheckCircleIcon   from '@mui/icons-material/CheckCircle'
import CancelIcon        from '@mui/icons-material/Cancel'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import SectionCard       from '@/shared/components/common/SectionCard'
import TimeWheelField    from '@/shared/components/common/TimeWheelField'
import MedicalNumberField from '@/shared/components/common/MedicalNumberField'
import CardOptionGroup   from '@/shared/components/common/CardOptionGroup'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

const SEXO_OPTS = [
  { value: 1, label: 'Hombre', icon: <MaleIcon   sx={{ fontSize: 20 }} />, color: '#1565C0' },
  { value: 2, label: 'Mujer',  icon: <FemaleIcon sx={{ fontSize: 20 }} />, color: '#AD1457' },
]

const ANOMALIAS_OPTS = [
  { value: 1, label: 'Sí presenta', icon: <CheckCircleIcon sx={{ fontSize: 16 }} />, color: '#C62828' },
  { value: 2, label: 'No presenta', icon: <CancelIcon       sx={{ fontSize: 16 }} />, color: '#2E7D32' },
]

const TIPO_PARTO_OPTS = [
  { value: 1, label: 'Normal',  icon: <PregnantWomanIcon sx={{ fontSize: 16 }} /> },
  { value: 2, label: 'Cesárea', icon: <LocalHospitalIcon sx={{ fontSize: 16 }} /> },
]

const PERSONA_OPTIONS = [
  { value: 1, label: 'Médico' },
  { value: 2, label: 'Personal de enfermería' },
  { value: 3, label: 'Paramédico' },
  { value: 4, label: 'Comadrona' },
  { value: 5, label: 'Empírica' },
  { value: 6, label: 'Ninguna' },
  { value: 9, label: 'Ignorado' },
]

export default function SeccionIII() {
  const { control, watch, setValue } = useFormContext<NacimientoFormValues>()

  // ── Observar campos del formulario ──────────────────────────────────────
  const pesoLbForm    = watch('ninoPesoLibras')
  const pesoOzForm    = watch('ninoPesoOnzas')
  const totalHijos    = watch('ninoTotalHijosMadre')
  const nacidosMuertos = watch('ninoHijosNacidosMuertos')

  // Calcular "viven" automáticamente cuando cambian total o nacidos muertos
  useEffect(() => {
    const total   = totalHijos    ?? 0
    const muertos = nacidosMuertos ?? 0
    const viven   = Math.max(0, total - muertos)
    setValue('ninoHijosViven', viven, { shouldValidate: false })
  }, [totalHijos, nacidosMuertos, setValue])

  // Handlers simples SIN conversión automática
  const handlePesoLbChange = (v: string) => {
    const lb = parseFloat(v)
    setValue('ninoPesoLibras', (v !== '' ? lb : null) as unknown as number, { shouldValidate: true })
  }

  const handlePesoOzChange = (v: string) => {
    const oz = parseFloat(v)
    setValue('ninoPesoOnzas', (v !== '' ? oz : null) as unknown as number, { shouldValidate: true })
  }

  return (
    <SectionCard title="III. Datos del niño (a) y del nacimiento">
      <Grid container spacing={2}>

        {/* ── 6. Fecha ── */}
        <Grid item xs={12} sm={5}>
          <Controller name="ninoFechaNacimiento" control={control} render={({ field, fieldState }) => (
            <DatePicker
              label="6. Fecha de nacimiento *"
              value={field.value ? dayjs(field.value) : null}
              onChange={(d) => field.onChange(d ? d.format('YYYY-MM-DD') : '')}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  size: 'small', fullWidth: true,
                  error: !!fieldState.error,
                  helperText: !field.value ? (fieldState.error?.message ?? 'Seleccione del calendario') : fieldState.error?.message,
                  InputLabelProps: { shrink: true },
                  inputProps: { readOnly: true },
                },
              }}
            />
          )} />
        </Grid>

        {/* ── 7. Hora ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="ninoHoraNacimiento" control={control} render={({ field, fieldState }) => (
            <TimeWheelField
              label="7. Hora de nacimiento"
              value={field.value ?? ''}
              onChange={field.onChange}
              error={!!fieldState.error}
              helperText={!field.value ? (fieldState.error?.message ?? 'Toque para seleccionar') : undefined}
            />
          )} />
        </Grid>

        {/* ── 8. Sexo ── */}
        <Grid item xs={12} sm={3}>
          <Controller name="ninoSexo" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label="8. Sexo *"
              options={SEXO_OPTS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(Number(v))}
              error={!!fieldState.error}
              helperText="Seleccione"
            />
          )} />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* ── 9-11. Medidas ── */}
        <Grid item xs={6} sm={3}>
          <MedicalNumberField
            label="9. Peso *"
            value={pesoLbForm != null ? String(pesoLbForm) : ''}
            onChange={handlePesoLbChange}
            min={0.5} max={15} decimals={1} unit="lb" maxDigits={2}
            helperText={!pesoLbForm ? '0.5–15.0 lb' : undefined}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <MedicalNumberField
            label="Onzas"
            value={pesoOzForm != null ? String(pesoOzForm) : ''}
            onChange={handlePesoOzChange}
            min={0} max={15.9} decimals={1} unit="oz" maxDigits={2}
            helperText={!pesoOzForm ? '0–15.9 oz (opcional)' : undefined}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={6} sm={3}>
          <Controller name="ninoTallaCm" control={control} render={({ field, fieldState }) => (
            <MedicalNumberField
              label="10. Talla *"
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v !== '' ? parseFloat(v) : null)}
              min={20} max={100} decimals={1} unit="cm" maxDigits={3}
              error={!!fieldState.error}
              helperText={!field.value ? (fieldState.error?.message ?? '20–100 cm') : fieldState.error?.message}
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>

        <Grid item xs={6} sm={3}>
          <Controller name="ninoEdadGestacionalSemanas" control={control} render={({ field, fieldState }) => (
            <MedicalNumberField
              label="11. Gestación *"
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => field.onChange(v !== '' ? parseInt(v, 10) : null)}
              min={20} max={45} decimals={0} unit="sem"
              error={!!fieldState.error}
              helperText={!field.value ? (fieldState.error?.message ?? '20–45') : fieldState.error?.message}
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* ── 12. Anomalías ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="ninoAnomaliasCongenitas" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label="12. Anomalías visibles"
              options={ANOMALIAS_OPTS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(Number(v))}
              error={!!fieldState.error}
              helperText="Seleccione"
            />
          )} />
        </Grid>

        {/* ── 13. Tipo de parto ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="ninoTipoParto" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label="13. Tipo de parto"
              options={TIPO_PARTO_OPTS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(Number(v))}
              error={!!fieldState.error}
              helperText="Seleccione"
            />
          )} />
        </Grid>

        {/* ── 14. Hijos nacidos en el parto — SOLO 1 dígito (1–9) ── */}
        <Grid item xs={12} sm={4}>
          <Controller name="ninoNumHijosNacidosParto" control={control} render={({ field, fieldState }) => (
            <MedicalNumberField
              label="14. Hijos en el parto"
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => {
                const num = v !== '' ? parseInt(v, 10) : null
                field.onChange(num)
              }}
              min={1} max={9} decimals={0} maxDigits={1}
              error={!!fieldState.error}
              helperText={!field.value ? '' : undefined}
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* ── 15. Persona que atendió — Select con default Médico ── */}
        <Grid item xs={12} sm={6}>
          <Controller name="ninoPersonaAtendioElParto" control={control} render={({ field, fieldState }) => (
            <FormControl size="small" fullWidth error={!!fieldState.error}>
              <InputLabel shrink={field.value != null}>
                15. Atendió el parto
              </InputLabel>
              <Select
                value={field.value ?? 1}
                label="15. Atendió el parto"
                onChange={(e) => field.onChange(Number(e.target.value))}
                notched={field.value != null}
              >
                {PERSONA_OPTIONS.map((o) => (
                  <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                ))}
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )} />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* ── 16. Hijos de la madre ── */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            16. Hijos(as) de la madre — incluyendo nacidos muertos y el que ahora se registra
          </Typography>
        </Grid>

        {/* Total — editable hasta 2 dígitos */}
        <Grid item xs={4}>
          <Controller name="ninoTotalHijosMadre" control={control} render={({ field, fieldState }) => (
            <MedicalNumberField
              label="Total"
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => {
                const num = v !== '' ? parseInt(v, 10) : null
                field.onChange(num)
              }}
              min={1} max={99} decimals={0} maxDigits={2}
              error={!!fieldState.error}
              helperText={!field.value ? '' : undefined}
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>

        {/* Nacidos muertos — SOLO 1 dígito */}
        <Grid item xs={4}>
          <Controller name="ninoHijosNacidosMuertos" control={control} render={({ field, fieldState }) => (
            <MedicalNumberField
              label="Muertos"
              value={field.value != null ? String(field.value) : ''}
              onChange={(v) => {
                const num = v !== '' ? parseInt(v, 10) : null
                field.onChange(num)
              }}
              min={0} max={9} decimals={0} maxDigits={1}
              error={!!fieldState.error}
              helperText={field.value == null ? 'Nacidos muertos' : undefined}
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>

        {/* Viven — calculado automáticamente: Total − Nacidos muertos */}
        <Grid item xs={4}>
          <Controller name="ninoHijosViven" control={control} render={({ field }) => (
            <MedicalNumberField
              label="Viven"
              value={field.value != null ? String(field.value) : '0'}
              onChange={() => {}}
              min={0} max={99} decimals={0} maxDigits={2}
              disabled
              helperText="Calculado: Total − Muertos"
              InputLabelProps={{ shrink: true }}
            />
          )} />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
