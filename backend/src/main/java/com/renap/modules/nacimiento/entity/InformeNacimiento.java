package com.renap.modules.nacimiento.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "informe_nacimiento")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeNacimiento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "estado", length = 20)
    @Builder.Default
    private String estado = "BORRADOR";

    // Sección I: Datos del que suscribe
    @Column(name = "suscribe_nombres_apellidos")
    private String suscribeNombresApellidos;

    @Column(name = "suscribe_cui_cedula")
    private String suscribeCuiCedula;

    @Column(name = "suscribe_no_colegiado")
    private String suscribeNoColegiado;

    @Column(name = "suscribe_no_registro_comadrona")
    private String suscribeNoRegistroComadrona;

    @Column(name = "suscribe_quien_informa")
    private Integer suscribeQuienInforma;

    // Sección II: Lugar de nacimiento
    @Column(name = "lugar_departamento")
    private String lugarDepartamento;

    @Column(name = "lugar_municipio")
    private String lugarMunicipio;

    @Column(name = "lugar_direccion")
    private String lugarDireccion;

    @Column(name = "lugar_ocurrio_nacimiento")
    private Integer lugarOcurrioNacimiento;

    // Sección III: Datos del niño
    @Column(name = "nino_primer_nombre")
    private String ninoPrimerNombre;

    @Column(name = "nino_segundo_nombre")
    private String ninoSegundoNombre;

    @Column(name = "nino_tercer_nombre")
    private String ninoTercerNombre;

    @Column(name = "nino_primer_apellido")
    private String ninoPrimerApellido;

    @Column(name = "nino_segundo_apellido")
    private String ninoSegundoApellido;

    @Column(name = "nino_fecha_nacimiento")
    private LocalDate ninoFechaNacimiento;

    @Column(name = "nino_hora_nacimiento", length = 5)
    private String ninoHoraNacimiento;

    @Column(name = "nino_sexo")
    private Integer ninoSexo;

    @Column(name = "nino_peso_libras", precision = 5, scale = 2)
    private BigDecimal ninoPesoLibras;

    @Column(name = "nino_peso_onzas", precision = 5, scale = 2)
    private BigDecimal ninoPesoOnzas;

    @Column(name = "nino_talla_cm", precision = 5, scale = 2)
    private BigDecimal ninoTallaCm;

    @Column(name = "nino_edad_gestacional_semanas")
    private Integer ninoEdadGestacionalSemanas;

    @Column(name = "nino_anomalias_congenitas")
    private Integer ninoAnomaliasCongenitas;

    @Column(name = "nino_tipo_parto")
    private Integer ninoTipoParto;

    @Column(name = "nino_num_hijos_nacidos_parto")
    private Integer ninoNumHijosNacidosParto;

    @Column(name = "nino_persona_atendio_parto")
    private Integer ninoPersonaAtendioElParto;

    @Column(name = "nino_total_hijos_madre")
    private Integer ninoTotalHijosMadre;

    @Column(name = "nino_hijos_nacidos_muertos")
    private Integer ninoHijosNacidosMuertos;

    @Column(name = "nino_hijos_viven")
    private Integer ninoHijosViven;

    // Sección IV: Datos de la madre
    @Column(name = "madre_primer_nombre")
    private String madrePrimerNombre;

    @Column(name = "madre_segundo_nombre")
    private String madreSegundoNombre;

    @Column(name = "madre_primer_apellido")
    private String madrePrimerApellido;

    @Column(name = "madre_segundo_apellido")
    private String madreSegundoApellido;

    @Column(name = "madre_apellido_casada")
    private String madreApellidoCasada;

    @Column(name = "madre_cui_cedula")
    private String madreCuiCedula;

    @Column(name = "madre_edad")
    private Integer madreEdad;

    @Column(name = "madre_nacionalidad")
    private String madreNacionalidad;

    @Column(name = "madre_ocupacion")
    private String madreOcupacion;

    @Column(name = "madre_direccion")
    private String madreDireccion;

    @Column(name = "madre_zona")
    private String madreZona;

    @Column(name = "madre_municipio")
    private String madreMunicipio;

    @Column(name = "madre_departamento")
    private String madreDepartamento;

    @Column(name = "madre_pueblo_pertenencia")
    private Integer madrePuebloPertenencia;

    @Column(name = "madre_estado_civil")
    private Integer madreEstadoCivil;

    @Column(name = "madre_escolaridad")
    private Integer madreEscolaridad;

    // Sección V: Datos del padre
    @Column(name = "padre_primer_nombre")
    private String padrePrimerNombre;

    @Column(name = "padre_segundo_nombre")
    private String padreSegundoNombre;

    @Column(name = "padre_primer_apellido")
    private String padrePrimerApellido;

    @Column(name = "padre_segundo_apellido")
    private String padreSegundoApellido;

    @Column(name = "padre_cui_cedula")
    private String padreCuiCedula;

    @Column(name = "padre_edad")
    private Integer padreEdad;

    @Column(name = "padre_nacionalidad")
    private String padreNacionalidad;

    @Column(name = "padre_ocupacion")
    private String padreOcupacion;

    @Column(name = "padre_direccion")
    private String padreDireccion;

    @Column(name = "padre_zona")
    private String padreZona;

    @Column(name = "padre_municipio")
    private String padreMunicipio;

    @Column(name = "padre_departamento")
    private String padreDepartamento;

    @Column(name = "padre_pueblo_pertenencia")
    private Integer padrePuebloPertenencia;

    @Column(name = "padre_estado_civil")
    private Integer padreEstadoCivil;

    @Column(name = "padre_escolaridad")
    private Integer padreEscolaridad;
}
