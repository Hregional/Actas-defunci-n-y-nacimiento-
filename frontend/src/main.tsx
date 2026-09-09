import React, { useMemo, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ThemeProvider, CssBaseline, type PaletteMode } from '@mui/material'
import 'dayjs/locale/es'
import { buildTheme } from '@/theme/theme'
import { KeycloakProvider } from '@/shared/context/KeycloakContext'
import { UserProvider }     from '@/shared/context/UserContext'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
})

// ── Detectar y persistir preferencia de modo ────────────────────────────────
function getInitialMode(): PaletteMode {
  const saved = localStorage.getItem('hro-color-mode') as PaletteMode | null
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function Root() {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode)
  const theme = useMemo(() => buildTheme(mode), [mode])

  // Escuchar cambios de preferencia del SO en tiempo real
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // Solo cambia si el usuario no fijó preferencia manual
      if (!localStorage.getItem('hro-color-mode')) {
        setMode(e.matches ? 'dark' : 'light')
      }
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Exponer toggleMode globalmente para el TopBar (sin prop drilling ni context)
  useEffect(() => {
    ;(window as unknown as Record<string, unknown>).__hroToggleMode = () => {
      setMode((prev) => {
        const next = prev === 'light' ? 'dark' : 'light'
        localStorage.setItem('hro-color-mode', next)
        return next
      })
    }
    ;(window as unknown as Record<string, unknown>).__hroColorMode = mode
  }, [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <KeycloakProvider>
        <QueryClientProvider client={queryClient}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <UserProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </UserProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </KeycloakProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)
