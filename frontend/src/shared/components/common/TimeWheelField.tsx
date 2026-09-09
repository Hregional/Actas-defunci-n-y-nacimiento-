/**
 * TimeWheelField — selector de hora tipo rueda (drum picker)
 *
 * - Muestra horas 00-23 y minutos 00-59 en columnas desplazables
 * - Funciona igual en móvil (touch) y desktop (mouse wheel / click)
 * - El scroll interno NO escapa al documento (overscroll-behavior: contain)
 * - Se activa al hacer clic en el campo (tipo popover)
 * - Guarda el valor como string "HH:mm"
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Box, Popover, Typography,
  InputAdornment, TextField, useTheme, alpha,
} from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ITEM_H   = 44   // altura de cada item en px
const VISIBLE  = 5    // items visibles (el central es el seleccionado)
const DRUM_H   = ITEM_H * VISIBLE

interface DrumColumnProps {
  items: string[]
  selected: string
  onSelect: (v: string) => void
  label: string
}

function DrumColumn({ items, selected, onSelect, label }: DrumColumnProps) {
  const theme   = useTheme()
  const listRef = useRef<HTMLDivElement>(null)
  const idx     = items.indexOf(selected)
  const current = idx === -1 ? 0 : idx

  // Centrar el item seleccionado al montar o cambiar
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTo({ top: current * ITEM_H, behavior: 'smooth' })
  }, [current])

  // Al terminar el scroll, snap al item más cercano
  const handleScroll = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const nearest = Math.round(el.scrollTop / ITEM_H)
    const clamped = Math.max(0, Math.min(items.length - 1, nearest))
    if (items[clamped] !== selected) {
      onSelect(items[clamped])
    }
  }, [items, selected, onSelect])

  // Debounce scroll snap
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onScroll = () => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(handleScroll, 120)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
      {/* Etiqueta */}
      <Typography
        variant="overline"
        sx={{ color: 'text.secondary', letterSpacing: 2, mb: 0.5, fontSize: '0.65rem' }}
      >
        {label}
      </Typography>

      {/* Contenedor del drum */}
      <Box sx={{ position: 'relative', width: '100%', height: DRUM_H }}>
        {/* Resaltado del item central */}
        <Box
          sx={{
            position: 'absolute',
            top: ITEM_H * 2,
            left: 4,
            right: 4,
            height: ITEM_H,
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.25 : 0.12),
            border: `1.5px solid ${alpha(theme.palette.primary.main, 0.35)}`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Gradiente superior */}
        <Box
          sx={{
            position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H * 2,
            background: `linear-gradient(to bottom, ${theme.palette.background.paper} 20%, transparent)`,
            pointerEvents: 'none', zIndex: 2,
          }}
        />
        {/* Gradiente inferior */}
        <Box
          sx={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H * 2,
            background: `linear-gradient(to top, ${theme.palette.background.paper} 20%, transparent)`,
            pointerEvents: 'none', zIndex: 2,
          }}
        />

        {/* Lista desplazable */}
        <Box
          ref={listRef}
          onScroll={onScroll}
          sx={{
            height: DRUM_H,
            overflowY: 'scroll',
            overscrollBehavior: 'contain',
            scrollSnapType: 'y mandatory',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            // padding top/bottom para que el primer y último item puedan centrarse
            pt: `${ITEM_H * 2}px`,
            pb: `${ITEM_H * 2}px`,
          }}
        >
          {items.map((item) => (
            <Box
              key={item}
              onClick={() => {
                onSelect(item)
                const el = listRef.current
                const i  = items.indexOf(item)
                if (el) el.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
              }}
              sx={{
                height: ITEM_H,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                scrollSnapAlign: 'center',
                cursor: 'pointer',
                userSelect: 'none',
                position: 'relative',
                zIndex: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: item === selected ? 700 : 400,
                  fontSize: item === selected ? '1.6rem' : '1.1rem',
                  color: item === selected ? 'primary.main' : 'text.secondary',
                  transition: 'all 0.15s ease',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

interface TimeWheelFieldProps {
  label?: string
  value: string          // "HH:mm" o ""
  onChange: (v: string) => void
  error?: boolean
  helperText?: string
  required?: boolean
}

const HOURS   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

export default function TimeWheelField({
  label = 'Hora',
  value,
  onChange,
  error,
  helperText,
}: TimeWheelFieldProps) {
  const theme    = useTheme()
  const anchorEl = useRef<HTMLDivElement>(null)
  const [open, setOpen]   = useState(false)
  const [hh, setHh]       = useState(value ? value.split(':')[0] : '00')
  const [mm, setMm]       = useState(value ? value.split(':')[1] : '00')

  // Sincronizar si value cambia externamente
  useEffect(() => {
    if (value && /^\d{2}:\d{2}$/.test(value)) {
      setHh(value.split(':')[0])
      setMm(value.split(':')[1])
    }
  }, [value])

  const handleOpen = () => {
    if (value && /^\d{2}:\d{2}$/.test(value)) {
      setHh(value.split(':')[0])
      setMm(value.split(':')[1])
    }
    // Quitar el foco del input antes de abrir el popover
    // para evitar el warning aria-hidden en lectores de pantalla
    ;(document.activeElement as HTMLElement)?.blur()
    setOpen(true)
  }

  const handleConfirm = () => {
    onChange(`${hh}:${mm}`)
    setOpen(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const displayValue = value && /^\d{2}:\d{2}$/.test(value) ? value : ''

  return (
    <>
      <Box ref={anchorEl}>
        <TextField
          label={label}
          value={displayValue}
          onClick={handleOpen}
          inputProps={{ readOnly: true, style: { cursor: 'pointer' } }}
          error={error}
          helperText={helperText}
          placeholder="--:--"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccessTimeIcon
                  fontSize="small"
                  sx={{ color: error ? 'error.main' : 'text.secondary' }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiInputBase-root': { cursor: 'pointer' },
          }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl.current}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        disableRestoreFocus
        PaperProps={{
          elevation: 8,
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 200,
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 2, py: 1.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AccessTimeIcon fontSize="small" />
          <Typography variant="subtitle2" fontWeight={700}>
            Seleccionar hora
          </Typography>
        </Box>

        {/* Drums */}
        <Box sx={{ px: 2, pt: 1, pb: 0, bgcolor: 'background.paper' }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
            <DrumColumn items={HOURS}   selected={hh} onSelect={setHh} label="HORA" />

            {/* Separador ":" */}
            <Box sx={{ display: 'flex', alignItems: 'center', height: DRUM_H, pt: '28px' }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: 'primary.main',
                  lineHeight: 1,
                  mx: 0.5,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                :
              </Typography>
            </Box>

            <DrumColumn items={MINUTES} selected={mm} onSelect={setMm} label="MIN" />
          </Box>

          {/* Preview de la hora seleccionada */}
          <Box
            sx={{
              textAlign: 'center',
              py: 0.5,
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Vista previa: <strong style={{ color: theme.palette.primary.main }}>{hh}:{mm}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Botón confirmar */}
        <Box sx={{ p: 1.5, pt: 0.5, bgcolor: 'background.paper' }}>
          <Box
            component="button"
            onClick={handleConfirm}
            sx={{
              width: '100%',
              py: 1,
              px: 2,
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'opacity 0.15s',
              '&:hover': { opacity: 0.9 },
              '&:active': { opacity: 0.8 },
            }}
          >
            <CheckCircleIcon fontSize="small" />
            Confirmar {hh}:{mm}
          </Box>
        </Box>
      </Popover>
    </>
  )
}
