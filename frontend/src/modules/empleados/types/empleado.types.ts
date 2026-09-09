/**
 * Empleado del sistema de RH del hospital.
 * Campos devueltos por GET /api/empleados-rh (proxy del backend).
 */
export interface EmpleadoRhDTO {
  id: number
  numeroEmpleado: string
  nombreCompleto: string
  dpi: string | null
  renglon: string | null
  areaId: number | null
  activo: boolean
}
