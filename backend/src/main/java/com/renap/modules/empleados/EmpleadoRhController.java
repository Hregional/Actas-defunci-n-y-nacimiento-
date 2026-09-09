package com.renap.modules.empleados;

import com.renap.shared.integration.rh.RhApiClient;
import com.renap.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Proxy interno que expone los empleados del sistema de RH al frontend.
 *
 * El frontend llama a este endpoint para no exponer directamente
 * la URL ni las credenciales del sistema de RH al navegador.
 */
@Slf4j
@RestController
@RequestMapping("/empleados-rh")
@RequiredArgsConstructor
public class EmpleadoRhController {

    private final RhApiClient rhApiClient;

    /**
     * Lista empleados activos usando token de client_credentials.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<EmpleadoRhDTO>>> listar(
            @RequestParam(required = false) String q) {
        log.debug("GET /empleados-rh q={}", q);
        List<EmpleadoRhDTO> empleados = rhApiClient.listarEmpleados(q);
        return ResponseEntity.ok(ApiResponse.ok(empleados));
    }

    /**
     * Obtiene un empleado por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EmpleadoRhDTO>> obtener(@PathVariable Long id) {
        log.debug("GET /empleados-rh/{}", id);
        EmpleadoRhDTO empleado = rhApiClient.obtenerEmpleado(id);
        return ResponseEntity.ok(ApiResponse.ok(empleado));
    }

    /**
     * Busca empleado por DPI usando token de client_credentials (filtra en memoria).
     */
    @GetMapping("/por-dpi/{dpi}")
    public ResponseEntity<ApiResponse<EmpleadoRhDTO>> obtenerPorDpi(@PathVariable String dpi) {
        log.debug("GET /empleados-rh/por-dpi/{}", dpi);
        EmpleadoRhDTO empleado = rhApiClient.buscarPorDpi(dpi);
        return ResponseEntity.ok(ApiResponse.ok(empleado));
    }

    /**
     * Busca empleado por DPI usando el token Bearer del USUARIO LOGUEADO.
     *
     * Este endpoint recibe el token del usuario del frontend y lo reenvía
     * directamente a la API de asistencia. Así la API de asistencia lo acepta
     * como si el usuario estuviera llamando directamente.
     *
     * @param authorization  Header "Authorization: Bearer <token_del_usuario>"
     * @param dpi           DPI del empleado a buscar
     */
    @GetMapping("/me/{dpi}")
    public ResponseEntity<ApiResponse<EmpleadoRhDTO>> obtenerMiEmpleado(
            @RequestHeader("Authorization") String authorization,
            @PathVariable String dpi) {
        log.debug("GET /empleados-rh/me/{} — usando token del usuario", dpi);
        EmpleadoRhDTO empleado = rhApiClient.buscarPorDpiConToken(dpi, authorization);
        return ResponseEntity.ok(ApiResponse.ok(empleado));
    }
}
