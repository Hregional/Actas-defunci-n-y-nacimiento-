package com.renap.modules.estadisticas.controller;

import com.renap.modules.estadisticas.dto.EstadisticasMesDTO;
import com.renap.modules.estadisticas.dto.ResumenDTO;
import com.renap.modules.estadisticas.service.EstadisticasService;
import com.renap.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/estadisticas")
@RequiredArgsConstructor
public class EstadisticasController {

    private final EstadisticasService service;

    /** Resumen general: totales de nacimientos y defunciones */
    @GetMapping("/resumen")
    public ResponseEntity<ApiResponse<ResumenDTO>> resumen() {
        return ResponseEntity.ok(ApiResponse.ok(service.obtenerResumen()));
    }

    /** Registros agrupados por mes del año actual */
    @GetMapping("/por-mes")
    public ResponseEntity<ApiResponse<List<EstadisticasMesDTO>>> porMes(
            @RequestParam(defaultValue = "0") int anio) {
        int año = anio == 0 ? java.time.Year.now().getValue() : anio;
        return ResponseEntity.ok(ApiResponse.ok(service.obtenerPorMes(año)));
    }

    /** Registros de los últimos 7 días */
    @GetMapping("/ultima-semana")
    public ResponseEntity<ApiResponse<List<EstadisticasMesDTO>>> ultimaSemana() {
        return ResponseEntity.ok(ApiResponse.ok(service.obtenerUltimaSemana()));
    }
}
