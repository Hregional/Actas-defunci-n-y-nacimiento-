/**
 * MedicalNumberField — campo numérico clínico bajo estándar HL7 FHIR
 *
 * Características:
 * - Solo permite dígitos y un punto decimal
 * - Limita decimales a 1 o 2 según el campo (FHIR Quantity)
 * - Valida rangos clínicos en tiempo real (min/max)
 * - Teclado numérico en móvil (inputMode="decimal")
 * - Muestra unidad como adornment (lb, oz, cm, sem…)
 * - Sin flechas spinner (type="text" en lugar de "number")
 */
import { useRef } from 'react'
import {
  TextField, InputAdornment, Tooltip,
  type TextFieldProps,
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export interface MedicalNumberFieldProps
  extends Omit<TextFieldProps, 'onChange' | 'value' | 'type'> {
  value: string
  onChange: (val: string) => void
  /** Mínimo permitido según rango clínico */
  min?: number
  /** Máximo permitido según rango clínico */
  max?: number
  /** Número máximo de decimales (0, 1 o 2). Default: 1 */
  decimals?: 0 | 1 | 2
  /** Unidad a mostrar a la derecha (lb, oz, cm, sem) */
  unit?: string
  /** Rango clínico descriptivo para el tooltip (ej: "0.5 – 15.0 lb") */
  rangeHint?: string
  /** Número máximo de dígitos enteros permitidos. Default: 5 */
  maxDigits?: number
}

export default function MedicalNumberField({
  value,
  onChange,
  min,
  max,
  decimals = 1,
  unit,
  rangeHint,
  label,
  error: externalError,
  helperText,
  disabled,
  maxDigits = 5,
  ...rest
}: MedicalNumberFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // ── Validación en tiempo real ────────────────────────────────────────────
  const getError = (): string | null => {
    if (!value || value === '' || value === '.') return null
    const num = parseFloat(value)
    if (isNaN(num)) return 'Valor inválido'
    if (min !== undefined && num < min) return `Mínimo: ${min}${unit ? ' ' + unit : ''}`
    if (max !== undefined && num > max) return `Máximo: ${max}${unit ? ' ' + unit : ''}`
    return null
  }

  const internalError = getError()
  const hasError = externalError || !!internalError
  const displayHelper = helperText ?? internalError ?? (rangeHint ? `Rango: ${rangeHint}` : undefined)

  // ── Filtro de teclado ────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ctrl = e.ctrlKey || e.metaKey
    const nav  = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','Home','End']
    if (ctrl || nav.includes(e.key)) return

    // Solo dígitos
    if (/^\d$/.test(e.key)) {
      // Bloquear si agregar este dígito superaría el max
      if (max !== undefined) {
        const tentative = parseFloat((value ?? '') + e.key)
        if (!isNaN(tentative) && tentative > max) {
          e.preventDefault()
          return
        }
      }
      // Bloquear si ya se alcanzó el maxDigits en la parte entera
      const intPart = (value ?? '').split('.')[0]
      if (intPart.length >= maxDigits && !(value ?? '').includes('.')) {
        e.preventDefault()
        return
      }
      return
    }

    // Punto decimal — solo uno, y solo si decimals > 0
    if (e.key === '.') {
      if (decimals === 0 || value.includes('.')) {
        e.preventDefault()
      }
      return
    }

    // Todo lo demás bloqueado
    e.preventDefault()
  }

  // ── Procesamiento del cambio ─────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value

    // Eliminar cualquier caracter que no sea dígito o punto
    raw = raw.replace(/[^\d.]/g, '')

    // Solo un punto
    const parts = raw.split('.')
    if (parts.length > 2) {
      raw = parts[0] + '.' + parts.slice(1).join('')
    }

    // Limitar decimales
    if (parts.length === 2 && parts[1].length > decimals) {
      raw = parts[0] + '.' + parts[1].slice(0, decimals)
    }

    // Limitar dígitos enteros según maxDigits
    if (parts[0].length > maxDigits) {
      raw = parts[0].slice(0, maxDigits) + (parts.length === 2 ? '.' + parts[1] : '')
    }

    onChange(raw)
  }

  // ── Pegado: limpiar el texto pegado ─────────────────────────────────────
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/[^\d.]/g, '')
    onChange(pasted)
  }

  return (
    <Tooltip
      title={rangeHint ? `Rango clínico HL7 FHIR: ${rangeHint}` : ''}
      placement="top"
      arrow
      disableHoverListener={!rangeHint}
    >
      <TextField
        {...rest}
        inputRef={inputRef}
        label={label}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={disabled}
        error={hasError}
        helperText={displayHelper}
        inputProps={{
          inputMode: 'decimal',   // teclado numérico con punto en móvil
          autoComplete: 'off',
          autoCorrect: 'off',
          spellCheck: false,
          ...rest.inputProps,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {hasError ? (
                <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />
              ) : unit ? (
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  opacity: 0.55,
                  letterSpacing: '0.03em',
                  whiteSpace: 'nowrap',
                }}>
                  {unit}
                </span>
              ) : null}
            </InputAdornment>
          ),
        }}
      />
    </Tooltip>
  )
}
