package com.renap.shared.integration.keycloak;

/**
 * Excepción lanzada cuando no se puede obtener un token válido de Keycloak.
 */
public class KeycloakTokenException extends RuntimeException {

    public KeycloakTokenException(String message) {
        super(message);
    }

    public KeycloakTokenException(String message, Throwable cause) {
        super(message, cause);
    }
}
