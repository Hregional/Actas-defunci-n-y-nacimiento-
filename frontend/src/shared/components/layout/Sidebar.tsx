import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Chip, useMediaQuery, useTheme,
} from '@mui/material'
import DashboardIcon      from '@mui/icons-material/Dashboard'
import ChildCareIcon      from '@mui/icons-material/ChildCare'
import LocalHospitalIcon  from '@mui/icons-material/LocalHospital'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { useCurrentUser } from '@/shared/context/UserContext'

export const DRAWER_WIDTH = 240

interface Props {
  mobileOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  { label: 'Dashboard',   path: '/',            icon: <DashboardIcon />,     badge: null,      adminOnly: false },
  { label: 'Nacimientos', path: '/nacimientos',  icon: <ChildCareIcon />,     badge: 'Informe', adminOnly: false },
  { label: 'Defunciones', path: '/defunciones',  icon: <LocalHospitalIcon />, badge: 'Informe', adminOnly: false },
  { label: 'Usuarios',    path: '/admin/usuarios', icon: <AdminPanelSettingsIcon />, badge: 'Admin', adminOnly: true },
]

function DrawerContent({ currentPath, onNavigate }: {
  currentPath: string
  onNavigate: (path: string) => void
}) {
  const { usuario } = useCurrentUser()

  const items = NAV_ITEMS.filter(item => !item.adminOnly || usuario.esAdmin)

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2, py: 2,
          backgroundImage: (theme) =>
            `linear-gradient(160deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
          color: 'white',
          minHeight: 72,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
          <Box
            component="img"
            src="/assets/images/3-LogoHRO.jpg"
            alt="HRO"
            sx={{ height: 32, borderRadius: 1, bgcolor: 'white', p: '2px', flexShrink: 0 }}
          />
          <Box>
            <Typography variant="subtitle2" fontWeight={800} lineHeight={1.1}>HRO</Typography>
            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.65rem', lineHeight: 1.2, display: 'block' }}>
              Hospital Regional de Occidente
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ opacity: 0.65, fontSize: '0.62rem' }}>
          Sistema de Informes · Quetzaltenango
        </Typography>
      </Box>

      <Divider />

      {/* Nav */}
      <Box sx={{ flexGrow: 1, py: 1, overflowY: 'auto' }}>
        <List dense={false}>
          {items.map((item) => {
            const isActive =
              item.path === '/'
                ? currentPath === '/'
                : currentPath.startsWith(item.path)
            return (
              <ListItemButton
                key={item.path}
                selected={isActive}
                onClick={() => onNavigate(item.path)}
                sx={{
                  mx: 1, mb: 0.5, borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main', color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' },
                    '& .MuiListItemIcon-root': { color: 'white' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: isActive ? 700 : 400 }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 18, fontSize: '0.65rem',
                      bgcolor: isActive ? 'rgba(255,255,255,0.25)' : 'primary.light',
                      color: 'white',
                    }}
                  />
                )}
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary">
          Sistema de Informes v1.0
        </Typography>
      </Box>
    </Box>
  )
}

export default function Sidebar({ mobileOpen, onClose }: Props) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const theme     = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const handleNavigate = (path: string) => {
    navigate(path)
    if (!isDesktop) onClose()
  }

  const content = (
    <DrawerContent currentPath={location.pathname} onNavigate={handleNavigate} />
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      aria-label="navegación principal"
    >
      {/* Móvil — temporal, se cierra solo al navegar o al hacer clic fuera */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          },
        }}
      >
        {content}
      </Drawer>

      {/* Desktop — permanente, siempre visible, no tapa el contenido */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
          },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  )
}
