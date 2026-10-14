package com.renap.shared.integration.icd;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Cliente HTTP para la API ICD (CIE-11) de la OMS publicada en OpenHIM.
 *
 * <p>Llama a {@code GET {base-url}/release/11/{release}/mms/search?q=...}
 * con Basic Auth y devuelve solo las entidades que tienen código CIE-11.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings("null")
public class IcdApiClient {

    private final IcdApiProperties props;
    private final RestTemplate restTemplate;

    public List<IcdResultadoDTO> buscar(String q) {
        String url = UriComponentsBuilder
                .fromHttpUrl(props.getBaseUrl() + "/release/11/" + props.getRelease() + "/mms/search")
                .queryParam("q", q)
                .queryParam("lang", props.getLanguage())
                .encode()
                .toUriString();

        log.debug("GET ICD search: {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(props.getUsername(), props.getPassword());
        headers.set(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
        headers.set(HttpHeaders.ACCEPT_LANGUAGE, props.getLanguage());
        headers.set("API-Version", "v2");

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    url, HttpMethod.GET,
                    new HttpEntity<>(headers),
                    new ParameterizedTypeReference<>() {}
            );
            return extractResultados(response.getBody());

        } catch (RestClientException e) {
            log.error("Error al buscar en ICD q={}: {}", q, e.getMessage());
            throw new IcdApiException("Error al consultar la CIE-11: " + e.getMessage(), e);
        }
    }

    // ── privados ──────────────────────────────────────────────────────────

    /**
     * Respuesta esperada: { "destinationEntities": [ { "theCode", "title", "id", ... } ] }
     * El título trae resaltado HTML (<em class='found'>...</em>) que se elimina.
     */
    @SuppressWarnings("unchecked")
    private List<IcdResultadoDTO> extractResultados(Map<String, Object> body) {
        if (body == null) return Collections.emptyList();

        Object entities = body.get("destinationEntities");
        if (!(entities instanceof List<?> rawList)) return Collections.emptyList();

        return rawList.stream()
                .filter(item -> item instanceof Map)
                .map(item -> (Map<String, Object>) item)
                .filter(map -> map.get("theCode") != null && !map.get("theCode").toString().isBlank())
                .map(map -> IcdResultadoDTO.builder()
                        .codigo(map.get("theCode").toString())
                        .titulo(limpiarHtml(map.get("title")))
                        .uri(map.get("id") == null ? null : map.get("id").toString())
                        .build())
                .toList();
    }

    private String limpiarHtml(Object v) {
        return v == null ? null : v.toString().replaceAll("<[^>]+>", "").trim();
    }
}
