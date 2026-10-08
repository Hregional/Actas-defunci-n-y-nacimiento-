import { forwardRef } from 'react'
import { TextField, InputAdornment, type TextFieldProps } from '@mui/material'
import ErrorIcon from '@mui/icons-material/Error'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { cuiMensajeError } from '@/shared/utils/cuiValidator'

interface DpiFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string
  onChange: (val: string) => void
  /** Cuando true, el campo queda solo lectura (no editable) */
  readOnly?: boolean
}

/**
 * Campo DPI/CUI con validación real usando el algoritmo oficial de Guatemala.
 * - Solo acepta dígitos (bloquea letras, símbolos, espacios)
 * - Máximo 13 dígitos, no permite escribir más
 * - Valida formato, departamento, municipio y dígito verificador
 * - Muestra mensaje descriptivo del error específico
 */
const DpiField = forwardRef<HTMLDivElement, DpiFieldProps>(
  ({ value, onChange, label = 'DPI / CUI', disabled, readOnly = false, ...props }, ref) => {
    const raw     = (value ?? '').replace(/\s/g, '')
    const isEmpty = raw.length === 0
    const errorMsg = cuiMensajeError(raw)
    const isError  = !isEmpty && errorMsg !== null && !readOnly
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
      readOnly
        ? (props.helperText ?? 'Del buscador FHIR — no editable')
        // Si viene error externo del schema Zod, ese tiene prioridad
        : (props.error && props.helperText)
          ? props.helperText
          : props.helperText ??
            (isError
              ? errorMsg
              : isValid
              ? 'DPI válido'
              : '13 dígitos — sin letras ni espacios')

    // ── Ícono de validación propio (solo cuando no hay adorno externo) ──────────
    // Si el padre ya pasó un endAdornment (ej: buscador FHIR con lupa), lo usamos
    // tal cual. Si no, mostramos el ícono de éxito/error interno.
    const externalEndAdornment = props.InputProps?.endAdornment

    const ownEndAdornment = externalEndAdornment
      ? externalEndAdornment
      : readOnly
      ? (
          <InputAdornment position="end">
            <LockOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
          </InputAdornment>
        )
      : !isEmpty
      ? (
          <InputAdornment position="end">
            {isValid
              ? <CheckCircleIcon color="success" fontSize="small" />
              : <ErrorIcon color="error" fontSize="small" />
            }
          </InputAdornment>
        )
      : undefined

    // Fusionar onKeyDown: primero el nuestro (bloquea no-dígitos), luego el externo
    const externalKeyDown = props.onKeyDown as React.KeyboardEventHandler<HTMLInputElement> | undefined
    const mergedKeyDown = readOnly
      ? externalKeyDown
      : (e: React.KeyboardEvent<HTMLInputElement>) => {
          handleKeyDown(e)
          if (!e.defaultPrevented) externalKeyDown?.(e)
        }

    return (
      <TextField
        ref={ref}
        fullWidth
        size="small"
        {...props}
        label={label}
        value={value ?? ''}
        onChange={readOnly ? undefined : handleChange}
        onKeyDown={mergedKeyDown}
        disabled={disabled}
        error={isError || !!props.error}
        inputProps={{
          maxLength: 13,
          inputMode: readOnly ? undefined : 'numeric',
          pattern: readOnly ? undefined : '[0-9]*',
          autoComplete: 'off',
          readOnly,
        }}
        helperText={helperText}
        FormHelperTextProps={{
          sx: {
            color: readOnly
              ? 'text.disabled'
              : isError
              ? 'error.main'
              : isValid
              ? 'success.main'
              : 'text.secondary',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            ...(readOnly && {
              bgcolor: 'action.hover',
              cursor: 'default',
            }),
            '& fieldset': {
              borderColor: readOnly
                ? undefined
                : isError
                ? 'error.main'
                : isValid
                ? 'success.light'
                : undefined,
              borderWidth: !readOnly && (isError || isValid) ? '1.5px' : undefined,
            },
          },
          ...props.sx,
        }}
        InputProps={{
          // Fusionar con cualquier InputProps que venga del padre
          ...props.InputProps,
          endAdornment: ownEndAdornment,
        }}
      />
    )
  }
)

DpiField.displayName = 'DpiField'
export default DpiField
