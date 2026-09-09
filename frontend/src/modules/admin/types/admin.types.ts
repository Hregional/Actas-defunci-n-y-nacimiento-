export interface UsuarioSistema {
  id:              string
  username:        string
  nombreCompleto:  string | null
  cui:             string | null
  numeroEmpleado:  string | null
  renglon:         string | null
  email:           string | null
  roles:           string[]
  habilitado:      boolean
}

export interface EmpleadoRh {
  id:              number
  numeroEmpleado:  string
  nombreCompleto:  string
  dpi:             string
  renglon:         string
  activo:          boolean
}

export interface CrearUsuarioPayload {
  username:        string
  password:        string
  nombreCompleto:  string
  cui:             string
  numeroEmpleado?: string
  renglon?:        string
  email?:          string
  rol:             'actas-admin' | 'actas-empleado'
}

export interface ActualizarUsuarioPayload {
  password?:       string
  rol?:            'actas-admin' | 'actas-empleado'
  habilitado?:     boolean
  renglon?:        string
  numeroEmpleado?: string
  nombreCompleto?: string
}
