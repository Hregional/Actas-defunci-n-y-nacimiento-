/**
 * CardOptionGroup — selector de opciones tipo tarjeta táctil
 *
 * - Tarjetas grandes fáciles de tocar en móvil
 * - Soporta color personalizado por opción (ej: azul para Hombre, rosa para Mujer)
 * - helperText solo se muestra cuando NO hay valor seleccionado (no tapa nada)
 * - Accesible: role="button", aria-pressed, navegable con teclado
 */
import { Box, Typography, FormHelperText, alpha, useTheme } from '@mui/material'
import type { ReactNode } from 'react'

export interface CardOption {
  value: number | string
  label: string
  icon?: ReactNode
  description?: string
  /** Color hex o nombre CSS para personalizar el borde/resaltado de esta opción */
  color?: string
}

interface CardOptionGroupProps {
  label: string
  options: CardOption[]
  value: number | string | null | undefined
  onChange: (v: number | string) => void
  error?: boolean
  helperText?: string
  direction?: 'row' | 'col'
  size?: 'sm' | 'md' | 'lg'
}

export default function CardOptionGroup({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  direction = 'row',
  size = 'md',
}: CardOptionGroupProps) {
  const theme  = useTheme()
  const isDark = theme.palette.mode === 'dark'
  const hasVal = value !== null && value !== undefined && value !== ''

  const padMap = { sm: '8px 10px', md: '11px 14px', lg: '14px 18px' }
  const pad    = padMap[size]

  return (
    <Box>
      {/* Label — siempre visible, se achica y colorea cuando hay valor */}
      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mb: 0.75,
          fontSize: hasVal ? '0.7rem' : '0.82rem',
          color: error
            ? 'error.main'
            : hasVal
              ? 'primary.main'
              : 'text.secondary',
          fontWeight: hasVal ? 600 : 400,
          transition: 'all 0.15s ease',
        }}
      >
        {label}
      </Typography>

      {/* Tarjetas */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: direction === 'col' ? 'column' : 'row',
          flexWrap: direction === 'row' ? 'wrap' : 'nowrap',
          gap: 1,
        }}
      >
        {options.map((opt) => {
          const selected     = value === opt.value
          // Color activo: usa el color personalizado de la opción, o el primario del tema
          const activeColor  = opt.color ?? theme.palette.primary.main
          const borderColor  = selected
            ? activeColor
            : error
              ? theme.palette.error.main
              : isDark ? '#2D4159' : '#C8D6E8'
          const bgColor = selected
            ? alpha(activeColor, isDark ? 0.22 : 0.10)
            : isDark
              ? alpha('#1D2D40', 0.6)
              : alpha('#FFFFFF', 0.7)

          return (
            <Box
              key={opt.value}
              role="button"
              tabIndex={0}
              aria-pressed={selected}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onChange(opt.value)}
              sx={{
                padding: pad,
                borderRadius: 2,
                border: '1.5px solid',
                borderColor,
                bgcolor: bgColor,
                cursor: 'pointer',
                userSelect: 'none',
                flex: direction === 'row' ? '1 1 auto' : undefined,
                minWidth: direction === 'row' ? '72px' : undefined,
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                transition: 'all 0.15s ease',
                boxShadow: selected
                  ? `0 0 0 3px ${alpha(activeColor, 0.20)}`
                  : 'none',
                '&:hover': {
                  borderColor: activeColor,
                  bgcolor: alpha(activeColor, isDark ? 0.15 : 0.06),
                },
                '&:focus-visible': {
                  outline: `2px solid ${activeColor}`,
                  outlineOffset: 2,
                },
              }}
            >
              {opt.icon && (
                <Box
                  sx={{
                    color: selected ? activeColor : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: size === 'sm' ? '1rem' : '1.2rem',
                    transition: 'color 0.15s',
                  }}
                >
                  {opt.icon}
                </Box>
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: selected ? 700 : 500,
                    color: selected ? activeColor : 'text.primary',
                    fontSize: size === 'sm' ? '0.78rem' : '0.875rem',
                    lineHeight: 1.2,
                    whiteSpace: direction === 'row' ? 'nowrap' : 'normal',
                    transition: 'color 0.15s',
                  }}
                >
                  {opt.label}
                </Typography>
                {opt.description && !selected && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '0.68rem', lineHeight: 1.2, display: 'block' }}
                  >
                    {opt.description}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        })}
      </Box>

      {/* helperText solo si NO hay valor (no tapa lo seleccionado) */}
      {!hasVal && helperText && (
        <FormHelperText error={error} sx={{ mx: '2px', mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
      {/* Siempre muestra error si hay */}
      {hasVal && error && helperText && (
        <FormHelperText error sx={{ mx: '2px', mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  )
}
