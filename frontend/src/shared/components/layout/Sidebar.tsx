/**
 * Sidebar — estilo Vision UI
 *
 * · Fondo azul marino profundo con glassmorphism en modo oscuro
 * · Fondo blanco limpio en modo claro
 * · Nav items con ícono en caja de gradiente cuando están activos
 * · Header con gradiente cian→violeta
 * · Footer con info del usuario
 */
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, Chip, useMediaQuery, useTheme, alpha, Avatar, Divider,
} from '@mui/material'
import DashboardIcon           from '@mui/icons-material/Dashboard'
import ChildCareIcon           from '@mui/icons-material/ChildCare'
import LocalHospitalIcon       from '@mui/icons-material/LocalHospital'
import AdminPanelSettingsIcon  from '@mui/icons-material/AdminPanelSettings'
import { useCurrentUser }      from '@/shared/context/UserContext'
import { GRAD_CYAN, GRAD_VIOLET, GRAD_GREEN, GRAD_ORANGE } from '@/theme/theme'

export const DRAWER_WIDTH = 250

interface Props {
  mobileOpen: boolean
  onClose: () => void
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon sx={{ fontSize: 20 }} />,
    gradient: GRAD_CYAN,
    adminOnly: false,
  },
  {
    label: 'Nacimientos',
    path: '/nacimientos',
    icon: <ChildCareIcon sx={{ fontSize: 20 }} />,
    gradient: GRAD_GREEN,
    badge: 'Informe',
    adminOnly: false,
  },
  {
    label: 'Defunciones',
    path: '/defunciones',
    icon: <LocalHospitalIcon sx={{ fontSize: 20 }} />,
    gradient: GRAD_VIOLET,
    badge: 'Informe',
    adminOnly: false,
  },
  {
    label: 'Usuarios',
    path: '/admin/usuarios',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 20 }} />,
    gradient: GRAD_ORANGE,
    badge: 'Admin',
    adminOnly: true,
  },
]

function DrawerContent({
  currentPath,
  onNavigate,
}: {
  currentPath: string
  onNavigate: (path: string) => void
}) {
  const { usuario } = useCurrentUser()
  const theme       = useTheme()
  const isLight     = theme.palette.mode === 'light'

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || usuario.esAdmin)

  // Iniciales del usuario
  const initials = usuario.nombresApellidos
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('') ?? '?'

  // Colores según modo
  const sidebarBg   = isLight ? '#FFFFFF'  : '#0B1437'
  const activeBg    = isLight ? '#F4F7FE'  : alpha('#FFFFFF', 0.07)
  const inactiveTxt = isLight ? '#707EAE'  : '#A3AED0'
  const activeTxt   = isLight ? '#1B254B'  : '#FFFFFF'
  const borderClr   = isLight ? '#E9EDF7'  : alpha('#FFFFFF', 0.06)

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: sidebarBg,
      overflow: 'hidden',
    }}>

      {/* ── Header con gradiente ── */}
      <Box sx={{
        px: 2.5, py: 2.5,
        background: 'linear-gradient(127deg, #0B1437 0%, #1a237e 55%, #0BC5EA 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Círculo decorativo */}
        <Box sx={{
          position: 'absolute', right: -20, top: -20,
          width: 100, height: 100, borderRadius: '50%',
          background: alpha('#0BC5EA', 0.15),
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: 30, bottom: -30,
          width: 70, height: 70, borderRadius: '50%',
          background: alpha('#4361EE', 0.20),
          pointerEvents: 'none',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <Box
              component="img"
              src="/assets/images/3-LogoHRO.jpg"
              alt="HRO"
              sx={{
                height: 36, borderRadius: '10px',
                bgcolor: 'white', p: '3px',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={800} sx={{ color: '#FFFFFF', lineHeight: 1.1 }}>
                HRO
              </Typography>
              <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.65), fontSize: '0.65rem', display: 'block' }}>
                Hospital Regional de Occidente
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: alpha('#FFFFFF', 0.45), fontSize: '0.62rem' }}>
            Sistema de Informes · Quetzaltenango
          </Typography>
        </Box>
      </Box>

      {/* ── Separador ── */}
      <Divider sx={{ borderColor: borderClr }} />

      {/* ── Sección nav ── */}
      <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
        <Typography variant="overline" sx={{ color: inactiveTxt, px: 1, fontSize: '0.65rem', letterSpacing: '0.10em' }}>
          Navegación
        </Typography>
      </Box>

      {/* ── Items de navegación ── */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, pb: 1 }}>
        <List dense disablePadding>
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
                  borderRadius: '12px',
                  mb: 0.5,
                  px: 1.5,
                  py: 1,
                  bgcolor: isActive ? activeBg : 'transparent',
                  border: `1px solid ${isActive ? (isLight ? alpha('#0BC5EA', 0.18) : alpha('#FFFFFF', 0.08)) : 'transparent'}`,
                  transition: 'all 0.18s ease',
                  '&:hover': {
                    bgcolor: activeBg,
                    '& .nav-label': { color: activeTxt },
                  },
                  '&.Mui-selected': {
                    bgcolor: activeBg,
                    '&:hover': { bgcolor: activeBg },
                  },
                }}
              >
                {/* Ícono con gradiente si activo, gris si no */}
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '10px',
                    background: isActive ? item.gradient : (isLight ? '#F4F7FE' : alpha('#FFFFFF', 0.06)),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.18s ease',
                    boxShadow: isActive ? `0 4px 12px ${alpha('#0BC5EA', 0.35)}` : 'none',
                    color: isActive ? '#FFFFFF' : inactiveTxt,
                  }}>
                    {item.icon}
                  </Box>
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    className: 'nav-label',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.875rem',
                    color: isActive ? activeTxt : inactiveTxt,
                    noWrap: true,
                  }}
                />

                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      bgcolor: isActive
                        ? alpha('#0BC5EA', isLight ? 0.12 : 0.18)
                        : (isLight ? '#F4F7FE' : alpha('#FFFFFF', 0.06)),
                      color: isActive ? '#0BC5EA' : inactiveTxt,
                      border: 'none',
                    }}
                  />
                )}
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: borderClr }} />

      {/* ── Footer: perfil del usuario ── */}
      <Box sx={{ px: 2, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{
          width: 36, height: 36,
          background: GRAD_CYAN,
          fontSize: '0.8rem', fontWeight: 800,
          flexShrink: 0,
          boxShadow: `0 4px 12px ${alpha('#0BC5EA', 0.35)}`,
        }}>
          {initials}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography
            variant="body2" fontWeight={700}
            sx={{ color: activeTxt, lineHeight: 1.2 }}
            noWrap
          >
            {usuario.nombresApellidos || '—'}
          </Typography>
          <Typography variant="caption" sx={{ color: inactiveTxt, fontSize: '0.68rem' }} noWrap display="block">
            {usuario.numeroEmpleado ? `Emp. ${usuario.numeroEmpleado}` : 'Sistema HRO'}
          </Typography>
        </Box>
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

  const paperSx = {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box' as const,
    border: 'none',
  }

  return (
    <Box
      component="nav"
      sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      aria-label="navegación principal"
    >
      {/* Móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            ...paperSx,
            boxShadow: '6px 0 30px rgba(0,0,0,0.20)',
          },
        }}
      >
        {content}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            ...paperSx,
            boxShadow: 'none',
          },
        }}
        open
      >
        {content}
      </Drawer>
    </Box>
  )
}
