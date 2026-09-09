import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, TextField,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Tooltip, Typography,
  TablePagination, InputAdornment, Stack, Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PrintIcon from '@mui/icons-material/Print'
import SearchIcon from '@mui/icons-material/Search'
import dayjs from 'dayjs'
import { useDefuncionList, useDefuncionById, useEliminarDefuncion } from '../hooks/useDefuncion'
import EstadoChip from '@/shared/components/common/EstadoChip'
import LoadingScreen from '@/shared/components/common/LoadingScreen'
import ConfirmDialog from '@/shared/components/common/ConfirmDialog'
import DefuncionPreview from '../components/DefuncionPreview'
import type { DefuncionFormValues } from '../schemas/defuncion.schema'

export default function DefuncionListPage() {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [search, setSearch]         = useState('')
  const [page, setPage]             = useState(0)
  const [size]                      = useState(10)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [previewId, setPreviewId] = useState<number | null>(null)

  const { data, isLoading, isError } = useDefuncionList({ search, page, size })
  const { data: previewData } = useDefuncionById(previewId ?? undefined)
  const eliminar = useEliminarDefuncion()

  const handleDelete = async () => {
    if (!deleteId) return
    await eliminar.mutateAsync(deleteId)
    setDeleteId(null)
  }

  if (isLoading) return <LoadingScreen message="Cargando informes de defunción..." />

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} mb={3}>
        <TextField
          placeholder="Buscar por nombre del fallecido..."
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value
            setInputValue(val)
            if (debounceRef.current) clearTimeout(debounceRef.current)
            debounceRef.current = setTimeout(() => {
              setSearch(val)
              setPage(0)
            }, 350)
          }}
          sx={{ maxWidth: 380 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
            ),
          }}
        />
        <Box flexGrow={1} />
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/defunciones/nuevo')} size="large">
          Nuevo Informe
        </Button>
      </Stack>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Error al cargar los registros.</Alert>}

      <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Fallecido(a)</TableCell>
              <TableCell>Fecha Defunción</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Municipio</TableCell>
              <TableCell>Quien Informa</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.content.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">No se encontraron registros</Typography>
                </TableCell>
              </TableRow>
            )}
            {data?.content.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => setPreviewId(row.id)}
              >
                <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>#{row.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{row.fallecidoNombreCompleto || '—'}</TableCell>
                <TableCell>
                  {row.infoFechaDefuncion ? dayjs(row.infoFechaDefuncion).format('DD/MM/YYYY') : '—'}
                </TableCell>
                <TableCell>{row.infoLugarDepartamento || '—'}</TableCell>
                <TableCell>{row.infoLugarMunicipio || '—'}</TableCell>
                <TableCell>{row.infoQuienInformaNombres || '—'}</TableCell>
                <TableCell><EstadoChip estado={row.estado} /></TableCell>
                <TableCell sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                  {dayjs(row.createdAt).format('DD/MM/YYYY HH:mm')}
                </TableCell>
                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Vista previa / Imprimir">
                    <IconButton size="small" color="default" onClick={() => setPreviewId(row.id)}>
                      <PrintIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/defunciones/${row.id}/editar`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(row.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data?.totalElements ?? 0}
          page={page}
          rowsPerPage={size}
          rowsPerPageOptions={[10]}
          onPageChange={(_, p) => setPage(p)}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </TableContainer>

      <ConfirmDialog
        open={!!deleteId}
        title="Eliminar informe"
        message="¿Está seguro que desea eliminar este informe de defunción? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={eliminar.isPending}
      />

      {/* Preview al clic en fila o en ícono imprimir */}
      {previewData && (
        <DefuncionPreview
          open={!!previewId}
          onClose={() => setPreviewId(null)}
          data={previewData as Partial<DefuncionFormValues>}
        />
      )}
    </Box>
  )
}
