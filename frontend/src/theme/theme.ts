/**
 * Tema HRO — Sistema de Informes
 *
 * Paleta teal-índigo con modo claro y oscuro.
 * Modo claro:  fondo slate azulado suave, no blanco puro.
 * Modo oscuro: fondo azul-marino profundo, no negro puro.
 *
 * La función buildTheme acepta 'light' | 'dark' para que main.tsx
 * pueda elegir según la preferencia del sistema operativo.
 */
import { createTheme, alpha } from '@mui/material/styles'
import type { PaletteMode } from '@mui/material'

// ── Paleta base ───────────────────────────────────────────────────────────────
const TEAL_DARK  = '#0D7377'   // primario oscuro
const TEAL_MAIN  = '#14A0A6'   // primario principal
const TEAL_LIGHT = '#5ECDD1'   // primario claro

const INDIGO_DARK  = '#283593'
const INDIGO_MAIN  = '#3F51B5'
const INDIGO_LIGHT = '#7986CB'

// Modo claro
const LIGHT_BG_DEFAULT = '#EEF2F7'   // slate azulado suave
const LIGHT_BG_PAPER   = '#F8FAFD'   // casi blanco con tinte frío
const LIGHT_BG_SUBTLE  = '#E3EAF3'   // superficies alternadas

// Modo oscuro
const DARK_BG_DEFAULT  = '#0F1923'   // azul marino muy oscuro
const DARK_BG_PAPER    = '#162130'   // panels y cards
const DARK_BG_ELEVATED = '#1D2D40'   // elementos elevados

// ── Fábrica del tema ──────────────────────────────────────────────────────────
export function buildTheme(mode: PaletteMode) {
  const isLight = mode === 'light'

  return createTheme({
    palette: {
      mode,
      primary: {
        main:         TEAL_MAIN,
        dark:         TEAL_DARK,
        light:        TEAL_LIGHT,
        contrastText: '#FFFFFF',
      },
      secondary: {
        main:         INDIGO_MAIN,
        dark:         INDIGO_DARK,
        light:        INDIGO_LIGHT,
        contrastText: '#FFFFFF',
      },
      success:  { main: '#2E7D32', light: '#66BB6A', dark: '#1B5E20' },
      warning:  { main: '#F57C00', light: '#FFB74D', dark: '#E65100' },
      error:    { main: '#C62828', light: '#EF5350', dark: '#8E0000' },
      info:     { main: TEAL_MAIN, light: TEAL_LIGHT, dark: TEAL_DARK },

      background: {
        default: isLight ? LIGHT_BG_DEFAULT : DARK_BG_DEFAULT,
        paper:   isLight ? LIGHT_BG_PAPER   : DARK_BG_PAPER,
      },

      text: isLight
        ? { primary: '#1A2340', secondary: '#4A5A72', disabled: '#9BAABB' }
        : { primary: '#E8EDF5', secondary: '#9BAABB', disabled: '#4A5A72' },

      divider: isLight ? '#CBD5E8' : '#243347',

      action: {
        hover:           alpha(TEAL_MAIN, isLight ? 0.06 : 0.12),
        selected:        alpha(TEAL_MAIN, isLight ? 0.10 : 0.20),
        disabledBackground: isLight ? '#E0E7EF' : '#243347',
      },
    },

    // ── Tipografía ───────────────────────────────────────────────────────────
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      h1: { fontSize: '1.875rem', fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontSize: '1.5rem',   fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontSize: '1.25rem',  fontWeight: 600 },
      h4: { fontSize: '1.125rem', fontWeight: 600 },
      h5: { fontSize: '1rem',     fontWeight: 600 },
      h6: { fontSize: '0.938rem', fontWeight: 600 },
      body1:    { fontSize: '0.9rem',   lineHeight: 1.6 },
      body2:    { fontSize: '0.825rem', lineHeight: 1.5 },
      caption:  { fontSize: '0.75rem',  lineHeight: 1.4 },
      overline: { fontSize: '0.7rem',   letterSpacing: '0.08em', fontWeight: 600 },
      subtitle1:{ fontWeight: 600 },
      subtitle2:{ fontWeight: 600 },
    },

    shape: { borderRadius: 10 },

    // ── Sombras (más suaves y con tinte de color) ────────────────────────────
    shadows: [
      'none',
      isLight
        ? '0 1px 3px rgba(20,160,166,0.08), 0 1px 2px rgba(0,0,0,0.04)'
        : '0 1px 3px rgba(0,0,0,0.30)',
      isLight
        ? '0 2px 8px rgba(20,160,166,0.10), 0 1px 3px rgba(0,0,0,0.04)'
        : '0 2px 8px rgba(0,0,0,0.40)',
      isLight
        ? '0 4px 14px rgba(20,160,166,0.12), 0 2px 4px rgba(0,0,0,0.05)'
        : '0 4px 14px rgba(0,0,0,0.50)',
      isLight ? '0 6px 18px rgba(20,160,166,0.13)' : '0 6px 18px rgba(0,0,0,0.55)',
      isLight ? '0 8px 24px rgba(20,160,166,0.14)' : '0 8px 24px rgba(0,0,0,0.58)',
      ...Array(19).fill(isLight
        ? '0 10px 30px rgba(20,160,166,0.15)'
        : '0 10px 30px rgba(0,0,0,0.60)'),
    ] as ReturnType<typeof createTheme>['shadows'],

    // ── Overrides de componentes ─────────────────────────────────────────────
    components: {

      // ── Button ──
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '7px 18px',
            fontSize: '0.875rem',
            letterSpacing: '0.01em',
            transition: 'all 0.18s ease',
          },
          contained: {
            boxShadow: `0 2px 8px ${alpha(TEAL_MAIN, 0.30)}`,
            '&:hover': { boxShadow: `0 4px 14px ${alpha(TEAL_MAIN, 0.45)}` },
          },
          outlined: {
            borderWidth: '1.5px',
            '&:hover': { borderWidth: '1.5px' },
          },
          sizeLarge: { padding: '10px 24px', fontSize: '0.938rem' },
          sizeSmall: { padding: '4px 12px',  fontSize: '0.8rem'   },
        },
      },

      // ── TextField ──
      MuiTextField: {
        defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              backgroundColor: isLight
                ? alpha('#FFFFFF', 0.7)
                : alpha(DARK_BG_ELEVATED, 0.8),
              fontSize: '0.875rem',
              backdropFilter: 'blur(4px)',
              '& fieldset': {
                borderColor: isLight ? '#C8D6E8' : '#2D4159',
                borderWidth: '1.5px',
              },
              '&:hover fieldset': { borderColor: TEAL_MAIN },
              '&.Mui-focused fieldset': {
                borderColor: TEAL_MAIN,
                borderWidth: '2px',
                boxShadow: `0 0 0 3px ${alpha(TEAL_MAIN, 0.15)}`,
              },
            },
            '& .MuiInputLabel-root': { fontSize: '0.85rem' },
            '& .MuiInputBase-input': { padding: '8px 12px' },
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
            borderRadius: 8,
            backgroundColor: isLight
              ? alpha('#FFFFFF', 0.7)
              : alpha(DARK_BG_ELEVATED, 0.8),
            '& fieldset': {
              borderColor: isLight ? '#C8D6E8' : '#2D4159',
              borderWidth: '1.5px',
            },
            '&:hover fieldset': { borderColor: TEAL_MAIN },
            '&.Mui-focused fieldset': {
              borderColor: TEAL_MAIN,
              borderWidth: '2px',
              boxShadow: `0 0 0 3px ${alpha(TEAL_MAIN, 0.15)}`,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: { fontSize: '0.875rem', padding: '8px 12px' },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontSize: '0.85rem' },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            fontSize: '0.875rem',
            '&.Mui-selected': {
              backgroundColor: alpha(TEAL_MAIN, 0.15),
              '&:hover': { backgroundColor: alpha(TEAL_MAIN, 0.22) },
            },
          },
        },
      },

      // ── Card / Paper ──
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 14,
            backgroundImage: 'none',
            border: `1px solid ${isLight ? '#DDE6F0' : '#243347'}`,
            boxShadow: isLight
              ? '0 2px 10px rgba(20,160,166,0.08)'
              : '0 2px 10px rgba(0,0,0,0.35)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? LIGHT_BG_PAPER : DARK_BG_PAPER,
          },
          elevation1: {
            boxShadow: isLight
              ? '0 1px 5px rgba(20,160,166,0.07)'
              : '0 1px 5px rgba(0,0,0,0.30)',
          },
          elevation2: {
            boxShadow: isLight
              ? '0 2px 10px rgba(20,160,166,0.09)'
              : '0 2px 10px rgba(0,0,0,0.40)',
          },
          elevation3: {
            boxShadow: isLight
              ? '0 4px 16px rgba(20,160,166,0.12)'
              : '0 4px 16px rgba(0,0,0,0.50)',
          },
          elevation8: {
            boxShadow: isLight
              ? '0 8px 28px rgba(20,160,166,0.16)'
              : '0 8px 28px rgba(0,0,0,0.60)',
          },
        },
      },

      // ── AppBar ──
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight ? alpha(LIGHT_BG_PAPER, 0.92) : alpha(DARK_BG_PAPER, 0.92),
            backdropFilter: 'blur(12px)',
          },
        },
      },

      // ── Drawer ──
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none',
            backgroundColor: isLight ? LIGHT_BG_PAPER : DARK_BG_PAPER,
            borderRight: `1px solid ${isLight ? '#DDE6F0' : '#243347'}`,
          },
        },
      },

      // ── Chip ──
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 600, fontSize: '0.75rem' },
          sizeSmall: { height: 22 },
          colorPrimary: {
            backgroundColor: alpha(TEAL_MAIN, isLight ? 0.12 : 0.25),
            color: isLight ? TEAL_DARK : TEAL_LIGHT,
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
            color: isLight ? '#2D3E56' : '#9BAABB',
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            '&:hover': { backgroundColor: alpha(TEAL_MAIN, 0.05) },
            '&:last-child td': { borderBottom: 0 },
          },
        },
      },

      // ── Stepper ──
      MuiStepLabel: {
        styleOverrides: {
          label: {
            fontSize: '0.75rem',
            '&.Mui-active':    { fontWeight: 700, color: TEAL_MAIN },
            '&.Mui-completed': { color: '#2E7D32' },
          },
        },
      },
      MuiStepIcon: {
        styleOverrides: {
          root: {
            '&.Mui-active':    { color: TEAL_MAIN },
            '&.Mui-completed': { color: '#2E7D32' },
          },
        },
      },

      // ── LinearProgress ──
      MuiLinearProgress: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            height: 5,
            backgroundColor: alpha(TEAL_MAIN, 0.15),
          },
          bar: {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${TEAL_DARK} 0%, ${TEAL_MAIN} 100%)`,
          },
        },
      },

      // ── Alert ──
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 8, fontSize: '0.85rem' },
          standardInfo: {
            backgroundColor: isLight ? alpha(TEAL_MAIN, 0.1) : alpha(TEAL_MAIN, 0.18),
            color: isLight ? TEAL_DARK : TEAL_LIGHT,
          },
          standardSuccess: {
            backgroundColor: isLight ? '#E8F5E9' : alpha('#2E7D32', 0.2),
          },
          standardWarning: {
            backgroundColor: isLight ? '#FFF8E1' : alpha('#F57C00', 0.2),
          },
          standardError: {
            backgroundColor: isLight ? '#FFEBEE' : alpha('#C62828', 0.2),
          },
        },
      },

      // ── Dialog ──
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            border: `1px solid ${isLight ? '#DDE6F0' : '#243347'}`,
          },
        },
      },

      // ── Tooltip ──
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: '0.75rem',
            borderRadius: 6,
            backgroundColor: isLight ? '#1A2340' : alpha(DARK_BG_ELEVATED, 0.97),
            border: `1px solid ${isLight ? 'transparent' : '#2D4159'}`,
          },
          arrow: {
            color: isLight ? '#1A2340' : alpha(DARK_BG_ELEVATED, 0.97),
          },
        },
      },

      // ── Divider ──
      MuiDivider: {
        styleOverrides: {
          root: { borderColor: isLight ? '#DDE6F0' : '#243347' },
        },
      },

      // ── Radio / Checkbox ──
      MuiRadio: {
        styleOverrides: {
          root: {
            color: isLight ? '#9BAABB' : '#4A5A72',
            '&.Mui-checked': { color: TEAL_MAIN },
            padding: '4px 6px',
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: isLight ? '#9BAABB' : '#4A5A72',
            '&.Mui-checked': { color: TEAL_MAIN },
          },
        },
      },

      // ── FormLabel ──
      MuiFormLabel: {
        styleOverrides: {
          root: {
            fontSize: '0.82rem',
            color: isLight ? '#4A5A72' : '#9BAABB',
            '&.Mui-focused': { color: TEAL_MAIN },
          },
        },
      },

      // ── CssBaseline — override global ──
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isLight ? LIGHT_BG_DEFAULT : DARK_BG_DEFAULT,
            scrollbarWidth: 'thin',
            scrollbarColor: isLight
              ? `${alpha(TEAL_MAIN, 0.3)} transparent`
              : `${alpha(TEAL_MAIN, 0.2)} transparent`,
          },
          '*::-webkit-scrollbar': { width: '6px', height: '6px' },
          '*::-webkit-scrollbar-track': { background: 'transparent' },
          '*::-webkit-scrollbar-thumb': {
            background: isLight ? alpha(TEAL_MAIN, 0.25) : alpha(TEAL_MAIN, 0.20),
            borderRadius: '3px',
            '&:hover': {
              background: isLight ? alpha(TEAL_MAIN, 0.45) : alpha(TEAL_MAIN, 0.35),
            },
          },
        },
      },
    },
  })
}

// Exportación por defecto para compatibilidad con código existente (usa light)
export default buildTheme('light')
