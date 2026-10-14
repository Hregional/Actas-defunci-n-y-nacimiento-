/**
 * Tema HRO — Sistema de Informes
 *
 * Modo oscuro: Vision UI — azul marino profundo, gradientes eléctricos, glassmorphism.
 * Modo claro:  Derivación limpia del mismo lenguaje visual con fondos slate claros.
 */
import { createTheme, alpha } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

// ── Paleta Vision UI ──────────────────────────────────────────────────────────
// Primario: azul eléctrico / cian
const CYAN_DARK = '#0B8FAC'
const CYAN_MAIN = '#0BC5EA'
const CYAN_LIGHT = '#76E4F7'

// Acento: violeta/índigo para gradientes
const VIOLET_DARK = '#3A0CA3'
const VIOLET_MAIN = '#4361EE'
const VIOLET_LIGHT = '#7B93FF'

// Fondos modo oscuro — Vision UI signature
const DARK_BG_BODY = '#0B1437'   // fondo raíz — azul marino muy profundo
const DARK_BG_CARD = '#111C44'   // cards y panels
const DARK_BG_ELEVATED = '#1B254B'   // superficies elevadas, sidebar

// Fondos modo claro — derivados limpios
const LIGHT_BG_BODY = '#F4F7FE'   // fondo raíz — slate muy frío
const LIGHT_BG_CARD = '#FFFFFF'   // cards blancas
const LIGHT_BG_SUBTLE = '#E9EDF7'   // superficies alternadas

// Gradientes reutilizables
export const GRAD_CYAN = 'linear-gradient(127deg, #0BC5EA 0%, #4361EE 100%)'
export const GRAD_VIOLET = 'linear-gradient(127deg, #4361EE 0%, #7B2FBE 100%)'
export const GRAD_GREEN = 'linear-gradient(127deg, #01B574 0%, #0BC5EA 100%)'
export const GRAD_ORANGE = 'linear-gradient(127deg, #FF6B35 0%, #F7C59F 100%)'
export const GRAD_PINK = 'linear-gradient(127deg, #E040FB 0%, #7B2FBE 100%)'

// ── Fábrica del tema ──────────────────────────────────────────────────────────
export function buildTheme(mode: PaletteMode) {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: CYAN_MAIN,
        dark: CYAN_DARK,
        light: CYAN_LIGHT,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: VIOLET_MAIN,
        dark: VIOLET_DARK,
        light: VIOLET_LIGHT,
        contrastText: '#FFFFFF',
      },
      success: { main: '#01B574', light: '#4FD1A5', dark: '#008A55' },
      warning: { main: '#FFB547', light: '#FFD180', dark: '#E08000' },
      error: { main: '#E53E3E', light: '#FC8181', dark: '#9B2C2C' },
      info: { main: CYAN_MAIN, light: CYAN_LIGHT, dark: CYAN_DARK },

      background: {
        default: isLight ? LIGHT_BG_BODY : DARK_BG_BODY,
        paper: isLight ? LIGHT_BG_CARD : DARK_BG_CARD,
      },

      text: isLight
        ? { primary: '#111827', secondary: '#4B5563', disabled: '#9CA3AF' }
        : { primary: '#FFFFFF', secondary: '#A3AED0', disabled: '#4A5568' },

      divider: isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06),

      action: {
        hover: alpha(CYAN_MAIN, isLight ? 0.07 : 0.10),
        selected: alpha(CYAN_MAIN, isLight ? 0.12 : 0.18),
        disabledBackground: isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.05),
      },
    },

    // ── Tipografía ───────────────────────────────────────────────────────────
    typography: {
      fontFamily: '"DM Sans", "Inter", "Roboto", sans-serif',
      h1: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontSize: '1.25rem', fontWeight: 700 },
      h4: { fontSize: '1.125rem', fontWeight: 700 },
      h5: { fontSize: '1rem', fontWeight: 700 },
      h6: { fontSize: '0.938rem', fontWeight: 700 },
      body1: { fontSize: '0.875rem', lineHeight: 1.6 },
      body2: { fontSize: '0.813rem', lineHeight: 1.5 },
      caption: { fontSize: '0.75rem', lineHeight: 1.4 },
      overline: { fontSize: '0.688rem', letterSpacing: '0.10em', fontWeight: 700 },
      subtitle1: { fontWeight: 700 },
      subtitle2: { fontWeight: 700 },
    },

    shape: { borderRadius: 16 },

    breakpoints: {
      values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    },

    shadows: [
      'none',
      isLight
        ? '0 1px 4px rgba(27,37,75,0.06)'
        : '0 1px 4px rgba(0,0,0,0.35)',
      isLight
        ? '0 2px 8px rgba(11,197,234,0.10)'
        : '0 2px 12px rgba(0,0,0,0.45)',
      isLight
        ? '0 4px 16px rgba(11,197,234,0.12)'
        : '0 4px 20px rgba(0,0,0,0.55)',
      isLight ? '0 6px 20px rgba(11,197,234,0.14)' : '0 8px 26px rgba(0,0,0,0.60)',
      isLight ? '0 8px 28px rgba(11,197,234,0.16)' : '0 12px 32px rgba(0,0,0,0.65)',
      ...Array(19).fill(
        isLight
          ? '0 12px 36px rgba(11,197,234,0.18)'
          : '0 14px 40px rgba(0,0,0,0.70)',
      ),
    ] as ReturnType<typeof createTheme>['shadows'],

    // ── Overrides ────────────────────────────────────────────────────────────
    components: {

      // ── Button ──
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 12,
            padding: '8px 20px',
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
            transition: 'all 0.20s ease',
          },
          contained: {
            background: GRAD_CYAN,
            boxShadow: `0 4px 14px ${alpha(CYAN_MAIN, 0.40)}`,
            '&:hover': {
              background: GRAD_CYAN,
              boxShadow: `0 6px 20px ${alpha(CYAN_MAIN, 0.55)}`,
              transform: 'translateY(-1px)',
            },
          },
          outlined: {
            borderWidth: '1.5px',
            borderColor: isLight ? CYAN_MAIN : alpha(CYAN_MAIN, 0.60),
            color: CYAN_MAIN,
            '&:hover': {
              borderWidth: '1.5px',
              backgroundColor: alpha(CYAN_MAIN, 0.08),
            },
          },
          sizeLarge: { padding: '11px 28px', fontSize: '0.938rem' },
          sizeSmall: { padding: '5px 14px', fontSize: '0.8rem' },
        },
      },

      // ── TextField ──
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              backgroundColor: isLight
                ? '#FFFFFF'
                : alpha(DARK_BG_ELEVATED, 0.70),
              backdropFilter: isLight ? 'none' : 'blur(6px)',
              fontSize: '0.875rem',
              '& fieldset': {
                borderColor: isLight ? '#D1D5DB' : alpha('#FFFFFF', 0.08),
                borderWidth: '1.5px',
              },
              '&:hover fieldset': { borderColor: CYAN_MAIN },
              '&.Mui-focused fieldset': {
                borderColor: CYAN_MAIN,
                borderWidth: '2px',
                boxShadow: `0 0 0 3px ${alpha(CYAN_MAIN, 0.15)}`,
              },
            },
            '& .MuiInputLabel-root': { fontSize: '0.85rem', color: isLight ? '#374151' : undefined },
            '& .MuiInputBase-input': {
              padding: '8px 12px',
              fontSize: 'max(16px, 0.875rem)',
              color: isLight ? '#111827' : undefined,
            },
          },
        },
      },

      // ── FormControl / Select ──
      MuiFormControl: {
        defaultProps: { size: 'small', fullWidth: true },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isLight
              ? '#FFFFFF'
              : alpha(DARK_BG_ELEVATED, 0.70),
            backdropFilter: isLight ? 'none' : 'blur(6px)',
            color: isLight ? '#111827' : undefined,
            '& fieldset': {
              borderColor: isLight ? '#D1D5DB' : alpha('#FFFFFF', 0.08),
              borderWidth: '1.5px',
            },
            '&:hover fieldset': { borderColor: CYAN_MAIN },
            '&.Mui-focused fieldset': {
              borderColor: CYAN_MAIN,
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${alpha(CYAN_MAIN, 0.15)}`,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: { fontSize: 'max(16px, 0.875rem)', padding: '8px 12px' },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: '0.85rem', color: isLight ? '#374151' : undefined },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            borderRadius: 8,
            mx: 0.5,
            '&.Mui-selected': {
              backgroundColor: alpha(CYAN_MAIN, 0.15),
              '&:hover': { backgroundColor: alpha(CYAN_MAIN, 0.22) },
            },
          },
        },
      },

      // ── Card ──
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: 'none',
            backgroundColor: isLight ? LIGHT_BG_CARD : DARK_BG_CARD,
            border: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06)}`,
            boxShadow: isLight
              ? '0 4px 20px rgba(27,37,75,0.06)'
              : '0 4px 24px rgba(0,0,0,0.35)',
            backdropFilter: isLight ? 'none' : 'blur(10px)',
          },
        },
      },

      // ── Paper ──
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? LIGHT_BG_CARD : DARK_BG_CARD,
          },
          elevation1: {
            boxShadow: isLight
              ? '0 2px 10px rgba(27,37,75,0.06)'
              : '0 2px 12px rgba(0,0,0,0.40)',
          },
          elevation2: {
            boxShadow: isLight
              ? '0 4px 16px rgba(27,37,75,0.08)'
              : '0 4px 20px rgba(0,0,0,0.50)',
          },
          elevation3: {
            boxShadow: isLight
              ? '0 6px 22px rgba(11,197,234,0.10)'
              : '0 6px 28px rgba(0,0,0,0.55)',
          },
          elevation8: {
            boxShadow: isLight
              ? '0 8px 30px rgba(11,197,234,0.14)'
              : '0 10px 36px rgba(0,0,0,0.65)',
          },
        },
      },

      // ── AppBar ──
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight
              ? alpha(LIGHT_BG_CARD, 0.85)
              : alpha(DARK_BG_CARD, 0.80),
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06)}`,
            boxShadow: 'none',
          },
        },
      },

      // ── Drawer (Sidebar) ──
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: isLight ? LIGHT_BG_CARD : DARK_BG_ELEVATED,
            borderRight: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06)}`,
            backdropFilter: isLight ? 'none' : 'blur(20px)',
          },
        },
      },

      // ── Chip ──
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 700, fontSize: '0.72rem' },
          sizeSmall: { height: 22 },
          colorPrimary: {
            background: alpha(CYAN_MAIN, isLight ? 0.12 : 0.20),
            color: isLight ? CYAN_DARK : CYAN_LIGHT,
          },
        },
      },

      // ── Table ──
      MuiTableCell: {
        styleOverrides: {
          root: { padding: '10px 14px', fontSize: '0.85rem' },
          head: {
            fontWeight: 700,
            backgroundColor: isLight ? LIGHT_BG_SUBTLE : DARK_BG_ELEVATED,
            color: isLight ? '#707EAE' : '#A3AED0',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: alpha(CYAN_MAIN, 0.05) },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },

      // ── Stepper ──
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontSize: '0.75rem',
            '&.Mui-active': { fontWeight: 700, color: CYAN_MAIN },
            '&.Mui-completed': { color: '#01B574' },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            '&.Mui-active': { color: CYAN_MAIN },
            '&.Mui-completed': { color: '#01B574' },
          },
        },
      },

      // ── LinearProgress ──
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            height: 6,
            backgroundColor: alpha(CYAN_MAIN, 0.12),
          },
          bar: {
            borderRadius: 6,
            background: GRAD_CYAN,
          },
        },
      },

      // ── Alert ──
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 12, fontSize: '0.85rem' },
          standardInfo: {
            backgroundColor: isLight ? alpha(CYAN_MAIN, 0.10) : alpha(CYAN_MAIN, 0.15),
            color: isLight ? CYAN_DARK : CYAN_LIGHT,
          },
          standardSuccess: {
            backgroundColor: isLight ? alpha('#01B574', 0.10) : alpha('#01B574', 0.15),
          },
          standardWarning: {
            backgroundColor: isLight ? alpha('#FFB547', 0.10) : alpha('#FFB547', 0.15),
          },
          standardError: {
            backgroundColor: isLight ? alpha('#E53E3E', 0.10) : alpha('#E53E3E', 0.15),
          },
        },
      },

      // ── Dialog ──
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
            border: `1px solid ${isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.08)}`,
            backgroundColor: isLight ? LIGHT_BG_CARD : DARK_BG_ELEVATED,
            backdropFilter: 'blur(20px)',
          },
        },
      },

      // ── Tooltip ──
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            borderRadius: 8,
            backgroundColor: isLight ? '#1B254B' : alpha(DARK_BG_ELEVATED, 0.97),
            border: `1px solid ${isLight ? 'transparent' : alpha('#FFFFFF', 0.08)}`,
          },
          arrow: {
            color: isLight ? '#1B254B' : alpha(DARK_BG_ELEVATED, 0.97),
          },
        },
      },

      // ── Divider ──
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? '#E9EDF7' : alpha('#FFFFFF', 0.06) },
        },
      },

      // ── Radio / Checkbox ──
      MuiRadio: {
        styleOverrides: {
          root: {
            color: isLight ? '#B0BBD5' : '#4A5568',
            '&.Mui-checked': { color: CYAN_MAIN },
            padding: '4px 6px',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isLight ? '#B0BBD5' : '#4A5568',
            '&.Mui-checked': { color: CYAN_MAIN },
          },
        },
      },

      // ── FormLabel ──
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.82rem',
            color: isLight ? '#374151' : '#A3AED0',
            '&.Mui-focused': { color: CYAN_MAIN },
          },
        },
      },

      // ── CssBaseline ──
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? LIGHT_BG_BODY : DARK_BG_BODY,
            scrollbarWidth: 'thin',
            scrollbarColor: isLight
              ? `${alpha(CYAN_MAIN, 0.25)} transparent`
              : `${alpha(CYAN_MAIN, 0.18)} transparent`,
          },
          '*::-webkit-scrollbar': { width: '5px', height: '5px' },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: isLight ? alpha(CYAN_MAIN, 0.22) : alpha(CYAN_MAIN, 0.18),
            borderRadius: '3px',
            '&:hover': {
              background: isLight ? alpha(CYAN_MAIN, 0.40) : alpha(CYAN_MAIN, 0.32),
            },
          },
        },
      },
    },
  })
}

export default buildTheme('light')
