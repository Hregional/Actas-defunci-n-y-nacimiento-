package com.renap.shared.integration.keycloak;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Propiedades de conexión a Keycloak leídas desde application.yml.
 *
 * <pre>
 * keycloak:
 *   url: https://sso.hro.gob.gt
 *   realm: Hospital-O
 *   client-id: sistema-actas
 *   client-secret: ***
 * </pre>
 */
@Data
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {

    /** URL base del servidor Keycloak (sin trailing slash). */
    private String url;

    /** Nombre del realm donde está registrado el client. */
    private String realm;

    /** client_id del client confidencial con Service Accounts habilitadas. */
    private String clientId;

    /** client_secret copiado de la pestaña Credentials en Keycloak. */
    private String clientSecret;

    /**
     * UUID interno del client sistema-actas-frontend.
     * Configurable via KEYCLOAK_FRONTEND_CLIENT_UUID para evitar hardcodeo.
     * Se obtiene de la URL al abrir el client en la consola de Keycloak.
     */
    private String frontendClientUuid;

    /**
     * Devuelve la URL completa del token endpoint para grant_type=client_credentials.
     * Ejemplo: https://sso.hro.gob.gt/realms/Hospital-O/protocol/openid-connect/token
     */
    public String tokenEndpoint() {
        return url + "/realms/" + realm + "/protocol/openid-connect/token";
    }
}
