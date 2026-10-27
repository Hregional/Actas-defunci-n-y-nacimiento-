import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material'
import type { TipoDocumento } from '@/shared/hooks/useDocumentoInfo'
import { PAISES_PASAPORTE } from '@/shared/hooks/useDocumentoInfo'

interface Props {
  tipo: TipoDocumento
  onTipoChange: (tipo: TipoDocumento) => void
  paisPasaporte?: string
  onPaisChange?: (pais: string) => void
  disabled?: boolean
}

/**
 * Selector de tipo de documento de identificación.
 * Cuando tipo=PASAPORTE muestra un segundo Select para elegir el país emisor.
 */
export default function DocumentoSelector({
  tipo,
  onTipoChange,
  paisPasaporte,
  onPaisChange,
  disabled = false,
}: Props) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
      <FormControl size="small" sx={{ minWidth: 220 }} disabled={disabled}>
        <InputLabel>Tipo de documento</InputLabel>
        <Select
          value={tipo}
          label="Tipo de documento"
          onChange={(e) => onTipoChange(e.target.value as TipoDocumento)}
        >
          <MenuItem value="DPI_GT">🇬🇹 DPI / CUI (Guatemala)</MenuItem>
          <MenuItem value="INE_MX">🇲🇽 Credencial INE (México)</MenuItem>
          <MenuItem value="PASAPORTE">🛂 Pasaporte</MenuItem>
          <MenuItem value="OTRO">📄 Otro documento</MenuItem>
        </Select>
      </FormControl>

      {tipo === 'PASAPORTE' && (
        <FormControl size="small" sx={{ minWidth: 180 }} disabled={disabled}>
          <InputLabel>País emisor</InputLabel>
          <Select
            value={paisPasaporte ?? ''}
            label="País emisor"
            onChange={(e) => onPaisChange?.(e.target.value)}
          >
            {PAISES_PASAPORTE.map(p => (
              <MenuItem key={p.code} value={p.code}>{p.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  )
}
