import { useMemo } from 'react'
import {
  Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material'
import { ESTADOS_MEXICO_MUN } from '@/shared/data/mexico'

interface Props {
  deptoValue: string
  muniValue: string
  onDeptoChange: (estado: string) => void
  onMuniChange: (muni: string) => void
  deptoError?: string
  muniError?: string
  deptoGrid?: { xs?: number; sm?: number }
  muniGrid?: { xs?: number; sm?: number }
  deptoLabel?: string
  muniLabel?: string
  required?: boolean
}

const ESTADOS = Object.keys(ESTADOS_MEXICO_MUN).sort()

/**
 * Selector encadenado de Estado → Municipio/Alcaldía de México.
 * Usa ESTADOS_MEXICO_MUN (Record<estado, municipios[]>).
 * Interfaz idéntica a DeptoMuniSelector para intercambio directo.
 */
export default function DeptoMuniMexSelector({
  deptoValue,
  muniValue,
  onDeptoChange,
  onMuniChange,
  deptoError,
  muniError,
  deptoGrid = { xs: 12, sm: 6 },
  muniGrid = { xs: 12, sm: 6 },
  deptoLabel = 'Estado',
  muniLabel = 'Municipio/Alcaldía',
  required = false,
}: Props) {
  const municipios = useMemo(() => {
    if (!deptoValue) return []
    return ESTADOS_MEXICO_MUN[deptoValue] ?? []
  }, [deptoValue])

  const handleDeptoChange = (value: string) => {
    onDeptoChange(value)
    onMuniChange('') // resetear municipio al cambiar estado
  }

  return (
    <>
      <Grid item {...deptoGrid}>
        <FormControl fullWidth size="small" error={!!deptoError}>
          <InputLabel>{deptoLabel}{required ? ' *' : ''}</InputLabel>
          <Select
            value={deptoValue}
            label={`${deptoLabel}${required ? ' *' : ''}`}
            onChange={(e) => handleDeptoChange(e.target.value)}
          >
            {ESTADOS.map((estado) => (
              <MenuItem key={estado} value={estado}>{estado}</MenuItem>
            ))}
          </Select>
          {deptoError && <FormHelperText>{deptoError}</FormHelperText>}
        </FormControl>
      </Grid>

      <Grid item {...muniGrid}>
        <FormControl fullWidth size="small" error={!!muniError} disabled={!deptoValue}>
          <InputLabel>{muniLabel}{required ? ' *' : ''}</InputLabel>
          <Select
            value={muniValue}
            label={`${muniLabel}${required ? ' *' : ''}`}
            onChange={(e) => onMuniChange(e.target.value)}
          >
            {municipios.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
          {muniError && <FormHelperText>{muniError}</FormHelperText>}
        </FormControl>
      </Grid>
    </>
  )
}
