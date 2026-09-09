package com.renap.modules.nacimiento.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeNacimientoDTO {

    private Long id;
    private String estado;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updatedAt;

    // ── Sección I ──────────────────────────────────────────────
    @NotBlank(message = "Nombres y apellidos son requeridos")
    @Size(max = 255)
    private String suscribeNombresApellidos;

    @Size(max = 100)
    private String suscribeCuiCedula;

    @Size(max = 50)
    private String suscribeNoColegiado;

    @Size(max = 50)
    private String suscribeNoRegistroComadrona;

    @Min(1) @Max(5)
    private Integer suscribeQuienInforma;

    // ── Sección II ─────────────────────────────────────────────
    @NotBlank(message = "Departamento es requerido")
    @Size(max = 100)
    private String lugarDepartamento;

    @NotBlank(message = "Municipio es requerido")
    @Size(max = 100)
    private String lugarMunicipio;

    @Size(max = 255)
    private String lugarDireccion;

    @Min(1) @Max(9)
    private Integer lugarOcurrioNacimiento;

    // ── Sección III ────────────────────────────────────────────
    @Size(max = 100)
    private String ninoPrimerNombre;

    @Size(max = 100)
    private String ninoSegundoNombre;

    @Size(max = 100)
    private String ninoTercerNombre;

    @Size(max = 100)
    private String ninoPrimerApellido;

    @Size(max = 100)
    private String ninoSegundoApellido;

    @NotNull(message = "Fecha de nacimiento es requerida")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ninoFechaNacimiento;

    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Hora debe tener formato HH:mm (24h)")
    private String ninoHoraNacimiento;

    @Min(1) @Max(2)
    private Integer ninoSexo;

    @DecimalMin("0.0")
    private BigDecimal ninoPesoLibras;

    @DecimalMin("0.0")
    private BigDecimal ninoPesoOnzas;

    @DecimalMin("0.0")
    private BigDecimal ninoTallaCm;

    @Min(20) @Max(45)
    private Integer ninoEdadGestacionalSemanas;

    @Min(1) @Max(2)
    private Integer ninoAnomaliasCongenitas;

    @Min(1) @Max(2)
    private Integer ninoTipoParto;

    @Min(1)
    private Integer ninoNumHijosNacidosParto;

    @Min(1) @Max(9)
    private Integer ninoPersonaAtendioElParto;

    @Min(0)
    private Integer ninoTotalHijosMadre;

    @Min(0)
    private Integer ninoHijosNacidosMuertos;

    @Min(0)
    private Integer ninoHijosViven;

    // ── Sección IV ─────────────────────────────────────────────
    @NotBlank(message = "Primer nombre de la madre es requerido")
    @Size(max = 100)
    private String madrePrimerNombre;

    @Size(max = 100)
    private String madreSegundoNombre;

    @NotBlank(message = "Primer apellido de la madre es requerido")
    @Size(max = 100)
    private String madrePrimerApellido;

    @Size(max = 100)
    private String madreSegundoApellido;

    @Size(max = 100)
    private String madreApellidoCasada;

    @Size(max = 100)
    private String madreCuiCedula;

    @Min(10) @Max(99)
    private Integer madreEdad;

    @Size(max = 100)
    private String madreNacionalidad;

    @Size(max = 150)
    private String madreOcupacion;

    @Size(max = 255)
    private String madreDireccion;

    @Size(max = 20)
    private String madreZona;

    @Size(max = 100)
    private String madreMunicipio;

    @Size(max = 100)
    private String madreDepartamento;

    @Min(1) @Max(5)
    private Integer madrePuebloPertenencia;

    @Min(1) @Max(6)
    private Integer madreEstadoCivil;

    @Min(1) @Max(5)
    private Integer madreEscolaridad;

    // ── Sección V ──────────────────────────────────────────────
    @Size(max = 100)
    private String padrePrimerNombre;

    @Size(max = 100)
    private String padreSegundoNombre;

    @Size(max = 100)
    private String padrePrimerApellido;

    @Size(max = 100)
    private String padreSegundoApellido;

    @Size(max = 100)
    private String padreCuiCedula;

    @Min(10) @Max(99)
    private Integer padreEdad;

    @Size(max = 100)
    private String padreNacionalidad;

    @Size(max = 150)
    private String padreOcupacion;

    @Size(max = 255)
    private String padreDireccion;

    @Size(max = 20)
    private String padreZona;

    @Size(max = 100)
    private String padreMunicipio;

    @Size(max = 100)
    private String padreDepartamento;

    @Min(1) @Max(5)
    private Integer padrePuebloPertenencia;

    @Min(1) @Max(6)
    private Integer padreEstadoCivil;

    @Min(1) @Max(5)
    private Integer padreEscolaridad;
}
