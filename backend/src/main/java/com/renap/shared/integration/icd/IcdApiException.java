package com.renap.shared.integration.icd;

/**
 * Excepción lanzada cuando la API ICD devuelve un error
 * o no se puede completar la solicitud.
 */
public class IcdApiException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public IcdApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
