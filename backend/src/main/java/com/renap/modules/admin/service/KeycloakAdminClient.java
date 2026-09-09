package com.renap.modules.admin.service;

import com.renap.modules.admin.dto.ActualizarUsuarioRequest;
import com.renap.modules.admin.dto.CrearUsuarioRequest;
import com.renap.modules.admin.dto.UsuarioSistemaDTO;
import com.renap.shared.integration.keycloak.KeycloakProperties;
import com.renap.shared.integration.keycloak.KeycloakTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Cliente para la Keycloak Admin REST API.
 *
 * Usa el token de client_credentials (service account del client sistema-actas)
 * por lo que ese client debe tener el scope "manage-users" en su service account.
 *
 * Endpoints usados:
 *  GET  /admin/realms/{realm}/clients?clientId={clientId}      → buscar el client UUID
 *  GET  /admin/realms/{realm}/clients/{id}/roles               → listar client roles
 *  GET  /admin/realms/{realm}/clients/{id}/roles/{role}/users  → usuarios por client role
 *  POST /admin/realms/{realm}/users                            → crear usuario
 *  PUT  /admin/realms/{realm}/users/{userId}                   → actualizar atributos
 *  PUT  /admin/realms/{realm}/users/{userId}/reset-password    → cambiar contraseña
 *  POST /admin/realms/{realm}/users/{userId}/role-mappings/clients/{id} → asignar client role
 *  DELETE /admin/realms/{realm}/users/{userId}/role-mappings/clients/{id} → quitar client role
 */
@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings({"null", "unchecked"})
public class KeycloakAdminClient {

    private static final List<String> ROLES_SISTEMA = List.of("actas-admin", "actas-empleado");

    private final KeycloakProperties props;
    private final KeycloakTokenService tokenService;
    private final RestTemplate restTemplate;

    /** URL base de Admin API para el realm configurado. */
    private String adminBase() {
        return props.getUrl() + "/admin/realms/" + props.getRealm();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // LISTAR usuarios de este sistema
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Devuelve todos los usuarios que tienen al menos uno de los client roles
     * de este sistema (actas-admin o actas-empleado).
     */
    public List<UsuarioSistemaDTO> listarUsuariosSistema() {
        String clientUuid = obtenerClientUuid();

        // Acumular usuarios por rol — no necesita obtenerClientRolesMeta
        Map<String, UsuarioSistemaDTO> porId = new LinkedHashMap<>();

        for (String roleName : ROLES_SISTEMA) {
            List<Map<String, Object>> keycloakUsers = getUsersByClientRole(clientUuid, roleName);
            for (Map<String, Object> ku : keycloakUsers) {
                String userId = str(ku.get("id"));
                UsuarioSistemaDTO existing = porId.get(userId);
                if (existing == null) {
                    existing = mapToDTO(ku, new ArrayList<>());
                    porId.put(userId, existing);
                }
                existing.getRoles().add(roleName);
            }
        }

        return new ArrayList<>(porId.values());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CREAR usuario
    // ─────────────────────────────────────────────────────────────────────────

    public UsuarioSistemaDTO crearUsuario(CrearUsuarioRequest req) {
        String clientUuid = obtenerClientUuid();

        // 1. Crear usuario en Keycloak
        Map<String, Object> body = new HashMap<>();
        body.put("username",      req.getUsername());
        body.put("enabled",       true);
        body.put("emailVerified", true);

        if (req.getEmail() != null && !req.getEmail().isBlank()) {
            body.put("email", req.getEmail());
        }

        // Separar nombre en firstName/lastName para Keycloak
        String[] partes = req.getNombreCompleto().trim().split("\\s+", 2);
        body.put("firstName", partes[0]);
        body.put("lastName",  partes.length > 1 ? partes[1] : "");

        // Atributos personalizados del sistema
        Map<String, List<String>> attrs = new HashMap<>();
        attrs.put("nombre_completo", List.of(req.getNombreCompleto()));
        attrs.put("cui",             List.of(req.getCui()));
        if (req.getNumeroEmpleado() != null) attrs.put("numero_empleado", List.of(req.getNumeroEmpleado()));
        if (req.getRenglon()        != null) attrs.put("renglon",         List.of(req.getRenglon()));
        body.put("attributes", attrs);

        ResponseEntity<Void> createResp = restTemplate.exchange(
                adminBase() + "/users",
                HttpMethod.POST,
                new HttpEntity<>(body, jsonHeaders()),
                Void.class
        );

        if (!createResp.getStatusCode().is2xxSuccessful()) {
            throw new IllegalStateException("Error al crear usuario en Keycloak: " + createResp.getStatusCode());
        }

        // 2. Obtener el UUID del usuario recién creado
        String userId = obtenerUserIdPorUsername(req.getUsername());

        // 3. Asignar contraseña temporal
        asignarPassword(userId, req.getPassword(), true);

        // 4. Asignar client role
        String roleName = req.getRol() != null ? req.getRol() : "actas-empleado";
        asignarClientRole(userId, clientUuid, roleName);

        log.info("Usuario '{}' creado en Keycloak con rol '{}'", req.getUsername(), roleName);

        return UsuarioSistemaDTO.builder()
                .id(userId)
                .username(req.getUsername())
                .nombreCompleto(req.getNombreCompleto())
                .cui(req.getCui())
                .numeroEmpleado(req.getNumeroEmpleado())
                .renglon(req.getRenglon())
                .email(req.getEmail())
                .roles(List.of(roleName))
                .habilitado(true)
                .build();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ACTUALIZAR usuario
    // ─────────────────────────────────────────────────────────────────────────

    public UsuarioSistemaDTO actualizarUsuario(String userId, ActualizarUsuarioRequest req) {
        String clientUuid = obtenerClientUuid();

        // Traer datos actuales
        Map<String, Object> current = obtenerUsuarioPorId(userId);
        Map<String, Object> attrs = (Map<String, Object>) current.getOrDefault("attributes", new HashMap<>());
        Map<String, Object> update = new HashMap<>();

        // Actualizar atributos si vienen
        Map<String, List<String>> newAttrs = new HashMap<>();
        copyAttr(attrs, newAttrs, "nombre_completo");
        copyAttr(attrs, newAttrs, "cui");
        copyAttr(attrs, newAttrs, "numero_empleado");
        copyAttr(attrs, newAttrs, "renglon");

        if (req.getNombreCompleto() != null) newAttrs.put("nombre_completo", List.of(req.getNombreCompleto()));
        if (req.getNumeroEmpleado() != null) newAttrs.put("numero_empleado", List.of(req.getNumeroEmpleado()));
        if (req.getRenglon()        != null) newAttrs.put("renglon",         List.of(req.getRenglon()));

        update.put("attributes", newAttrs);

        if (req.getHabilitado() != null) {
            update.put("enabled", req.getHabilitado());
        }

        restTemplate.exchange(
                adminBase() + "/users/" + userId,
                HttpMethod.PUT,
                new HttpEntity<>(update, jsonHeaders()),
                Void.class
        );

        // Cambiar contraseña si viene
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            asignarPassword(userId, req.getPassword(), true);
        }

        // Cambiar rol si viene
        if (req.getRol() != null) {
            // Quitar roles actuales del sistema
            for (String r : ROLES_SISTEMA) {
                try { quitarClientRole(userId, clientUuid, r); }
                catch (Exception ignored) {}
            }
            asignarClientRole(userId, clientUuid, req.getRol());
        }

        log.info("Usuario '{}' actualizado", userId);

        // Devolver datos actualizados
        Map<String, Object> updated = obtenerUsuarioPorId(userId);
        return mapToDTO(updated, obtenerRolesDeUsuario(userId, clientUuid));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Métodos de soporte privados
    // ─────────────────────────────────────────────────────────────────────────

    private String obtenerClientUuid() {
        return props.getFrontendClientUuid();
    }

    private Map<String, Map<String, Object>> obtenerClientRolesMeta(String clientUuid) {
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                adminBase() + "/clients/" + clientUuid + "/roles",
                HttpMethod.GET,
                new HttpEntity<>(authHeaders()),
                new ParameterizedTypeReference<>() {}
        );
        Map<String, Map<String, Object>> result = new HashMap<>();
        if (resp.getBody() != null) {
            for (Map<String, Object> role : resp.getBody()) {
                result.put(str(role.get("name")), role);
            }
        }
        return result;
    }

    private List<Map<String, Object>> getUsersByClientRole(String clientUuid, String roleName) {
        try {
            ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                    adminBase() + "/clients/" + clientUuid + "/roles/" + roleName + "/users?max=500",
                    HttpMethod.GET,
                    new HttpEntity<>(authHeaders()),
                    new ParameterizedTypeReference<>() {}
            );
            return resp.getBody() != null ? resp.getBody() : Collections.emptyList();
        } catch (HttpClientErrorException e) {
            log.warn("No se pudieron obtener usuarios del rol '{}': {}", roleName, e.getMessage());
            return Collections.emptyList();
        }
    }

    private String obtenerUserIdPorUsername(String username) {
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                adminBase() + "/users?username=" + username + "&exact=true&max=1",
                HttpMethod.GET,
                new HttpEntity<>(authHeaders()),
                new ParameterizedTypeReference<>() {}
        );
        List<Map<String, Object>> users = resp.getBody();
        if (users == null || users.isEmpty()) {
            throw new IllegalStateException("No se encontró el usuario recién creado: " + username);
        }
        return str(users.get(0).get("id"));
    }

    private Map<String, Object> obtenerUsuarioPorId(String userId) {
        ResponseEntity<Map<String, Object>> resp = restTemplate.exchange(
                adminBase() + "/users/" + userId,
                HttpMethod.GET,
                new HttpEntity<>(authHeaders()),
                new ParameterizedTypeReference<>() {}
        );
        return resp.getBody() != null ? resp.getBody() : Collections.emptyMap();
    }

    private List<String> obtenerRolesDeUsuario(String userId, String clientUuid) {
        try {
            ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                    adminBase() + "/users/" + userId + "/role-mappings/clients/" + clientUuid,
                    HttpMethod.GET,
                    new HttpEntity<>(authHeaders()),
                    new ParameterizedTypeReference<>() {}
            );
            if (resp.getBody() == null) return Collections.emptyList();
            return resp.getBody().stream()
                    .map(r -> str(r.get("name")))
                    .filter(ROLES_SISTEMA::contains)
                    .toList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    private void asignarPassword(String userId, String password, boolean temporary) {
        Map<String, Object> body = Map.of(
                "type",      "password",
                "value",     password,
                "temporary", temporary
        );
        restTemplate.exchange(
                adminBase() + "/users/" + userId + "/reset-password",
                HttpMethod.PUT,
                new HttpEntity<>(body, jsonHeaders()),
                Void.class
        );
    }

    private void asignarClientRole(String userId, String clientUuid, String roleName) {
        Map<String, Map<String, Object>> rolesMeta = obtenerClientRolesMeta(clientUuid);
        Map<String, Object> role = rolesMeta.get(roleName);
        if (role == null) {
            throw new IllegalArgumentException("Rol '" + roleName + "' no existe en el client");
        }
        restTemplate.exchange(
                adminBase() + "/users/" + userId + "/role-mappings/clients/" + clientUuid,
                HttpMethod.POST,
                new HttpEntity<>(List.of(role), jsonHeaders()),
                Void.class
        );
    }

    private void quitarClientRole(String userId, String clientUuid, String roleName) {
        Map<String, Map<String, Object>> rolesMeta = obtenerClientRolesMeta(clientUuid);
        Map<String, Object> role = rolesMeta.get(roleName);
        if (role == null) return;
        restTemplate.exchange(
                adminBase() + "/users/" + userId + "/role-mappings/clients/" + clientUuid,
                HttpMethod.DELETE,
                new HttpEntity<>(List.of(role), jsonHeaders()),
                Void.class
        );
    }

    private void copyAttr(Map<String, Object> src, Map<String, List<String>> dst, String key) {
        Object val = src.get(key);
        if (val instanceof List<?> list && !list.isEmpty()) {
            List<String> strList = (List<String>) list;
            dst.put(key, strList);
        }
    }

    private UsuarioSistemaDTO mapToDTO(Map<String, Object> ku, List<String> roles) {
        Map<String, Object> attrs = (Map<String, Object>) ku.getOrDefault("attributes", Collections.emptyMap());
        return UsuarioSistemaDTO.builder()
                .id(str(ku.get("id")))
                .username(str(ku.get("username")))
                .email(str(ku.get("email")))
                .nombreCompleto(firstAttr(attrs, "nombre_completo"))
                .cui(firstAttr(attrs, "cui"))
                .numeroEmpleado(firstAttr(attrs, "numero_empleado"))
                .renglon(firstAttr(attrs, "renglon"))
                .habilitado(Boolean.TRUE.equals(ku.get("enabled")))
                .roles(new ArrayList<>(roles))
                .build();
    }

    private String firstAttr(Map<String, Object> attrs, String key) {
        Object val = attrs.get(key);
        if (val instanceof List<?> list && !list.isEmpty()) return str(list.get(0));
        return val != null ? str(val) : null;
    }

    private HttpHeaders authHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setBearerAuth(tokenService.getBearerToken());
        return h;
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders h = new HttpHeaders();
        h.setBearerAuth(tokenService.getBearerToken());
        h.setContentType(MediaType.APPLICATION_JSON);
        return h;
    }

    private String str(Object v) {
        return v != null ? v.toString() : "";
    }
}
