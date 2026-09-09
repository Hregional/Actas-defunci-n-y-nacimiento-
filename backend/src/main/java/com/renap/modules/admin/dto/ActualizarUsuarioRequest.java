package com.renap.modules.admin.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Payload para actualizar un usuario existente.
 * Todos los campos son opcionales — solo se aplican los que vengan no-nulos.
 */
@Data
public class ActualizarUsuarioRequest {

    /** Nueva contraseña (opcional — si viene, se resetea). */
    private String password;

    /**
     * Nuevo rol: "actas-admin" o "actas-empleado".
     * Si viene, se reemplaza el rol actual.
     */
    @Pattern(regexp = "^actas-(admin|empleado)$",
             message = "El rol debe ser actas-admin o actas-empleado")
    private String rol;

    /** Habilitar o deshabilitar el acceso. */
    private Boolean habilitado;

    /** Actualizar renglón (si cambia en RH). */
    private String renglon;

    /** Actualizar número de empleado (si cambia en RH). */
    private String numeroEmpleado;

    /** Actualizar nombre completo (si cambia en RH). */
    private String nombreCompleto;
}
