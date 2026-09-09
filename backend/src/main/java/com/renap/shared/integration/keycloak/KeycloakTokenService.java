package com.renap.shared.integration.keycloak;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Obtiene y renueva automáticamente el token de Keycloak usando
 * el flujo OAuth2 Client Credentials (grant_type=client_credentials).
 *
 * <p>El token se cachea en memoria y se renueva 30 segundos antes
 * de su expiración para evitar llamadas fallidas por token vencido.
 * Thread-safe mediante ReentrantLock.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class KeycloakTokenService {

    private static final int EXPIRY_BUFFER_SECONDS = 30;

    private final KeycloakProperties props;
    private final RestTemplate restTemplate;

    /** Token actualmente cacheado. */
    private volatile String cachedToken;

    /** Momento en que el token expira (según expires_in de la respuesta). */
    private volatile Instant tokenExpiresAt = Instant.EPOCH;

    private final ReentrantLock lock = new ReentrantLock();

    /**
     * Devuelve un Bearer token válido.
     * Si el token cacheado está por vencer (< 30 s) o ya venció, solicita uno nuevo.
     */
    public String getBearerToken() {
        if (isTokenValid()) {
            return cachedToken;
        }

        lock.lock();
        try {
            // Double-check tras adquirir el lock
            if (isTokenValid()) {
                return cachedToken;
            }
            refreshToken();
            return cachedToken;
        } finally {
            lock.unlock();
        }
    }

    // ── privados ──────────────────────────────────────────────────────────

    private boolean isTokenValid() {
        return cachedToken != null
                && Instant.now().isBefore(tokenExpiresAt.minusSeconds(EXPIRY_BUFFER_SECONDS));
    }

    private void refreshToken() {
        log.debug("Solicitando nuevo token a Keycloak: {}", props.tokenEndpoint());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "client_credentials");
        body.add("client_id", props.getClientId());
        body.add("client_secret", props.getClientSecret());

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        // Usar ParameterizedTypeReference evita el warning de raw Map
        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                props.tokenEndpoint(),
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<>() {}
        );

        Map<String, Object> tokenResponse = response.getBody();

        if (!response.getStatusCode().is2xxSuccessful() || tokenResponse == null) {
            throw new KeycloakTokenException(
                    "Keycloak devolvió " + response.getStatusCode() + " al solicitar token");
        }

        // Null-safe: si access_token no está presente lanzamos excepción clara
        Object accessTokenObj = tokenResponse.get("access_token");
        if (!(accessTokenObj instanceof String token)) {
            throw new KeycloakTokenException("Respuesta de Keycloak no contiene access_token válido");
        }
        cachedToken = token;

        Object expiresIn = tokenResponse.get("expires_in");
        long ttlSeconds = expiresIn instanceof Number num ? num.longValue() : 300L;
        tokenExpiresAt = Instant.now().plusSeconds(ttlSeconds);

        log.info("Token Keycloak renovado. Expira en {} s (a las {})", ttlSeconds, tokenExpiresAt);
    }
}
