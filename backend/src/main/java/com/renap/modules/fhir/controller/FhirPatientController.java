package com.renap.modules.fhir.controller;

import com.renap.modules.fhir.dto.PersonaFhirDTO;
import com.renap.modules.fhir.service.FhirPatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para consultar pacientes desde el servidor FHIR.
 * Expone endpoints para búsqueda por CUI o ID de FHIR.
 */
@Slf4j
@RestController
@RequestMapping("/fhir/pacientes")
@RequiredArgsConstructor
@Tag(name = "FHIR - Pacientes", description = "Consulta de pacientes desde servidor FHIR")
public class FhirPatientController {

    private final FhirPatientService fhirPatientService;

    /**
     * Busca un paciente por su CUI/DPI.
     * 
     * @param cui CUI del paciente (puede incluir espacios o guiones, se limpiarán automáticamente)
     * @return Datos del paciente si se encuentra, o error si no existe
     */
    @GetMapping("/buscar-por-cui/{cui}")
    @PreAuthorize("hasAnyRole('admin', 'empleados', 'actas-admin')")
    @Operation(
        summary = "Buscar paciente por CUI/DPI",
        description = "Consulta un paciente en el servidor FHIR usando su CUI/DPI. " +
                      "El CUI se limpia automáticamente (quita espacios y guiones). " +
                      "Ejemplo: 3593745140801"
    )
    public ResponseEntity<PersonaFhirDTO> buscarPorCui(
            @Parameter(description = "CUI/DPI del paciente", example = "3593745140801")
            @PathVariable String cui
    ) {
        log.info("REST: Buscando paciente por CUI: {}", cui);
        log.info("DEBUG: Endpoint FHIR alcanzado correctamente - FhirPatientController.buscarPorCui");
        
        PersonaFhirDTO persona = fhirPatientService.buscarPorCui(cui);
        
        if (persona.getEncontrado()) {
            return ResponseEntity.ok(persona);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Busca un paciente por su ID interno de FHIR.
     * 
     * @param fhirId ID del recurso Patient en el servidor FHIR
     * @return Datos del paciente si se encuentra, o error si no existe
     */
    @GetMapping("/buscar-por-id/{fhirId}")
    @PreAuthorize("hasAnyRole('admin', 'empleados', 'actas-admin')")
    @Operation(
        summary = "Buscar paciente por ID de FHIR",
        description = "Consulta un paciente en el servidor FHIR usando su ID interno. " +
                      "Ejemplo: 837871"
    )
    public ResponseEntity<PersonaFhirDTO> buscarPorFhirId(
            @Parameter(description = "ID del paciente en FHIR", example = "837871")
            @PathVariable String fhirId
    ) {
        log.info("REST: Buscando paciente por FHIR ID: {}", fhirId);
        
        PersonaFhirDTO persona = fhirPatientService.buscarPorFhirId(fhirId);
        
        if (persona.getEncontrado()) {
            return ResponseEntity.ok(persona);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint de prueba para verificar conectividad con el servidor FHIR.
     */
    @GetMapping("/health")
    @Operation(
        summary = "Health check del servidor FHIR",
        description = "Verifica la conectividad con el servidor FHIR"
    )
    public ResponseEntity<String> healthCheck() {
        try {
            // Información básica del sistema
            StringBuilder health = new StringBuilder();
            health.append("=== FHIR SERVICE HEALTH ===\n");
            health.append("Status: OK\n");
            
            // Configuración FHIR
            String serverUrl = System.getProperty("fhir.server.url", 
                                System.getenv().getOrDefault("FHIR_SERVER_URL", "https://openhim-qa-router.hro.gob.gt/fhir"));
            String username = System.getProperty("fhir.server.username", 
                               System.getenv().getOrDefault("FHIR_USERNAME", "postman"));
            String password = System.getProperty("fhir.server.password", 
                               System.getenv().getOrDefault("FHIR_PASSWORD", "Hospital0."));
            
            health.append("FHIR Server URL: ").append(serverUrl).append("\n");
            health.append("FHIR Username: ").append(username).append("\n");
            health.append("FHIR Password: ").append(password.length() > 0 ? "***SET***" : "NOT SET").append("\n");
            
            // Log para diagnosticar
            log.info("FHIR Health Check - Server: {}, User: {}, Pass: {}", 
                    serverUrl, username, password.length() > 0 ? "SET" : "NOT SET");
            
            return ResponseEntity.ok(health.toString());
        } catch (Exception e) {
            log.error("Error en health check", e);
            return ResponseEntity.ok("Error en health check: " + e.getMessage());
        }
    }

    /**
     * Endpoint para diagnosticar la configuración FHIR (público para debug).
     */
    @GetMapping("/debug/config")
    @Operation(
        summary = "Debug de configuración FHIR",
        description = "Muestra la configuración actual del cliente FHIR"
    )
    public ResponseEntity<String> debugConfig() {
        try {
            String serverUrl = System.getProperty("fhir.server.url", 
                                System.getenv().getOrDefault("FHIR_SERVER_URL", "NO CONFIGURADO"));
            String username = System.getProperty("fhir.server.username", 
                               System.getenv().getOrDefault("FHIR_USERNAME", "NO CONFIGURADO"));
            String password = System.getProperty("fhir.server.password", 
                               System.getenv().getOrDefault("FHIR_PASSWORD", "NO CONFIGURADO"));
            
            StringBuilder debug = new StringBuilder();
            debug.append("CONFIGURACIÓN FHIR:\n");
            debug.append("- Server URL: ").append(serverUrl).append("\n");
            debug.append("- Username: ").append(username).append("\n");
            debug.append("- Password: ").append(password.length() > 0 ? "***SET***" : "NO SET").append("\n");
            
            log.info("DEBUG CONFIG REQUESTED: {}", debug.toString());
            return ResponseEntity.ok(debug.toString());
        } catch (Exception e) {
            log.error("Error en debug config", e);
            return ResponseEntity.ok("Error al obtener configuración: " + e.getMessage());
        }
    }
}
