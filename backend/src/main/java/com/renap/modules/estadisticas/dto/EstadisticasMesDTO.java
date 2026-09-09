package com.renap.modules.estadisticas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class EstadisticasMesDTO {
    /** Etiqueta del período: "Ene", "Feb"... o "Lun", "Mar"... */
    private String periodo;
    /** Cantidad de nacimientos en ese período */
    private long nacimientos;
    /** Cantidad de defunciones en ese período */
    private long defunciones;
}
