import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar, { DRAWER_WIDTH } from './Sidebar'
import TopBar from './TopBar'

export default function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{
      display: 'flex',
      bgcolor: 'background.default',
    }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
          minHeight: '100vh',
        }}
      >
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <Box
          sx={{
            flexGrow: 1,
            px: { xs: 1.5, sm: 3 },
            py: { xs: 2, sm: 3 },
            mt: '64px',
            overflowX: 'hidden',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
