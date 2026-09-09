import { forwardRef } from 'react'
import { TextField, InputAdornment, type TextFieldProps } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { cuiMensajeError } from '@/shared/utils/cuiValidator'

interface DpiFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string
  onChange: (val: string) => void
}

/**
 * Campo DPI/CUI con validación real usando el algoritmo oficial de Guatemala.
 * - Solo acepta dígitos (bloquea letras, símbolos, espacios)
 * - Máximo 13 dígitos, no permite escribir más
 * - Valida formato, departamento, municipio y dígito verificador
 * - Muestra mensaje descriptivo del error específico
 */
const DpiField = forwardRef<HTMLDivElement, DpiFieldProps>(
  ({ value, onChange, label = 'DPI / CUI', disabled, ...props }, ref) => {
    const raw     = (value ?? '').replace(/\s/g, '')
    const isEmpty = raw.length === 0
    const errorMsg = cuiMensajeError(raw)
    const isError  = !isEmpty && errorMsg !== null
    const isValid  = !isEmpty && errorMsg === null

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleaned = e.target.value.replace(/\D/g, '').slice(0, 13)
      onChange(cleaned)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const controlKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'Home', 'End',
      ]
      const isCtrlCmd = e.ctrlKey || e.metaKey
      if (isCtrlCmd || controlKeys.includes(e.key)) return

      // Bloquear no dígitos
      if (!/^\d$/.test(e.key)) {
        e.preventDefault()
        return
      }

      // Bloquear si ya tiene 13 dígitos
      if (raw.length >= 13) {
        e.preventDefault()
      }
    }

    const helperText =
      // Si viene error externo del schema Zod, ese tiene prioridad
      (props.error && props.helperText)
        ? props.helperText
        : props.helperText ??
          (isError
            ? errorMsg
            : isValid
            ? 'DPI válido'
            : '13 dígitos — sin letras ni espacios')

    return (
      <TextField
        ref={ref}
        {...props}
        label={label}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        error={isError || !!props.error}
        inputProps={{
          maxLength: 13,
          inputMode: 'numeric',
          pattern: '[0-9]*',
          autoComplete: 'off',
        }}
        helperText={helperText}
        FormHelperTextProps={{
          sx: {
            color: isError
              ? 'error.main'
              : isValid
              ? 'success.main'
              : 'text.secondary',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: isError
                ? 'error.main'
                : isValid
                ? 'success.light'
                : undefined,
              borderWidth: isError || isValid ? '1.5px' : undefined,
            },
          },
          ...props.sx,
        }}
        InputProps={{
          endAdornment: !isEmpty ? (
            <InputAdornment position="end">
              {isValid
                ? <CheckCircleIcon color="success" fontSize="small" />
                : <ErrorIcon color="error" fontSize="small" />
              }
            </InputAdornment>
          ) : undefined,
        }}
      />
    )
  }
)

DpiField.displayName = 'DpiField'
export default DpiField
