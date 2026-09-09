package com.renap.modules.defuncion.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeDefuncionListDTO {
    private Long id;
    private String estado;
    private String fallecidoNombreCompleto;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate infoFechaDefuncion;
    private String infoLugarDepartamento;
    private String infoLugarMunicipio;
    private String infoQuienInformaNombres;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
