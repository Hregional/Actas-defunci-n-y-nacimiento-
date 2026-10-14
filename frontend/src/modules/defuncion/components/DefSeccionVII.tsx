import { useFormContext, Controller } from 'react-hook-form'
import { Grid, Typography } from '@mui/material'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew'
import CancelIcon from '@mui/icons-material/Cancel'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BusinessIcon from '@mui/icons-material/Business'
import HomeIcon from '@mui/icons-material/Home'
import PublicIcon from '@mui/icons-material/Public'
import WorkIcon from '@mui/icons-material/Work'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SectionCard from '@/shared/components/common/SectionCard'
import CardOptionGroup from '@/shared/components/common/CardOptionGroup'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

const NECROPSIA_OPTIONS = [
  { value: 1, label: 'Sí', icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: '#4CAF50' },
  { value: 2, label: 'No', icon: <CancelIcon sx={{ fontSize: 20 }} />, color: '#F44336' },
]

const ASISTENCIA_OPTIONS = [
  { value: 1, label: 'Médica', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: '#1976D2' },
  { value: 2, label: 'Paramédica', icon: <MedicalServicesIcon sx={{ fontSize: 20 }} />, color: '#0288D1' },
  { value: 3, label: 'Comadrona', icon: <PregnantWomanIcon sx={{ fontSize: 20 }} />, color: '#7B1FA2' },
  { value: 4, label: 'Empírica', icon: <AccessibilityNewIcon sx={{ fontSize: 20 }} />, color: '#F57C00' },
  { value: 5, label: 'Ninguna', icon: <CancelIcon sx={{ fontSize: 18 }} />, color: '#757575' },
  { value: 9, label: 'Ignorado', icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, color: '#9E9E9E' },
]

const LUGAR_DEFUNCION_OPTIONS = [
  { value: 1, label: 'Hospital Público', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: '#1976D2' },
  { value: 2, label: 'Hospital Privado', icon: <BusinessIcon sx={{ fontSize: 20 }} />, color: '#0288D1' },
  { value: 3, label: 'Servicios de salud pública', icon: <MedicalServicesIcon sx={{ fontSize: 20 }} />, color: '#00796B' },
  { value: 4, label: 'IGSS', icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />, color: '#388E3C' },
  { value: 5, label: 'Vía Pública', icon: <PublicIcon sx={{ fontSize: 20 }} />, color: '#F57C00' },
  { value: 6, label: 'Domicilio', icon: <HomeIcon sx={{ fontSize: 20 }} />, color: '#7B1FA2' },
  { value: 7, label: 'Lugar de trabajo', icon: <WorkIcon sx={{ fontSize: 20 }} />, color: '#5D4037' },
  { value: 8, label: 'Otro', icon: <LocationOnIcon sx={{ fontSize: 20 }} />, color: '#616161' },
  { value: 9, label: 'Ignorado', icon: <HelpOutlineIcon sx={{ fontSize: 18 }} />, color: '#9E9E9E' },
]

export default function DefSeccionVII() {
  const { control } = useFormContext<DefuncionFormValues>()

  return (
    <SectionCard title="VII. Otros datos de la defunción" variant="defuncion">
      <Grid container spacing={2}>
        {/* Necropsia */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            39. ¿Hubo necropsia? *
          </Typography>
          <Controller name="otrosHuboNecropsia" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={NECROPSIA_OPTIONS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(v !== null ? Number(v) : undefined)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Indique si se realizó necropsia'}
              direction="row"
              size="md"
            />
          )} />
        </Grid>

        {/* Clase de asistencia */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            40. Clase de asistencia recibida *
          </Typography>
          <Controller name="otrosClaseAsistencia" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={ASISTENCIA_OPTIONS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(v !== null ? Number(v) : undefined)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Tipo de atención que recibió el fallecido'}
              direction="row"
              size="md"
            />
          )} />
        </Grid>

        {/* Lugar de defunción */}
        <Grid item xs={12}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={1}>
            41. Lugar donde ocurrió la defunción *
          </Typography>
          <Controller name="otrosLugarDefuncion" control={control} render={({ field, fieldState }) => (
            <CardOptionGroup
              label=""
              options={LUGAR_DEFUNCION_OPTIONS}
              value={field.value ?? null}
              onChange={(v) => field.onChange(v !== null ? Number(v) : undefined)}
              error={!!fieldState.error}
              helperText={fieldState.error?.message ?? 'Lugar físico donde ocurrió la defunción'}
              direction="row"
              size="md"
            />
          )} />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
