import { forwardRef } from 'react'
import { TextField, InputAdornment, type TextFieldProps } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'

export type FieldType =
  | 'text'
  | 'onlyLetters'
  | 'onlyNumbers'
  | 'hour'
  | 'decimal'
  | 'alphanumeric'

interface SmartFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string
  onChange: (val: string) => void
  fieldType?: FieldType
  required?: boolean
  maxLen?: number
}

function cleanValue(value: string, type: FieldType): string {
  switch (type) {
    case 'onlyLetters':
      return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, '')
    case 'onlyNumbers':
      return value.replace(/\D/g, '')
    case 'decimal':
      return value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
    case 'hour':
      return value.replace(/[^0-9:]/g, '').slice(0, 5)
    case 'alphanumeric':
      return value.replace(/[^a-zA-Z0-9]/g, '')
    default:
      return value
  }
}

function getErrorMessage(
  value: string,
  type: FieldType,
  required: boolean,
  maxLen: number
): string | null {
  if (required && value.trim() === '') return 'Este campo es requerido'
  if (value === '') return null

  switch (type) {
    case 'onlyLetters':
      if (/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(value))
        return 'Solo se permiten letras y espacios'
      break
    case 'onlyNumbers':
      if (/\D/.test(value))
        return 'Solo se permiten números'
      break
    case 'decimal':
      if (isNaN(Number(value)))
        return 'Ingrese un número válido (use punto para decimales)'
      break
    case 'hour': {
      const hourRx = /^([01]\d|2[0-3]):([0-5]\d)$/
      if (!hourRx.test(value))
        return 'Formato inválido — use HH:mm en 24h (ej: 14:30)'
      break
    }
    case 'alphanumeric':
      if (/[^a-zA-Z0-9]/.test(value))
        return 'Solo letras y números, sin espacios ni símbolos'
      break
  }

  if (maxLen > 0 && value.length > maxLen)
    return `Máximo ${maxLen} caracteres permitidos`

  return null
}

/**
 * Campo con validación en tiempo real.
 *
 * Para campos tipo 'decimal': el maxLen aplica sobre los DÍGITOS solamente,
 * no sobre el string completo. El punto decimal nunca ocupa cupo del límite.
 * Ejemplo: maxLen=4 permite "15.9" (3 dígitos) y "6.50" (3 dígitos).
 */
const SmartField = forwardRef<HTMLDivElement, SmartFieldProps>(
  ({
    value,
    onChange,
    fieldType = 'text',
    required = false,
    maxLen = 0,
    label,
    disabled,
    ...props
  }, ref) => {
    const val      = value ?? ''
    const errorMsg = getErrorMessage(val, fieldType, required, maxLen)
    const hasValue = val.length > 0
    const isError  = hasValue && !!errorMsg

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value
      raw = cleanValue(raw, fieldType)

      if (maxLen > 0) {
        if (fieldType === 'decimal') {
          // El límite aplica sobre los dígitos únicamente, no sobre el string completo.
          const digits = raw.replace('.', '')
          if (digits.length > maxLen) {
            const hadDot = raw.includes('.')
            const dotPos = raw.indexOf('.')
            const trimmed = digits.slice(0, maxLen)
            raw = hadDot && dotPos <= trimmed.length
              ? trimmed.slice(0, dotPos) + '.' + trimmed.slice(dotPos)
              : trimmed
          }
        } else {
          raw = raw.slice(0, maxLen)
        }
      }

      onChange(raw)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const controlKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End',
      ]
      const isCtrlCmd = e.ctrlKey || e.metaKey
      if (isCtrlCmd || controlKeys.includes(e.key)) return

      // Decimal: el punto siempre permitido (solo uno), límite aplica sobre dígitos
      if (fieldType === 'decimal') {
        if (e.key === '.') {
          if (val.includes('.') || val.length === 0) e.preventDefault()
          return
        }
        if (!/^\d$/.test(e.key)) { e.preventDefault(); return }
        if (maxLen > 0 && val.replace('.', '').length >= maxLen) e.preventDefault()
        return
      }

      // Otros tipos: límite sobre longitud total
      if (maxLen > 0 && val.length >= maxLen) {
        e.preventDefault()
        return
      }

      switch (fieldType) {
        case 'onlyLetters':
          if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(e.key)) e.preventDefault()
          break
        case 'onlyNumbers':
          if (!/^\d$/.test(e.key)) e.preventDefault()
          break
        case 'alphanumeric':
          if (!/[a-zA-Z0-9]/.test(e.key)) e.preventDefault()
          break
      }
    }

    return (
      <TextField
        ref={ref}
        {...props}
        label={label}
        value={val}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        error={isError || !!props.error}
        helperText={props.helperText ?? (isError ? errorMsg : undefined)}
        InputLabelProps={{
          shrink: true,  // Label siempre flotante arriba
          ...props.InputLabelProps,
        }}
        inputProps={{
          maxLength: maxLen > 0 ? maxLen : undefined,
          autoComplete: 'off',
          ...props.inputProps,
        }}
        FormHelperTextProps={{
          sx: { color: isError ? 'error.main' : 'text.secondary' },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: isError ? 'error.main' : undefined,
              borderWidth: isError ? '1.5px' : undefined,
            },
            '&:hover fieldset': {
              borderColor: isError ? 'error.main' : undefined,
            },
          },
          ...props.sx,
        }}
        InputProps={{
          endAdornment: isError ? (
            <InputAdornment position="end">
              <ErrorIcon color="error" fontSize="small" />
            </InputAdornment>
          ) : undefined,
          ...props.InputProps,
        }}
      />
    )
  }
)

SmartField.displayName = 'SmartField'
export default SmartField
