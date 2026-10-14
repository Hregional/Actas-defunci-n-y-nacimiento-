package com.renap.shared.integration.icd;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Resultado de búsqueda en la CIE-11.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IcdResultadoDTO {

    /** Código CIE-11 de clasificación (theCode), ej. "BA41.Z". */
    private String codigo;

    /** Título de la entidad sin etiquetas HTML. */
    private String titulo;

    /** URI de la entidad en la linearización MMS. */
    private String uri;
}
