/**
 * AdminUsuariosPage — Gestión de usuarios del sistema de actas.
 *
 * Solo accesible para usuarios con client role actas-admin.
 * - Tabla de usuarios con acceso al sistema (leída desde Keycloak via backend)
 * - Botón "Dar acceso" → busca en la API de RH → crea el usuario
 * - Acciones por fila: cambiar rol, deshabilitar/habilitar, resetear contraseña
 */
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Typography, Button, TextField, Chip, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress,
  InputAdornment, Divider,
} from '@mui/material'
import AddIcon            from '@mui/icons-material/PersonAdd'
import EditIcon           from '@mui/icons-material/Edit'
import BlockIcon          from '@mui/icons-material/Block'
import CheckCircleIcon    from '@mui/icons-material/CheckCircle'
import SearchIcon         from '@mui/icons-material/Search'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { adminApi }  from '../api/admin.api'
import type {
  UsuarioSistema, EmpleadoRh,
  CrearUsuarioPayload, ActualizarUsuarioPayload,
} from '../types/admin.types'

// ── Chip de rol ──────────────────────────────────────────────────────────────
function RolChip({ roles }: { roles: string[] }) {
  const isAdmin = roles.includes('actas-admin')
  return (
    <Chip
      label={isAdmin ? 'Admin' : 'Empleado'}
      size="small"
      color={isAdmin ? 'primary' : 'default'}
      icon={isAdmin ? <AdminPanelSettingsIcon sx={{ fontSize: '14px !important' }} /> : undefined}
    />
  )
}

// ── Diálogo: Dar acceso a empleado ───────────────────────────────────────────
function DialogCrear({ open, onClose }: { open: boolean; onClose: () => void }) {
  const qc = useQueryClient()

  const [busqueda,   setBusqueda]   = useState('')
  const [empleado,   setEmpleado]   = useState<EmpleadoRh | null>(null)
  const [username,   setUsername]   = useState('')
  const [password,   setPassword]   = useState('')
  const [rol,        setRol]        = useState<'actas-admin' | 'actas-empleado'>('actas-empleado')
  const [error,      setError]      = useState<string | null>(null)

  const buscarQ = useQuery({
    queryKey: ['empleados-rh', busqueda],
    queryFn:  () => adminApi.buscarEmpleadosRh(busqueda),
    enabled:  busqueda.length >= 2,
    staleTime: 30_000,
  })

  const crear = useMutation({
    mutationFn: (p: CrearUsuarioPayload) => adminApi.crearUsuario(p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-usuarios'] })
      handleClose()
    },
    onError: (e: Error) => setError(e.message ?? 'Error al crear usuario'),
  })

  const handleClose = () => {
    setBusqueda(''); setEmpleado(null); setUsername(''); setPassword('')
    setRol('actas-empleado'); setError(null); onClose()
  }

  const handleSubmit = () => {
    if (!empleado)      return setError('Seleccione un empleado')
    if (!username.trim()) return setError('El username es requerido')
    if (!password.trim()) return setError('La contraseña es requerida')
    setError(null)
    crear.mutate({
      username:       username.trim(),
      password,
      nombreCompleto: empleado.nombreCompleto,
      cui:            empleado.dpi,
      numeroEmpleado: empleado.numeroEmpleado,
      renglon:        empleado.renglon,
      rol,
    })
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Dar acceso al sistema</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>

          {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}

          {/* Paso 1: buscar empleado */}
          <Typography variant="caption" color="text.secondary" fontWeight={600}>
            PASO 1 — Buscar empleado en el sistema de RH
          </Typography>
          <TextField
            label="Buscar por nombre o DPI"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setEmpleado(null) }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: buscarQ.isFetching
                ? <CircularProgress size={16} />
                : null,
            }}
          />

          {/* Resultados */}
          {buscarQ.data && buscarQ.data.length > 0 && !empleado && (
            <Paper variant="outlined" sx={{ maxHeight: 200, overflowY: 'auto' }}>
              {buscarQ.data.map((emp) => (
                <Box
                  key={emp.id}
                  onClick={() => {
                    setEmpleado(emp)
                    setUsername(emp.nombreCompleto.toLowerCase().replace(/\s+/g, '.').slice(0, 20))
                  }}
                  sx={{
                    p: 1.5, cursor: 'pointer', borderBottom: 1, borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                    '&:last-child': { borderBottom: 0 },
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>{emp.nombreCompleto}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    DPI: {emp.dpi} · Emp. {emp.numeroEmpleado} · Renglón {emp.renglon}
                  </Typography>
                </Box>
              ))}
            </Paper>
          )}

          {buscarQ.data?.length === 0 && busqueda.length >= 2 && (
            <Alert severity="info">No se encontraron empleados para "{busqueda}"</Alert>
          )}

          {/* Empleado seleccionado */}
          {empleado && (
            <Alert
              severity="success"
              onClose={() => setEmpleado(null)}
              sx={{ '& .MuiAlert-message': { width: '100%' } }}
            >
              <Typography variant="body2" fontWeight={700}>{empleado.nombreCompleto}</Typography>
              <Typography variant="caption">
                DPI: {empleado.dpi} · Emp. {empleado.numeroEmpleado} · Renglón {empleado.renglon}
              </Typography>
            </Alert>
          )}

          {/* Paso 2: credenciales */}
          {empleado && (
            <>
              <Divider />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                PASO 2 — Asignar credenciales y rol
              </Typography>

              <TextField
                label="Username *"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                helperText="Sin espacios. El usuario lo usará para iniciar sesión."
              />
              <TextField
                label="Contraseña temporal *"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="El usuario deberá cambiarla al primer login."
              />
              <FormControl>
                <InputLabel>Rol en este sistema</InputLabel>
                <Select
                  value={rol}
                  label="Rol en este sistema"
                  onChange={(e) => setRol(e.target.value as typeof rol)}
                >
                  <MenuItem value="actas-empleado">Empleado — puede registrar informes</MenuItem>
                  <MenuItem value="actas-admin">Admin — gestiona usuarios y configuración</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={handleClose} disabled={crear.isPending}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!empleado || crear.isPending}
          startIcon={crear.isPending ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
        >
          Crear acceso
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Diálogo: Editar usuario ───────────────────────────────────────────────────
function DialogEditar({
  usuario, onClose,
}: { usuario: UsuarioSistema | null; onClose: () => void }) {
  const qc = useQueryClient()

  const [rol,       setRol]       = useState<'actas-admin' | 'actas-empleado'>(
    (usuario?.roles.includes('actas-admin') ? 'actas-admin' : 'actas-empleado')
  )
  const [password,  setPassword]  = useState('')
  const [error,     setError]     = useState<string | null>(null)

  const actualizar = useMutation({
    mutationFn: (p: ActualizarUsuarioPayload) =>
      adminApi.actualizarUsuario(usuario!.id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-usuarios'] })
      onClose()
    },
    onError: (e: Error) => setError(e.message ?? 'Error al actualizar'),
  })

  if (!usuario) return null

  const handleSave = () => {
    setError(null)
    const payload: ActualizarUsuarioPayload = { rol }
    if (password.trim()) payload.password = password
    actualizar.mutate(payload)
  }

  const handleToggle = () => {
    actualizar.mutate({ habilitado: !usuario.habilitado })
  }

  return (
    <Dialog open={!!usuario} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle fontWeight={700}>Editar — {usuario.username}</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Alert severity="info" sx={{ py: 0.5 }}>
            <Typography variant="caption">
              <strong>{usuario.nombreCompleto ?? '—'}</strong>
              {usuario.numeroEmpleado ? ` · Emp. ${usuario.numeroEmpleado}` : ''}
              {usuario.renglon ? ` · Renglón ${usuario.renglon}` : ''}
            </Typography>
          </Alert>

          <FormControl>
            <InputLabel>Rol</InputLabel>
            <Select
              value={rol}
              label="Rol"
              onChange={(e) => setRol(e.target.value as typeof rol)}
            >
              <MenuItem value="actas-empleado">Empleado</MenuItem>
              <MenuItem value="actas-admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Nueva contraseña (opcional)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Dejar vacío para no cambiarla."
          />

          <Button
            variant="outlined"
            color={usuario.habilitado ? 'error' : 'success'}
            startIcon={usuario.habilitado ? <BlockIcon /> : <CheckCircleIcon />}
            onClick={handleToggle}
            disabled={actualizar.isPending}
          >
            {usuario.habilitado ? 'Deshabilitar acceso' : 'Habilitar acceso'}
          </Button>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 1.5 }}>
        <Button onClick={onClose} disabled={actualizar.isPending}>Cancelar</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={actualizar.isPending}
          startIcon={actualizar.isPending ? <CircularProgress size={16} color="inherit" /> : <EditIcon />}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function AdminUsuariosPage() {
  const [dialogCrear, setDialogCrear] = useState(false)
  const [editando,    setEditando]    = useState<UsuarioSistema | null>(null)
  const [filtro,      setFiltro]      = useState('')

  const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['admin-usuarios'],
    queryFn:  () => adminApi.listarUsuarios(),
    staleTime: 30_000,
  })

  const filtrados = (usuarios ?? []).filter((u) => {
    if (!filtro) return true
    const q = filtro.toLowerCase()
    return (
      u.username.toLowerCase().includes(q) ||
      (u.nombreCompleto ?? '').toLowerCase().includes(q) ||
      (u.cui ?? '').includes(q) ||
      (u.numeroEmpleado ?? '').includes(q)
    )
  })

  return (
    <Box>
      {/* Encabezado */}
      <Box
        display="flex"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700} color="primary.main">
            Gestión de usuarios
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Usuarios con acceso al Sistema de Informes HRO
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogCrear(true)}
        >
          Dar acceso
        </Button>
      </Box>

      {/* Buscador */}
      <TextField
        placeholder="Buscar por nombre, username, DPI o número de empleado…"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
          ),
        }}
        sx={{ mb: 2, maxWidth: 480 }}
      />

      {/* Estados */}
      {isLoading && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error">
          Error al cargar usuarios. Verifique la conexión con el backend.
        </Alert>
      )}

      {/* Tabla */}
      {!isLoading && !error && (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Nombre completo</TableCell>
                <TableCell>DPI</TableCell>
                <TableCell>Emp. / Renglón</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    {filtro ? 'Sin resultados para esa búsqueda.' : 'Aún no hay usuarios en el sistema.'}
                  </TableCell>
                </TableRow>
              )}
              {filtrados.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>{u.username}</Typography>
                    {u.email && (
                      <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                    )}
                  </TableCell>
                  <TableCell>{u.nombreCompleto ?? '—'}</TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                    {u.cui ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      {u.numeroEmpleado ? `Emp. ${u.numeroEmpleado}` : '—'}
                      {u.renglon ? ` · R${u.renglon}` : ''}
                    </Typography>
                  </TableCell>
                  <TableCell><RolChip roles={u.roles} /></TableCell>
                  <TableCell align="center">
                    <Chip
                      label={u.habilitado ? 'Activo' : 'Inactivo'}
                      size="small"
                      color={u.habilitado ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => setEditando(u)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Stats */}
      {!isLoading && !error && usuarios && (
        <Box display="flex" gap={2} mt={2} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            Total: <strong>{usuarios.length}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Activos: <strong>{usuarios.filter(u => u.habilitado).length}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Admins: <strong>{usuarios.filter(u => u.roles.includes('actas-admin')).length}</strong>
          </Typography>
        </Box>
      )}

      {/* Diálogos */}
      <DialogCrear open={dialogCrear} onClose={() => setDialogCrear(false)} />
      <DialogEditar usuario={editando} onClose={() => setEditando(null)} />
    </Box>
  )
}
