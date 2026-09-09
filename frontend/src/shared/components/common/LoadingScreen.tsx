import { Box, CircularProgress, Typography } from '@mui/material'

export default function LoadingScreen({ message = 'Cargando...' }: { message?: string }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="40vh"
      gap={2}
    >
      <CircularProgress color="primary" />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  )
}
