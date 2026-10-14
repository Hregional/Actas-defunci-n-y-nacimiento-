package com.renap.modules.icd;

import com.renap.shared.integration.icd.IcdApiClient;
import com.renap.shared.integration.icd.IcdResultadoDTO;
import com.renap.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Proxy interno que expone la búsqueda de la CIE-11 al frontend.
 *
 * El frontend llama a este endpoint para no exponer al navegador
 * las credenciales de OpenHIM con las que se consulta la API ICD.
 */
@Slf4j
@RestController
@RequestMapping("/icd")
@RequiredArgsConstructor
public class IcdController {

    private static final int MIN_CARACTERES = 3;

    private final IcdApiClient icdApiClient;

    /**
     * Busca entidades de la CIE-11 cuyo título coincida con el texto.
     * Con menos de 3 caracteres devuelve una lista vacía sin llamar a la API.
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse<List<IcdResultadoDTO>>> buscar(@RequestParam String q) {
        String texto = q.trim();
        if (texto.length() < MIN_CARACTERES) {
            return ResponseEntity.ok(ApiResponse.ok(List.of()));
        }
        log.debug("GET /icd/buscar q={}", texto);
        return ResponseEntity.ok(ApiResponse.ok(icdApiClient.buscar(texto)));
    }
}
