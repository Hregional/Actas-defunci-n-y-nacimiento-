package com.renap.modules.nacimiento.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO liviano para la vista de lista (no carga todos los campos).
 */
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeNacimientoListDTO {
    private Long    id;
    private String  estado;
    private String  ninoNombreCompleto;
    private String  ninoPrimerApellido;
    private Integer ninoSexo;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ninoFechaNacimiento;
    private String  lugarDepartamento;
    private String  lugarMunicipio;
    private String  madrePrimerNombre;
    private String  madrePrimerApellido;
    private String  suscribeNombresApellidos;
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;
}
