import { useMemo } from 'react'
import {
  Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText,
} from '@mui/material'
import { DEPARTAMENTOS_GUATEMALA } from '@/shared/data/guatemala'

interface Props {
  /** Valor del departamento seleccionado */
  deptoValue: string
  /** Valor del municipio seleccionado */
  muniValue: string
  /** Callback cuando cambia el departamento */
  onDeptoChange: (depto: string) => void
  /** Callback cuando cambia el municipio */
  onMuniChange: (muni: string) => void
  /** Mensaje de error para departamento */
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
 * Selector encadenado de Departamento → Municipio de Guatemala.
 * Al cambiar el departamento, el municipio se resetea automáticamente.
 * Reutilizable en cualquier sección del formulario.
 */
export default function DeptoMuniSelector({
  deptoValue,
  muniValue,
  onDeptoChange,
  onMuniChange,
  deptoError,
  muniError,
  deptoGrid = { xs: 12, sm: 6 },
  muniGrid  = { xs: 12, sm: 6 },
  deptoLabel = 'Departamento',
  muniLabel  = 'Municipio',
  required   = false,
}: Props) {
  const municipios = useMemo(() => {
    if (!deptoValue) return []
    const found = DEPARTAMENTOS_GUATEMALA.find(d => d.title === deptoValue)
    return found ? found.mun : []
  }, [deptoValue])

  const handleDeptoChange = (value: string) => {
    onDeptoChange(value)
    onMuniChange('') // resetear municipio al cambiar departamento
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
            <MenuItem value=""><em>Seleccionar departamento</em></MenuItem>
            {DEPARTAMENTOS_GUATEMALA.map(d => (
              <MenuItem key={d.title} value={d.title}>{d.title}</MenuItem>
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
            <MenuItem value="">
              <em>{deptoValue ? 'Seleccionar municipio' : 'Primero seleccione un departamento'}</em>
            </MenuItem>
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
