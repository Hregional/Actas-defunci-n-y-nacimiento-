package com.renap.modules.nacimiento.controller;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.dto.InformeNacimientoListDTO;
import com.renap.modules.nacimiento.service.InformeNacimientoService;
import com.renap.shared.response.ApiResponse;
import com.renap.shared.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nacimientos")
@RequiredArgsConstructor
public class InformeNacimientoController {

    private final InformeNacimientoService service;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<InformeNacimientoListDTO>>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.ok(service.buscar(search, estado, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InformeNacimientoDTO>> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(service.obtenerPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InformeNacimientoDTO>> crear(
            @Valid @RequestBody InformeNacimientoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Informe de nacimiento creado exitosamente", service.crear(dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InformeNacimientoDTO>> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody InformeNacimientoDTO dto) {
        return ResponseEntity.ok(ApiResponse.ok("Informe actualizado exitosamente", service.actualizar(id, dto)));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<ApiResponse<InformeNacimientoDTO>> cambiarEstado(
            @PathVariable Long id,
            @RequestParam String estado) {
        return ResponseEntity.ok(ApiResponse.ok("Estado actualizado", service.cambiarEstado(id, estado)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok(ApiResponse.ok("Informe eliminado exitosamente", null));
    }
}
