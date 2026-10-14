/**
 * ErrorBoundary - Captura errores no manejados en React
 * 
 * Buenas prácticas de producción:
 * - Nunca mostrar stacktraces al usuario final
 * - Proporcionar una forma de recuperarse
 * - Registrar errores para debugging (consola en dev, servicio en prod)
 */
import { Component, ReactNode } from 'react'
import { Box, Button, Typography, Alert, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import RefreshIcon from '@mui/icons-material/Refresh'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: string | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Registrar en consola (en producción, enviar a servicio de logging)
    console.error('[ErrorBoundary] Error capturado:', error)
    console.error('[ErrorBoundary] Información:', errorInfo)

    this.setState({
      errorInfo: errorInfo.componentStack || null,
    })
  }

  handleReload = () => {
    // Recargar la página para intentar recuperarse
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV

      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              maxWidth: 600,
              p: 4,
              textAlign: 'center',
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
            />
            <Typography variant="h4" fontWeight={700} gutterBottom color="error.main">
              Algo salió mal
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Lo sentimos, ha ocurrido un error inesperado. Por favor, intenta recargar la página.
            </Typography>

            {isDev && this.state.error && (
              <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                <Typography variant="caption" component="div" fontWeight={700}>
                  Error (solo visible en desarrollo):
                </Typography>
                <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                  {this.state.error.toString()}
                </Typography>
                {this.state.errorInfo && (
                  <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 1, fontSize: '0.7rem' }}>
                    {this.state.errorInfo}
                  </Typography>
                )}
              </Alert>
            )}

            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={this.handleReload}
            >
              Recargar Sistema
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}
