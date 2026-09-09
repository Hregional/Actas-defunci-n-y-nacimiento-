import { ReactNode } from 'react'
import { Box, Typography, Paper, Divider } from '@mui/material'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export default function SectionCard({ title, subtitle, children, action }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3,
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Divider />
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {children}
      </Box>
    </Paper>
  )
}
