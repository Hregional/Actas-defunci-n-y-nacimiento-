package com.renap.shared.integration.icd;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades de la API ICD (CIE-11 de la OMS) expuesta vía OpenHIM.
 *
 * <pre>
 * icd-api:
 *   base-url: https://openhim-qa-router.hro.gob.gt/icd
 *   username: postman
 *   password: ...
 *   release: 2026-01
 * </pre>
 */
@Data
@ConfigurationProperties(prefix = "icd-api")
public class IcdApiProperties {

    /** URL base del servidor ICD (sin trailing slash). */
    private String baseUrl;

    /** Usuario de Basic Auth de OpenHIM. */
    private String username;

    /** Contraseña de Basic Auth de OpenHIM. */
    private String password;

    /** Versión de la linearización MMS de la CIE-11. */
    private String release = "2026-01";

    /** Idioma de los resultados. */
    private String language = "es";
}
