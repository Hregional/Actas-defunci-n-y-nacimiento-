package com.renap.shared.integration.rh;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades de la API externa de RH leídas desde application.yml.
 *
 * <pre>
 * rh-api:
 *   base-url: https://host-produccion
 *   connect-timeout-ms: 5000
 *   read-timeout-ms: 10000
 * </pre>
 */
@Data
@ConfigurationProperties(prefix = "rh-api")
public class RhApiProperties {

    /** URL base del sistema de RH (sin trailing slash). */
    private String baseUrl;

    /** Timeout de conexión en milisegundos. */
    private int connectTimeoutMs = 5000;

    /** Timeout de lectura en milisegundos. */
    private int readTimeoutMs = 10000;
}
