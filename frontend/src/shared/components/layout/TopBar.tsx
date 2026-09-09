import {
  AppBar, Toolbar, IconButton, Typography, Box,
  useScrollTrigger, Avatar, Tooltip, Divider,
  Menu, MenuItem, ListItemIcon, CircularProgress,
  useTheme,
} from '@mui/material'
import MenuIcon         from '@mui/icons-material/Menu'
import LogoutIcon       from '@mui/icons-material/Logout'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DarkModeIcon     from '@mui/icons-material/DarkMode'
import LightModeIcon    from '@mui/icons-material/LightMode'
import { useLocation }  from 'react-router-dom'
import { useState }     from 'react'
import { DRAWER_WIDTH } from './Sidebar'
import { useCurrentUser } from '@/shared/context/UserContext'
import { useKeycloak }    from '@/shared/context/KeycloakContext'

interface Props {
  onMenuClick: () => void
}

const titles: Record<string, string> = {
  '/':                   'Dashboard',
  '/nacimientos':        'Informes de Nacimiento',
  '/nacimientos/nuevo':  'Nuevo Informe de Nacimiento',
  '/defunciones':        'Informes de Defunción',
  '/defunciones/nuevo':  'Nuevo Informe de Defunción',
}

export default function TopBar({ onMenuClick }: Props) {
  const location  = useLocation()
  const theme     = useTheme()
  const trigger   = useScrollTrigger({ disableHysteresis: true, threshold: 0 })
  const { usuario } = useCurrentUser()
  const { logout }  = useKeycloak()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const isDark = theme.palette.mode === 'dark'

  const toggleMode = () => {
    const fn = (window as unknown as Record<string, unknown>).__hroToggleMode
    if (typeof fn === 'function') fn()
  }

  const getTitle = () => {
    if (location.pathname.includes('/editar')) return 'Editar Informe'
    return titles[location.pathname] ?? 'HRO'
  }

  const initials = usuario.nombresApellidos
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <AppBar
      position="fixed"
      elevation={trigger ? 3 : 0}
      sx={{
        width:  { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml:     { md: `${DRAWER_WIDTH}px` },
        color:  'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        transition: 'box-shadow 0.2s',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        {/* Hamburger — solo en móvil */}
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' }, mr: 0.5 }}
          aria-label="abrir menú"
        >
          <MenuIcon />
        </IconButton>

        {/* Título */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight={600} color="primary.main" noWrap>
            {getTitle()}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap display="block">
            Hospital Regional de Occidente — Sistema de Informes
          </Typography>
        </Box>

        {/* Toggle modo claro/oscuro */}
        <Tooltip title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          <IconButton onClick={toggleMode} size="small" sx={{ color: 'text.secondary' }}>
            {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Tooltip>

        {/* Avatar / menú de usuario */}
        <Tooltip title={usuario.nombresApellidos || 'Usuario'}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            {usuario.cargando ? (
              <CircularProgress size={28} />
            ) : (
              <Avatar
                sx={{
                  width: 34, height: 34,
                  bgcolor: 'primary.main',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {initials || <AccountCircleIcon fontSize="small" />}
              </Avatar>
            )}
          </IconButton>
        </Tooltip>

        {/* Dropdown del usuario */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: { elevation: 3, sx: { mt: 1, minWidth: 220, borderRadius: 2 } },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700} noWrap>
              {usuario.nombresApellidos || '—'}
            </Typography>
            {usuario.numeroEmpleado && (
              <Typography variant="caption" color="text.secondary" display="block">
                Emp. {usuario.numeroEmpleado}
                {usuario.renglon ? ` · Renglón ${usuario.renglon}` : ''}
              </Typography>
            )}
            {usuario.cui && (
              <Typography variant="caption" color="text.secondary" display="block">
                DPI: {usuario.cui}
              </Typography>
            )}
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchorEl(null)
              toggleMode()
            }}
          >
            <ListItemIcon>
              {isDark
                ? <LightModeIcon fontSize="small" />
                : <DarkModeIcon  fontSize="small" />}
            </ListItemIcon>
            {isDark ? 'Modo claro' : 'Modo oscuro'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); logout() }}>
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            Cerrar sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
