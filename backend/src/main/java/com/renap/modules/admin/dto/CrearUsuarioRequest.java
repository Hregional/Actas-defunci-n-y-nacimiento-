package com.renap.modules.admin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Payload para crear un usuario nuevo en este sistema.
 * El superadmin elige el empleado de la API de RH y define credenciales.
 */
@Data
public class CrearUsuarioRequest {

    /** Username para el login (sin espacios). */
    @NotBlank(message = "El username es requerido")
    @Pattern(regexp = "^[a-zA-Z0-9._-]{3,50}$",
             message = "Username: 3-50 caracteres, solo letras, números, punto, guion")
    private String username;

    /** Contraseña temporal — el usuario deberá cambiarla al primer login. */
    @NotBlank(message = "La contraseña es requerida")
    private String password;

    /** Nombre completo del empleado (viene de la API de RH). */
    @NotBlank(message = "El nombre completo es requerido")
    private String nombreCompleto;

    /** DPI del empleado (viene de la API de RH). */
    @NotBlank(message = "El DPI es requerido")
    private String cui;

    /** Número de empleado (viene de la API de RH). */
    private String numeroEmpleado;

    /** Renglón presupuestario (viene de la API de RH). */
    private String renglon;

    /** Email (opcional). */
    private String email;

    /**
     * Rol a asignar: "actas-admin" o "actas-empleado".
     * Default: actas-empleado.
     */
    @Pattern(regexp = "^actas-(admin|empleado)$",
             message = "El rol debe ser actas-admin o actas-empleado")
    private String rol = "actas-empleado";
}
