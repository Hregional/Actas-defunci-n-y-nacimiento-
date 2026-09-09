import { Chip } from '@mui/material'
import type { EstadoInforme } from '@/shared/types/api.types'

const config: Record<EstadoInforme, { label: string; color: 'default' | 'warning' | 'success' | 'primary' }> = {
  BORRADOR:   { label: 'Borrador',   color: 'warning' },
  COMPLETADO: { label: 'Completado', color: 'success' },
  ENVIADO:    { label: 'Enviado',    color: 'primary' },
}

export default function EstadoChip({ estado }: { estado: string }) {
  const cfg = config[estado as EstadoInforme] ?? { label: estado, color: 'default' }
  return <Chip label={cfg.label} color={cfg.color} size="small" />
}
