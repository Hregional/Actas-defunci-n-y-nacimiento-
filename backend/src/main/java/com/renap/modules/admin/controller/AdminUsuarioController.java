package com.renap.modules.admin.controller;

import com.renap.modules.admin.dto.ActualizarUsuarioRequest;
import com.renap.modules.admin.dto.CrearUsuarioRequest;
import com.renap.modules.admin.dto.UsuarioSistemaDTO;
import com.renap.modules.admin.service.KeycloakAdminClient;
import com.renap.modules.empleados.EmpleadoRhDTO;
import com.renap.shared.integration.rh.RhApiClient;
import com.renap.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints para el módulo superadmin de gestión de usuarios del sistema de actas.
 *
 * Todos los endpoints requieren el client role "actas-admin".
 *
 * GET  /admin/usuarios              → listar usuarios del sistema
 * GET  /admin/usuarios/empleados-rh → buscar empleados en la API de RH (para crear nuevos)
 * POST /admin/usuarios              → crear usuario
 * PUT  /admin/usuarios/{id}         → actualizar usuario (rol, password, habilitar)
 */
@Slf4j
@RestController
@RequestMapping("/admin/usuarios")
@RequiredArgsConstructor
@PreAuthorize("hasRole('actas-admin')")
public class AdminUsuarioController {

    private final KeycloakAdminClient keycloakAdmin;
    private final RhApiClient rhApiClient;

    /** Lista todos los usuarios que tienen acceso a este sistema. */
    @GetMapping
    public ResponseEntity<ApiResponse<List<UsuarioSistemaDTO>>> listar() {
        log.debug("GET /admin/usuarios");
        return ResponseEntity.ok(ApiResponse.ok(keycloakAdmin.listarUsuariosSistema()));
    }

    /**
     * Busca empleados en la API de RH usando el token del usuario logueado.
     * El token del usuario (no el service account) es el que reconoce la API de asistencia.
     */
    @GetMapping("/empleados-rh")
    public ResponseEntity<ApiResponse<List<EmpleadoRhDTO>>> buscarEmpleadosRh(
            @RequestParam(required = false) String q,
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        log.debug("GET /admin/usuarios/empleados-rh q={}", q);
        return ResponseEntity.ok(ApiResponse.ok(rhApiClient.buscarEmpleadosPorNombre(q, authorization)));
    }

    /** Crea un nuevo usuario en Keycloak y le asigna el client role indicado. */
    @PostMapping
    public ResponseEntity<ApiResponse<UsuarioSistemaDTO>> crear(
            @Valid @RequestBody CrearUsuarioRequest req) {
        log.debug("POST /admin/usuarios username={}", req.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(keycloakAdmin.crearUsuario(req)));
    }

    /** Actualiza rol, contraseña, habilitado/deshabilitado o atributos de un usuario. */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UsuarioSistemaDTO>> actualizar(
            @PathVariable String id,
            @Valid @RequestBody ActualizarUsuarioRequest req) {
        log.debug("PUT /admin/usuarios/{}", id);
        return ResponseEntity.ok(ApiResponse.ok(keycloakAdmin.actualizarUsuario(id, req)));
    }
}
