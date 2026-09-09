import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Grid, Alert, Box, Typography, Chip,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import SectionCard from '@/shared/components/common/SectionCard'
import { INSTITUCION } from '@/shared/constants/institucion'
import type { NacimientoFormValues } from '../schemas/nacimiento.schema'

const LUGAR_LABELS: Record<number, string> = {
  1: 'Hospital público',
  2: 'Hospital privado',
  3: 'Centro de salud',
  4: 'Seguro social',
  5: 'Vía pública',
  6: 'Domicilio',
  7: 'Otro',
  9: 'Ignorado',
}

export default function SeccionII() {
  const { setValue } = useFormContext<NacimientoFormValues>()

  // Precargar valores estáticos al montar
  useEffect(() => {
    setValue('lugarDepartamento', INSTITUCION.DEPARTAMENTO)
    setValue('lugarMunicipio',    INSTITUCION.MUNICIPIO)
    setValue('lugarDireccion',    INSTITUCION.DIRECCION)
    setValue('lugarOcurrioNacimiento', INSTITUCION.LUGAR_NACIMIENTO)
  }, [setValue])

  return (
    <SectionCard title="II. Datos del lugar de nacimiento">
      <Alert
        severity="info"
        icon={<LockIcon fontSize="small" />}
        sx={{ mb: 2, py: 0.5 }}
      >
        <Typography variant="caption">
          Los datos del lugar son fijos para esta institución.
        </Typography>
      </Alert>

      <Grid container spacing={1.5}>
        {/* Departamento — solo lectura */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              1. Departamento
            </Typography>
            <Box
              sx={{
                border: '1.5px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 1,
                bgcolor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {INSTITUCION.DEPARTAMENTO}
              </Typography>
              <Chip label="Fijo" size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem' }} />
            </Box>
          </Box>
        </Grid>

        {/* Municipio — solo lectura */}
        <Grid item xs={12} sm={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              2. Municipio
            </Typography>
            <Box
              sx={{
                border: '1.5px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 1,
                bgcolor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {INSTITUCION.MUNICIPIO}
              </Typography>
              <Chip label="Fijo" size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem' }} />
            </Box>
          </Box>
        </Grid>

        {/* Dirección — solo lectura */}
        <Grid item xs={12}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              3. Dirección
              <Typography component="span" variant="caption" color="text.disabled">
                {' '}(Además del nombre indique si es ciudad, pueblo, aldea, caserío o finca)
              </Typography>
            </Typography>
            <Box
              sx={{
                border: '1.5px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 1,
                bgcolor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {INSTITUCION.DIRECCION}
              </Typography>
              <Chip label="Fijo" size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem', flexShrink: 0 }} />
            </Box>
          </Box>
        </Grid>

        {/* Lugar donde ocurrió el nacimiento — solo lectura */}
        <Grid item xs={12}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
              4. Lugar donde ocurrió el nacimiento
            </Typography>
            <Box
              sx={{
                border: '1.5px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 1.5,
                py: 1,
                bgcolor: 'grey.50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant="body2" color="text.primary" fontWeight={500}>
                {INSTITUCION.LUGAR_NACIMIENTO}. {LUGAR_LABELS[INSTITUCION.LUGAR_NACIMIENTO]}
              </Typography>
              <Chip label="Fijo" size="small" sx={{ ml: 'auto', height: 18, fontSize: '0.65rem' }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  )
}
