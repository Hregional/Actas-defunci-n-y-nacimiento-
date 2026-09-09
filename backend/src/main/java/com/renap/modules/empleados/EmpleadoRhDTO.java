package com.renap.modules.empleados;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

/**
 * Representa un empleado del sistema de RH del hospital.
 * Los campos corresponden al JSON devuelto por {@code GET /api/empleados}.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmpleadoRhDTO {

    /** ID interno del sistema de RH. */
    private Long id;

    /** Número de empleado (código único del hospital). */
    private String numeroEmpleado;

    /** Nombre completo del empleado. */
    private String nombreCompleto;

    /** DPI del empleado (13 dígitos). */
    private String dpi;

    /** Renglón presupuestario (011, 021, 022, etc.). */
    private String renglon;

    /** ID del área/departamento donde trabaja. */
    private Long areaId;

    /** Indica si el empleado está activo en el sistema de RH. */
    private boolean activo;
}
