package com.renap.modules.defuncion.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeDefuncionDTO {

    private Long id;
    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // ── Sección I: Información General ────────────────────────
    @NotBlank(message = "Nombre de quien informa es requerido")
    @Size(max = 255)
    private String infoQuienInformaNombres;

    @Size(max = 100)
    private String infoDocumentoIdentificacion;

    @Min(1) @Max(3)
    private Integer infoQuienInformaTipo;

    @Size(max = 50)
    private String infoNoColegiado;

    @NotNull(message = "Fecha de defunción es requerida")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate infoFechaDefuncion;

    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Hora debe tener formato HH:mm (24h)")
    private String infoHoraDefuncion;

    @Size(max = 255)
    private String infoLugarDireccion;

    @Size(max = 100)
    private String infoLugarMunicipio;

    @Size(max = 100)
    private String infoLugarDepartamento;

    // ── Sección II: Datos del fallecido ───────────────────────
    @NotBlank(message = "Nombre del fallecido es requerido")
    @Size(max = 255)
    private String fallecidoNombreCompleto;

    @Min(1) @Max(9)
    private Integer fallecidoSexo;

    @Min(0) @Max(23)
    private Integer fallecidoEdadHoras;

    @Min(1) @Max(29)
    private Integer fallecidoEdadDias;

    @Min(1) @Max(11)
    private Integer fallecidoEdadMeses;

    @Min(1)
    private Integer fallecidoEdadAnos;

    @Size(max = 100)
    private String fallecidoDocNumero;

    @Size(max = 50)
    private String fallecidoDocLibro;

    @Size(max = 50)
    private String fallecidoDocFolio;

    @Size(max = 50)
    private String fallecidoDocPartida;

    @Size(max = 100)
    private String fallecidoLugarNacPais;

    @Size(max = 100)
    private String fallecidoLugarNacDepartamento;

    @Size(max = 100)
    private String fallecidoLugarNacMunicipio;

    @Size(max = 100)
    private String fallecidoNacionalidad;

    @Size(max = 150)
    private String fallecidoOcupacion;

    @Min(1) @Max(9)
    private Integer fallecidoEstadoCivil;

    @Min(1) @Max(9)
    private Integer fallecidoPuebloPertenencia;

    @Size(max = 255)
    private String fallecidoResidenciaDireccion;

    @Size(max = 100)
    private String fallecidoResidenciaMunicipio;

    @Size(max = 100)
    private String fallecidoResidenciaDepartamento;

    @Min(0) @Max(9)
    private Integer fallecidoEscolaridad;

    // ── Sección III: Mujeres en edad fértil ───────────────────
    @Min(1) @Max(9)
    private Integer fertilMuerteDurante;

    // ── Sección IV: Causa de defunción ────────────────────────
    private String causaIa;
    private String causaIaIntervalo;
    private String causaIb;
    private String causaIbIntervalo;
    private String causaIc;
    private String causaIcIntervalo;
    private String causaId;
    private String causaIdIntervalo;
    private String causaIi;

    // ── Sección V: Defunciones accidentales ───────────────────
    @Min(1) @Max(9)
    private Integer accidentalFuePresunto;

    @Min(0) @Max(9)
    private Integer accidentalLugarLesion;

    @Min(1) @Max(9)
    private Integer accidentalOcurrioTrabajo;

    @Min(1) @Max(9)
    private Integer accidentalFueTransito;

    @Size(max = 255)
    private String accidentalArmaProdujo;

    // ── Sección VI: Mortinato — Datos de la madre ─────────────
    @Size(max = 255)
    private String mortinatoMadreNombre;

    @Size(max = 100)
    private String mortinatoMadreDocNumero;

    @Size(max = 50)
    private String mortinatoMadreDocLibro;

    @Size(max = 50)
    private String mortinatoMadreDocFolio;

    @Size(max = 50)
    private String mortinatoMadreDocPartida;

    @Size(max = 100)
    private String mortinatoMadreLugarNacPais;

    @Size(max = 100)
    private String mortinatoMadreLugarNacDepartamento;

    @Size(max = 100)
    private String mortinatoMadreLugarNacMunicipio;

    @Min(10) @Max(99)
    private Integer mortinatoMadreEdad;

    @Min(1) @Max(9)
    private Integer mortinatoMadreEstadoCivil;

    @Min(1) @Max(9)
    private Integer mortinatoMadrePuebloPertenencia;

    @Size(max = 255)
    private String mortinatoMadreResidenciaDireccion;

    @Size(max = 100)
    private String mortinatoMadreResidenciaMunicipio;

    @Size(max = 100)
    private String mortinatoMadreResidenciaDepartamento;

    @Size(max = 150)
    private String mortinatoMadreOcupacion;

    @Min(1) @Max(9)
    private Integer mortinatoMadreSabeLeer;

    @Min(0) @Max(9)
    private Integer mortinatoMadreEscolaridad;

    @Size(max = 100)
    private String mortinatoMadreNacionalidad;

    @Min(0)
    private Integer mortinatoEmbarazosNacidosVivos;

    @Min(0)
    private Integer mortinatoEmbarazosNacidosMuertos;

    // ── Sección VI: Mortinato — Datos del feto ────────────────
    @Min(1) @Max(9)
    private Integer mortinatoFetoSexo;

    @Min(1) @Max(2)
    private Integer mortinatoFetoMurio;

    @Min(1) @Max(3)
    private Integer mortinatoPartoFue;

    @Min(1) @Max(2)
    private Integer mortinatoClaseParto;

    @Min(1) @Max(2)
    private Integer mortinatoViaParto;

    @Min(1) @Max(45)
    private Integer mortinatoSemanasGestacion;

    private String mortinatoCausasFetales;
    private String mortinatoCausasMaternas;

    // ── Sección VII: Otros datos ──────────────────────────────
    @Min(1) @Max(2)
    private Integer otrosHuboNecropsia;

    @Min(1) @Max(9)
    private Integer otrosClaseAsistencia;

    @Min(1) @Max(9)
    private Integer otrosLugarDefuncion;
}
