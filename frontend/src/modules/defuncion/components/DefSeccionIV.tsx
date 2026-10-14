import { useFormContext } from 'react-hook-form'
import {
  Grid, TextField, Typography, Box, Paper, Divider,
} from '@mui/material'
import SectionCard from '@/shared/components/common/SectionCard'
import CausaCie11Field from './CausaCie11Field'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

function CausaRow({
  label,
  fieldCausa,
  fieldCodigo,
  fieldIntervalo,
  showDebido = true,
}: {
  label: string
  fieldCausa: keyof DefuncionFormValues
  fieldCodigo: keyof DefuncionFormValues
  fieldIntervalo: keyof DefuncionFormValues
  showDebido?: boolean
}) {
  const { register } = useFormContext<DefuncionFormValues>()
  return (
    <Box mb={1.5}>
      <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
      <Box display="flex" gap={1} alignItems="flex-start" mt={0.5} flexWrap="wrap">
        <CausaCie11Field
          fieldCausa={fieldCausa}
          fieldCodigo={fieldCodigo}
          placeholder={showDebido ? 'Causa...' : 'Enfermedad / estado patológico...'}
          sx={{ flex: 3, minWidth: 200 }}
        />
        <TextField
          {...register(fieldIntervalo)}
          label="Intervalo aprox."
          placeholder="Ej: 2 días"
          InputLabelProps={{ shrink: true }}
          sx={{ flex: 1, minWidth: 120 }}
        />
      </Box>
      {showDebido && (
        <Typography variant="caption" color="text.disabled" sx={{ ml: 0.5 }}>
          debido a (o como consecuencia de) ↓
        </Typography>
      )}
    </Box>
  )
}

export default function DefSeccionIV() {
  return (
    <SectionCard title="IV. Causa de defunción" variant="defuncion">
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          <strong>18. Causas de defunción</strong> — al escribir se sugieren diagnósticos de la CIE-11;
          seleccione uno para registrar su código.
        </Typography>
      </Box>

      {/* Parte I */}
      <Paper
        elevation={0}
        sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, mb: 2 }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={1} color="primary.main">
          I. Enfermedad o estado patológico que produjo la muerte directamente*
        </Typography>
        <Box sx={{ borderLeft: 3, borderColor: 'primary.light', pl: 2 }}>
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5} fontWeight={600}>
            Causas antecedentes — Estados morbosos que produjeron la causa consignada arriba,
            mencionándose en el último lugar la causa básica
          </Typography>
          <Grid container spacing={1.5}>
            <Grid item xs={12}>
              <CausaRow
                label="(a) Causa directa de muerte"
                fieldCausa="causaIa"
                fieldCodigo="causaIaCie11"
                fieldIntervalo="causaIaIntervalo"
                showDebido={true}
              />
            </Grid>
            <Grid item xs={12}>
              <CausaRow
                label="(b)"
                fieldCausa="causaIb"
                fieldCodigo="causaIbCie11"
                fieldIntervalo="causaIbIntervalo"
                showDebido={true}
              />
            </Grid>
            <Grid item xs={12}>
              <CausaRow
                label="(c)"
                fieldCausa="causaIc"
                fieldCodigo="causaIcCie11"
                fieldIntervalo="causaIcIntervalo"
                showDebido={true}
              />
            </Grid>
            <Grid item xs={12}>
              <CausaRow
                label="(d) Causa básica"
                fieldCausa="causaId"
                fieldCodigo="causaIdCie11"
                fieldIntervalo="causaIdIntervalo"
                showDebido={false}
              />
            </Grid>
          </Grid>
        </Box>
        <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
          * No quiere decirse con esto la manera o modo de morir, por ejemplo: debilidad cardiaca, astenia,
          etc. Significa propiamente la enfermedad, traumatismo o complicación que causó la muerte.
        </Typography>
      </Paper>

      <Divider sx={{ my: 2 }} />

      {/* Parte II */}
      <Paper
        elevation={0}
        sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}
      >
        <Typography variant="subtitle2" fontWeight={700} mb={1} color="secondary.main">
          II. Otros estados patológicos significativos que contribuyeron a la muerte, pero no
          relacionados con la enfermedad o estado morboso que la produjo
        </Typography>
        <CausaCie11Field
          fieldCausa="causaIi"
          fieldCodigo="causaIiCie11"
          placeholder="Otro estado patológico significativo..."
        />
      </Paper>
    </SectionCard>
  )
}
