import axios from '@/shared/api/axios'
import type {
  UsuarioSistema, EmpleadoRh,
  CrearUsuarioPayload, ActualizarUsuarioPayload,
} from '../types/admin.types'

interface ApiResp<T> { data: T }

export const adminApi = {
  listarUsuarios: () =>
    axios.get<ApiResp<UsuarioSistema[]>>('/admin/usuarios')
      .then(r => r.data.data),

  buscarEmpleadosRh: (q?: string) =>
    axios.get<ApiResp<EmpleadoRh[]>>('/admin/usuarios/empleados-rh', { params: { q } })
      .then(r => r.data.data),

  crearUsuario: (payload: CrearUsuarioPayload) =>
    axios.post<ApiResp<UsuarioSistema>>('/admin/usuarios', payload)
      .then(r => r.data.data),

  actualizarUsuario: (id: string, payload: ActualizarUsuarioPayload) =>
    axios.put<ApiResp<UsuarioSistema>>(`/admin/usuarios/${id}`, payload)
      .then(r => r.data.data),
}
