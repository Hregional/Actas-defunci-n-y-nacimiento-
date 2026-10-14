import { ReactNode } from 'react'
import { Box, Typography, Paper, Divider } from '@mui/material'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
  variant?: 'default' | 'nacimiento' | 'defuncion'
}

export default function SectionCard({ title, subtitle, children, action, variant = 'default' }: Props) {
  // Estilos diferenciados por tipo de acta
  const headerStyles = {
    default: {
      background: 'linear-gradient(90deg, #003087 0%, #0057B8 50%, #00A8CC 100%)',
      boxShadow: '0 2px 12px rgba(0, 48, 135, 0.2)',
    },
    nacimiento: {
      background: 'linear-gradient(135deg, #0057B8 0%, #00A8CC 60%, #26C6DA 100%)',
      boxShadow: '0 3px 16px rgba(0, 87, 184, 0.25)',
    },
    defuncion: {
      background: 'linear-gradient(135deg, #003087 0%, #0057B8 60%, #1976D2 100%)',
      boxShadow: '0 3px 16px rgba(0, 48, 135, 0.3)',
    },
  }

  const selectedStyle = headerStyles[variant]

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2.5,
        overflow: 'hidden',
        mb: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          ...selectedStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '0 2px 2px 0',
          },
        }}
      >
        <Box>
          <Typography 
            variant="subtitle1" 
            fontWeight={700} 
            color="white"
            sx={{ 
              letterSpacing: '0.02em',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.92)',
                display: 'block',
                mt: 0.3,
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {children}
      </Box>
    </Paper>
  )
}
