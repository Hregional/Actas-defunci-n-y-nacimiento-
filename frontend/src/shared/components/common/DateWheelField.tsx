/**
 * DateWheelField — selector de fecha tipo calendario emergente
 *
 * - Solo muestra un ícono de calendario (sin input de texto)
 * - Se abre al hacer clic en el ícono
 * - Funciona igual que TimeWheelField pero para fechas
 */
import { useState, useRef } from 'react'
import {
  Box, Popover, TextField, useTheme,
} from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/es'

interface DateWheelFieldProps {
  label?: string
  value: string          // "YYYY-MM-DD" o ""
  onChange: (v: string) => void
  error?: boolean
  helperText?: string
  required?: boolean
}

export default function DateWheelField({
  label = 'Fecha',
  value,
  onChange,
  error,
  helperText,
  required,
}: DateWheelFieldProps) {
  const theme = useTheme()
  const anchorEl = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    // Quitar el foco del input antes de abrir el popover
    ;(document.activeElement as HTMLElement)?.blur()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      onChange(newDate.format('YYYY-MM-DD'))
      setOpen(false)
    }
  }

  // Formatear fecha para mostrar (dd/mm/aaaa)
  const displayValue = value && dayjs(value).isValid() 
    ? dayjs(value).format('DD/MM/YYYY')
    : ''

  return (
    <>
      <Box ref={anchorEl}>
        <TextField
          label={label + (required ? ' *' : '')}
          value={displayValue}
          onClick={handleOpen}
          size="small"
          fullWidth
          inputProps={{ 
            readOnly: true,
            style: { cursor: 'pointer' }
          }}
          error={error}
          helperText={helperText}
          placeholder="dd/mm/aaaa"
          InputProps={{
            startAdornment: (
              <CalendarTodayIcon
                fontSize="small"
                sx={{ 
                  color: error ? 'error.main' : 'text.secondary',
                  mr: 1,
                  cursor: 'pointer'
                }}
              />
            ),
          }}
          sx={{
            '& .MuiInputBase-root': { cursor: 'pointer' },
          }}
          InputLabelProps={{ shrink: true }}
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
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DateCalendar
            value={value && dayjs(value).isValid() ? dayjs(value) : null}
            onChange={handleDateChange}
            sx={{
              '& .MuiPickersDay-root': {
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
      </Popover>
    </>
  )
}
