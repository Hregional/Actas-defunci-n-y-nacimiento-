import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Alert, Button, Typography } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import MainLayout        from '@/shared/components/layout/MainLayout'
import Dashboard         from '@/shared/pages/Dashboard'
import NacimientoListPage from '@/modules/nacimiento/pages/NacimientoListPage'
import NacimientoFormPage from '@/modules/nacimiento/pages/NacimientoFormPage'
import DefuncionListPage  from '@/modules/defuncion/pages/DefuncionListPage'
import DefuncionFormPage  from '@/modules/defuncion/pages/DefuncionFormPage'
import AdminUsuariosPage  from '@/modules/admin/pages/AdminUsuariosPage'
import { useCurrentUser } from '@/shared/context/UserContext'
import { useKeycloak } from '@/shared/context/KeycloakContext'

/** Ruta protegida — solo para actas-admin */
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { usuario } = useCurrentUser()
  if (usuario.cargando) return null
  if (!usuario.esAdmin) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const { usuario } = useCurrentUser()
  const { logout } = useKeycloak()

  // Pantalla de error si el usuario está usando un token de otro sistema
  if (!usuario.cargando && usuario.advertencia?.includes('Acceso denegado')) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          bgcolor: '#f5f5f5',
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom color="error.main">
          Acceso Denegado
        </Typography>
        <Alert severity="error" sx={{ maxWidth: 600, mb: 3 }}>
          {usuario.advertencia}
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mb: 3, textAlign: 'center' }}>
          Has iniciado sesión con credenciales de otro sistema. Para acceder al Sistema de Informes de Nacimiento y Defunción,
          debes cerrar sesión e ingresar con las credenciales correctas asignadas para este sistema.
        </Typography>
        <Button variant="contained" color="error" size="large" onClick={logout}>
          Cerrar Sesión
        </Button>
      </Box>
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Dashboard />} />

        {/* Nacimiento */}
        <Route path="/nacimientos"            element={<NacimientoListPage />} />
        <Route path="/nacimientos/nuevo"      element={<NacimientoFormPage />} />
        <Route path="/nacimientos/:id/editar" element={<NacimientoFormPage />} />

        {/* Defunción */}
        <Route path="/defunciones"            element={<DefuncionListPage />} />
        <Route path="/defunciones/nuevo"      element={<DefuncionFormPage />} />
        <Route path="/defunciones/:id/editar" element={<DefuncionFormPage />} />

        {/* Admin — solo actas-admin */}
        <Route
          path="/admin/usuarios"
          element={
            <AdminRoute>
              <AdminUsuariosPage />
            </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
