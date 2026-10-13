import { useMemo } from 'react'
import {
  Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material'
import { ESTADOS_MEXICO_MUN } from '@/shared/data/mexico'

interface Props {
  /** Valor del estado seleccionado */
  deptoValue: string
  /** Valor del municipio seleccionado */
  muniValue: string
  /** Callback cuando cambia el estado */
  onDeptoChange: (estado: string) => void
  /** Callback cuando cambia el municipio */
  onMuniChange: (muni: string) => void
  /** Mensaje de error para estado */
  deptoError?: string
  /** Mensaje de error para municipio */
  muniError?: string
  /** Tamaños de grid (por defecto mitad cada uno) */
  deptoGrid?: { xs?: number; sm?: number }
  muniGrid?: { xs?: number; sm?: number }
  /** Labels personalizados */
  deptoLabel?: string
  muniLabel?: string
  /** Si es requerido */
  required?: boolean
}

/**
 * Selector encadenado de Estado → Municipio de México.
 * Al cambiar el estado, el municipio se resetea automáticamente.
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
  muniLabel = 'Municipio',
  required = false,
}: Props) {
  const municipios = useMemo(() => {
    if (!deptoValue) return []
    return ESTADOS_MEXICO_MUN[deptoValue] || []
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
            {Object.keys(ESTADOS_MEXICO_MUN).map(estado => (
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
            {municipios.map(m => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
          {muniError && <FormHelperText>{muniError}</FormHelperText>}
        </FormControl>
      </Grid>
    </>
  )
}
