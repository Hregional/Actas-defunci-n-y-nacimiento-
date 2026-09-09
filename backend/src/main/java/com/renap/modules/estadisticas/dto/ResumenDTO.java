package com.renap.modules.estadisticas.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter @Builder @NoArgsConstructor @AllArgsConstructor
public class ResumenDTO {
    private long totalNacimientos;
    private long totalDefunciones;
    private long totalGeneral;
    private int anioActual;
    private String mesActual;
}
