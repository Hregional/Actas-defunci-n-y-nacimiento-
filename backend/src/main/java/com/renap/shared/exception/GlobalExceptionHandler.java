package com.renap.shared.exception;

import com.renap.shared.integration.keycloak.KeycloakTokenException;
import com.renap.shared.integration.rh.RhApiException;
import com.renap.shared.response.ApiResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Recurso no encontrado: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String field = ((FieldError) error).getField();
            String message = error.getDefaultMessage();
            errors.put(field, message);
        });
        log.warn("Errores de validación: {}", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.validationError("Errores de validación", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraint(ConstraintViolationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(ex.getMessage()));
    }

    /** Error al obtener token de Keycloak (credenciales inválidas, Keycloak caído, etc.). */
    @ExceptionHandler(KeycloakTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handleKeycloakToken(KeycloakTokenException ex) {
        log.error("Error de autenticación con Keycloak: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error("Servicio de autenticación no disponible temporalmente"));
    }

    /** Error al llamar a la API de RH (timeout, error HTTP, etc.). */
    @ExceptionHandler(RhApiException.class)
    public ResponseEntity<ApiResponse<Void>> handleRhApi(RhApiException ex) {
        log.error("Error en API de RH: {}", ex.getMessage());
        
        // Si la causa es UnknownContentTypeException, probablemente Cloudflare bloqueó
        if (ex.getCause() != null && ex.getCause().getClass().getSimpleName().contains("UnknownContentType")) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(ApiResponse.error("La API de RH devolvió HTML en lugar de JSON. Posiblemente Cloudflare bloqueó la petición."));
        }
        
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ApiResponse.error("No se pudo consultar el sistema de RH: " + ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception ex) {
        log.error("Error interno del servidor — {}: {}", ex.getClass().getSimpleName(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("Error interno: " + ex.getClass().getSimpleName() + " — " + ex.getMessage()));
    }
}
