package com.renap.shared.integration.rh;

/**
 * Excepción lanzada cuando la API externa de RH devuelve un error
 * o no se puede completar la solicitud.
 */
public class RhApiException extends RuntimeException {

    public RhApiException(String message) {
        super(message);
    }

    public RhApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
