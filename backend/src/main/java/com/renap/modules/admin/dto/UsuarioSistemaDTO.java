package com.renap.modules.admin.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

/**
 * Representa un usuario del sistema de actas (con client role actas-admin o actas-empleado).
 * Construido a partir de la Keycloak Admin API.
 */
@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioSistemaDTO {

    /** ID interno de Keycloak (UUID). */
    private String id;

    /** Username de acceso. */
    private String username;

    /** Nombre completo del empleado (atributo nombre_completo). */
    private String nombreCompleto;

    /** DPI del empleado (atributo cui). */
    private String cui;

    /** Número de empleado del hospital (atributo numero_empleado). */
    private String numeroEmpleado;

    /** Renglón presupuestario (atributo renglon). */
    private String renglon;

    /** Email registrado en Keycloak. */
    private String email;

    /** Roles de este sistema: actas-admin, actas-empleado. */
    private List<String> roles;

    /** true = puede ingresar al sistema. */
    private boolean habilitado;
}
