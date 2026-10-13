import { useState, useEffect } from 'react'
import {
  IconButton,
  CircularProgress,
  Alert,
  Box,
  Tooltip,
  InputAdornment,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import CloudIcon from '@mui/icons-material/Cloud'
import BadgeIcon from '@mui/icons-material/Badge'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import DpiField from '@/shared/components/common/DpiField'
import { useFhirPatient } from '@/shared/hooks/useFhirPatient'
import { cuiValido } from '@/shared/utils/cuiValidator'
import type { PersonaFhirDTO } from '@/shared/api/fhir.api'

interface BuscadorPacienteFhirProps {
  label?: string
  /** Se llama cuando se encuentra un paciente. Incluye el modo usado para que
   *  la sección pueda decidir si el DPI debe quedar bloqueado (cui) o editable (hc). */
  onPacienteEncontrado: (paciente: PersonaFhirDTO, modo: ModoBusqueda) => void
  onLimpiar?: () => void
  disabled?: boolean
  /** Cuando true, oculta el botón de búsqueda por CUI/DPI y fuerza el modo Historia Clínica.
   *  Usar cuando el tipo de documento no es DPI guatemalteco. */
  ocultarModoDpi?: boolean
}

type ModoBusqueda = 'cui' | 'hc'
export type { ModoBusqueda }

/**
 * Buscador de pacientes en el servidor FHIR/RENAP.
 *
 * Modos de búsqueda:
 *  - CUI/DPI   → validación completa del algoritmo guatemalteco (13 dígitos + checksum)
 *  - No. Historia Clínica → número numérico (ID interno del paciente en FHIR)
 */
export default function BuscadorPacienteFhir({
  label,
  onPacienteEncontrado,
  onLimpiar,
  disabled = false,
  ocultarModoDpi = false,
}: BuscadorPacienteFhirProps) {
  const [modo, setModo] = useState<ModoBusqueda>(ocultarModoDpi ? 'hc' : 'cui')
  const [cuiBusqueda, setCuiBusqueda] = useState('')
  const [hcBusqueda, setHcBusqueda] = useState('')

  const { buscando, error, paciente, buscarPorCui, buscarPorFhirId, limpiar } = useFhirPatient()

  // CUI válido: 13 dígitos + checksum guatemalteco
  const cuiEsValido = cuiBusqueda.length === 13 && cuiValido(cuiBusqueda)
  // No. HC válido: al menos 1 dígito numérico
  const hcEsValido = /^\d+$/.test(hcBusqueda) && hcBusqueda.length > 0

  const puedeB = modo === 'cui' ? cuiEsValido : hcEsValido

  const handleBuscar = async () => {
    if (!puedeB) return
    const resultado = modo === 'cui'
      ? await buscarPorCui(cuiBusqueda)
      : await buscarPorFhirId(hcBusqueda)
    if (resultado) onPacienteEncontrado(resultado, modo)
  }

  const handleLimpiar = () => {
    setCuiBusqueda('')
    setHcBusqueda('')
    limpiar()
    onLimpiar?.()
  }

  // Si ocultarModoDpi cambia a true mientras el modo era 'cui', forzar modo HC y limpiar
  useEffect(() => {
    if (ocultarModoDpi && modo === 'cui') {
      setModo('hc')
      setCuiBusqueda('')
      setHcBusqueda('')
      limpiar()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocultarModoDpi])

  const handleCambiarModo = (_: React.MouseEvent, nuevoModo: ModoBusqueda | null) => {
    if (!nuevoModo) return
    setModo(nuevoModo)
    handleLimpiar()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && puedeB && !buscando) handleBuscar()
  }

  // Adornment de acciones (compartido entre los dos modos)
  const hayValor = cuiBusqueda.length > 0 || hcBusqueda.length > 0
  const accionesAdornment = (
    <InputAdornment position="end">
      {buscando ? (
        <CircularProgress size={20} />
      ) : hayValor ? (
        <Box display="flex" gap={0.5}>
          <Tooltip title="Limpiar">
            <IconButton onClick={handleLimpiar} size="small" disabled={disabled}>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={puedeB ? 'Buscar en RENAP' : 'Complete el campo correctamente'}>
            <span>
              <IconButton
                onClick={handleBuscar}
                color="primary"
                size="small"
                disabled={disabled || !puedeB}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ) : (
        <Tooltip title="Complete el campo para buscar">
          <span>
            <IconButton size="small" color="primary" disabled>
              <SearchIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      )}
    </InputAdornment>
  )

  return (
    <Box>
      {/* ── Selector de modo ─────────────────────────────────── */}
      <ToggleButtonGroup
        value={modo}
        exclusive
        onChange={handleCambiarModo}
        size="small"
        disabled={disabled || buscando}
        sx={{ mb: 1 }}
      >
        {!ocultarModoDpi && (
          <ToggleButton value="cui" sx={{ gap: 0.5, px: 1.5, fontSize: '0.75rem', textTransform: 'none' }}>
            <BadgeIcon fontSize="small" />
            CUI / DPI
          </ToggleButton>
        )}
        <ToggleButton value="hc" sx={{ gap: 0.5, px: 1.5, fontSize: '0.75rem', textTransform: 'none' }}>
          <MedicalInformationIcon fontSize="small" />
          No. Historia Clínica
        </ToggleButton>
      </ToggleButtonGroup>

      {/* ── Campo según modo ─────────────────────────────────── */}
      {modo === 'cui' ? (
        // DpiField: validación completa CUI guatemalteco
        <DpiField
          label={label ?? 'Buscar por CUI / DPI'}
          value={cuiBusqueda}
          onChange={setCuiBusqueda}
          onKeyDown={handleKeyDown}
          disabled={disabled || buscando}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CloudIcon color="primary" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: accionesAdornment,
          }}
          // Cuando es válido, sobreescribir el helper para indicar que puede buscar
          helperText={cuiEsValido ? 'CUI válido — presione Enter o buscar' : undefined}
        />
      ) : (
        // No. Historia Clínica: solo números
        <TextField
          fullWidth
          size="small"
          label={label ?? 'Buscar por No. Historia Clínica'}
          value={hcBusqueda}
          onChange={(e) => setHcBusqueda(e.target.value.replace(/\D/g, ''))}
          onKeyDown={handleKeyDown}
          disabled={disabled || buscando}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', autoComplete: 'off' }}
          helperText={
            hcEsValido
              ? 'Número válido — presione Enter o buscar'
              : 'Ingrese el número de historia clínica (solo dígitos)'
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CloudIcon color="primary" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: accionesAdornment,
          }}
          InputLabelProps={{ shrink: true }}
        />
      )}

      {/* ── Resultado exitoso ────────────────────────────────── */}
      {paciente && (
        <Alert severity="success" sx={{ mt: 1 }} icon={<CloudIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <span>Encontrado:</span>
            <strong>{paciente.nombreCompleto}</strong>
            <Chip label="RENAP · FHIR" size="small" color="success" variant="outlined" />
          </Box>
        </Alert>
      )}

      {/* ── Error ───────────────────────────────────────────── */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
    </Box>
  )
}
