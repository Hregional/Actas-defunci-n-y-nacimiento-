import { Box, CircularProgress, Typography, LinearProgress } from '@mui/material'

interface LoadingScreenProps {
  message?: string
  showProgress?: boolean  // Mostrar barra de progreso para indicar retry
  subtitle?: string       // Mensaje adicional (ej: "Reintentando...")
}

export default function LoadingScreen({ 
  message = 'Cargando...', 
  showProgress = false,
  subtitle
}: LoadingScreenProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="40vh"
      gap={2}
      px={3}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" color="text.primary" fontWeight={600} textAlign="center">
        {message}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {subtitle}
        </Typography>
      )}
      {showProgress && (
        <Box sx={{ width: '100%', maxWidth: 280, mt: 1 }}>
          <LinearProgress />
        </Box>
      )}
    </Box>
  )
}
