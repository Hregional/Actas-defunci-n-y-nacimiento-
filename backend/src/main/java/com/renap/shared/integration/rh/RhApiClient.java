package com.renap.shared.integration.rh;

import com.renap.modules.empleados.EmpleadoRhDTO;
import com.renap.shared.integration.keycloak.KeycloakTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Cliente HTTP para la API externa del sistema de RH del hospital.
 *
 * <p>Todas las solicitudes incluyen automáticamente el token Bearer
 * obtenido de Keycloak mediante {@link KeycloakTokenService}.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class RhApiClient {

    private final RhApiProperties props;
    private final KeycloakTokenService tokenService;
    private final RestTemplate restTemplate;

    /**
     * Busca empleados por nombre usando el token del usuario logueado.
     * La API de asistencia solo acepta tokens de usuarios reales, no service accounts.
     */
    public List<EmpleadoRhDTO> buscarEmpleadosPorNombre(String q, String bearerToken) {
        Optional<String> qOpt = Optional.ofNullable(q).filter(s -> !s.isBlank());
        String url = UriComponentsBuilder
                .fromHttpUrl(props.getBaseUrl() + "/api/empleados")
                .queryParamIfPresent("q", (Optional<?>) qOpt)
                .build()
                .toUriString();

        log.debug("GET empleados RH con token usuario: {}", url);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, bearerToken);
            headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
            headers.set(HttpHeaders.USER_AGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<>() {}
            );
            return extractData(response.getBody());

        } catch (HttpClientErrorException e) {
            log.error("Error HTTP {} al buscar empleados: {}", e.getStatusCode(), e.getMessage());
            throw new RhApiException("Error al consultar empleados: " + e.getStatusCode(), e);
        } catch (Exception e) {
            log.error("Error inesperado al buscar empleados: {} - {}", e.getClass().getSimpleName(), e.getMessage());
            throw new RhApiException("Error al conectar con API de RH: " + e.getMessage(), e);
        }
    }

    /**
     * Obtiene todos los empleados activos.
     * Llama a {@code GET /api/empleados}.
     *
     * @param q texto de búsqueda opcional (filtra por nombre en la API remota si soportado)
     */
    public List<EmpleadoRhDTO> listarEmpleados(String q) {
        // Optional.ofNullable + filter: el tipo inferido es Optional<String>, no Optional<?>
        // UriComponentsBuilder.queryParamIfPresent acepta Optional<?> — cast explícito a Optional<?>
        Optional<String> qOpt = Optional.ofNullable(q).filter(s -> !s.isBlank());

        String url = UriComponentsBuilder
                .fromHttpUrl(props.getBaseUrl() + "/api/empleados")
                .queryParamIfPresent("q", (Optional<?>) qOpt)
                .build()
                .toUriString();

        log.debug("GET empleados RH: {}", url);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    buildRequest(),
                    new ParameterizedTypeReference<>() {}
            );

            return extractData(response.getBody());

        } catch (HttpClientErrorException e) {
            log.error("Error HTTP {} al listar empleados RH: {}", e.getStatusCode(), e.getMessage());
            throw new RhApiException("Error al consultar empleados: " + e.getStatusCode(), e);
        }
    }

    /**
     * Busca empleado por DPI usando el token Bearer del usuario logueado
     * (en lugar del token de client_credentials).
     *
     * La API de asistencia devuelve datos completos cuando el token
     * es de un usuario real, no de un service account.
     */
    public EmpleadoRhDTO buscarPorDpiConToken(String dpi, String bearerToken) {
        String url = props.getBaseUrl() + "/api/empleados";
        log.debug("GET empleados con token de usuario para DPI={}", dpi);

        try {
            // Usar el token del usuario en lugar del de client_credentials
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.AUTHORIZATION, bearerToken);
            headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET, request,
                    new ParameterizedTypeReference<>() {}
            );

            List<EmpleadoRhDTO> todos = extractData(response.getBody());
            log.debug("Empleados recibidos con token usuario: {} — buscando DPI={}", todos.size(), dpi);

            return todos.stream()
                    .filter(e -> dpi.equals(e.getDpi()))
                    .findFirst()
                    .orElseThrow(() -> new RhApiException(
                            "No se encontró empleado con DPI=" + dpi));

        } catch (RhApiException e) {
            throw e;
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP {} al buscar con token usuario DPI={}: {}", e.getStatusCode(), dpi, e.getMessage());
            throw new RhApiException("Error al consultar empleado: " + e.getStatusCode(), e);
        }
    }

    /**
     * Busca un empleado por su DPI.
     *
     * <p>La API de asistencia no soporta filtrado por DPI — devuelve la lista
     * completa. Se trae toda la lista y se filtra en memoria por el DPI indicado.
     */
    public EmpleadoRhDTO buscarPorDpi(String dpi) {
        String url = props.getBaseUrl() + "/api/empleados";
        log.debug("GET todos los empleados para filtrar por DPI={}", dpi);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    buildRequest(),
                    new ParameterizedTypeReference<>() {}
            );

            List<EmpleadoRhDTO> todos = extractData(response.getBody());
            log.debug("Total empleados recibidos: {} — buscando DPI={}", todos.size(), dpi);

            return todos.stream()
                    .filter(e -> dpi.equals(e.getDpi()))
                    .findFirst()
                    .orElseThrow(() -> new RhApiException(
                            "No se encontró empleado con DPI=" + dpi + " en la API de RH"));

        } catch (RhApiException e) {
            throw e;
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP {} al buscar empleado por DPI: {}", e.getStatusCode(), e.getMessage());
            throw new RhApiException("Error al buscar empleado por DPI: " + e.getStatusCode(), e);
        }
    }

    /**
     * Obtiene un empleado por su ID.
     * Llama a {@code GET /api/empleados/:id}.
     */
    public EmpleadoRhDTO obtenerEmpleado(Long id) {
        String url = props.getBaseUrl() + "/api/empleados/" + id;

        log.debug("GET empleado RH id={}", id);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    buildRequest(),
                    new ParameterizedTypeReference<>() {}
            );

            List<EmpleadoRhDTO> data = extractData(response.getBody());
            if (data.isEmpty()) {
                throw new RhApiException("Empleado con id=" + id + " no encontrado en API RH");
            }
            return data.get(0);

        } catch (HttpClientErrorException.NotFound e) {
            throw new RhApiException("Empleado con id=" + id + " no encontrado en API RH", e);
        } catch (HttpClientErrorException e) {
            log.error("Error HTTP {} al obtener empleado id={}: {}", e.getStatusCode(), id, e.getMessage());
            throw new RhApiException("Error al consultar empleado: " + e.getStatusCode(), e);
        }
    }

    // ── privados ──────────────────────────────────────────────────────────

    private HttpEntity<Void> buildRequest() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(tokenService.getBearerToken());
        // Construir la lista con Arrays.asList evita el warning de @NonNull genérico
        headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        return new HttpEntity<>(headers);
    }

    /**
     * Extrae el campo "data" de la respuesta genérica de la API RH.
     * Respuesta esperada: { "success": true, "data": [...], "count": N }
     */
    @SuppressWarnings("unchecked")
    private List<EmpleadoRhDTO> extractData(Map<String, Object> body) {
        if (body == null) return Collections.emptyList();

        Object dataObj = body.get("data");
        if (!(dataObj instanceof List<?> rawList)) return Collections.emptyList();

        return rawList.stream()
                .filter(item -> item instanceof Map)
                .map(item -> mapToDto((Map<String, Object>) item))
                .toList();
    }

    private EmpleadoRhDTO mapToDto(Map<String, Object> map) {
        return EmpleadoRhDTO.builder()
                .id(toLong(map.get("id")))
                .numeroEmpleado(toStr(map.get("numero_empleado")))
                .nombreCompleto(toStr(map.get("nombre_completo")))
                .dpi(toStr(map.get("dpi")))
                .renglon(toStr(map.get("renglon")))
                .areaId(toLong(map.get("area_id")))
                .activo(toBool(map.get("activo")))
                .build();
    }

    private Long toLong(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.longValue();
        try { return Long.parseLong(v.toString()); } catch (NumberFormatException e) { return null; }
    }

    private String toStr(Object v) {
        return v == null ? null : v.toString();
    }

    private boolean toBool(Object v) {
        if (v instanceof Boolean b) return b;
        if (v instanceof Number n) return n.intValue() != 0;
        return Boolean.parseBoolean(toStr(v));
    }
}
