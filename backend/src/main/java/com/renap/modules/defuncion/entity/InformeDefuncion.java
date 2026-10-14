package com.renap.modules.defuncion.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "informe_defuncion")
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InformeDefuncion {

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

    // Sección I: Información general
    @Column(name = "info_quien_informa_nombres", length = 255)
    private String infoQuienInformaNombres;

    @Column(name = "info_documento_identificacion", length = 100)
    private String infoDocumentoIdentificacion;

    @Column(name = "info_quien_informa_tipo")
    private Integer infoQuienInformaTipo;

    @Column(name = "info_no_colegiado", length = 50)
    private String infoNoColegiado;

    @Column(name = "info_fecha_defuncion")
    private LocalDate infoFechaDefuncion;

    @Column(name = "info_hora_defuncion", length = 5)
    private String infoHoraDefuncion;

    @Column(name = "info_lugar_direccion", length = 255)
    private String infoLugarDireccion;

    @Column(name = "info_lugar_municipio", length = 100)
    private String infoLugarMunicipio;

    @Column(name = "info_lugar_departamento", length = 100)
    private String infoLugarDepartamento;

    // Sección II: Datos del fallecido
    @Column(name = "fallecido_nombre_completo", length = 255)
    private String fallecidoNombreCompleto;

    @Column(name = "fallecido_sexo")
    private Integer fallecidoSexo;

    @Column(name = "fallecido_edad_horas")
    private Integer fallecidoEdadHoras;

    @Column(name = "fallecido_edad_dias")
    private Integer fallecidoEdadDias;

    @Column(name = "fallecido_edad_meses")
    private Integer fallecidoEdadMeses;

    @Column(name = "fallecido_edad_anos")
    private Integer fallecidoEdadAnos;

    @Column(name = "fallecido_doc_numero", length = 13)
    private String fallecidoDocNumero;

    @Column(name = "fallecido_doc_libro", length = 50)
    private String fallecidoDocLibro;

    @Column(name = "fallecido_doc_folio", length = 50)
    private String fallecidoDocFolio;

    @Column(name = "fallecido_doc_partida", length = 50)
    private String fallecidoDocPartida;

    @Column(name = "fallecido_lugar_nac_pais", length = 100)
    private String fallecidoLugarNacPais;

    @Column(name = "fallecido_lugar_nac_departamento", length = 100)
    private String fallecidoLugarNacDepartamento;

    @Column(name = "fallecido_lugar_nac_municipio", length = 100)
    private String fallecidoLugarNacMunicipio;

    @Column(name = "fallecido_nacionalidad", length = 100)
    private String fallecidoNacionalidad;

    @Column(name = "fallecido_ocupacion", length = 150)
    private String fallecidoOcupacion;

    @Column(name = "fallecido_estado_civil")
    private Integer fallecidoEstadoCivil;

    @Column(name = "fallecido_pueblo_pertenencia")
    private Integer fallecidoPuebloPertenencia;

    @Column(name = "fallecido_residencia_direccion", length = 255)
    private String fallecidoResidenciaDireccion;

    @Column(name = "fallecido_residencia_municipio", length = 100)
    private String fallecidoResidenciaMunicipio;

    @Column(name = "fallecido_residencia_departamento", length = 100)
    private String fallecidoResidenciaDepartamento;

    @Column(name = "fallecido_escolaridad")
    private Integer fallecidoEscolaridad;

    // Sección III: Mujeres en edad fértil
    @Column(name = "fertil_muerte_durante")
    private Integer fertilMuerteDurante;

    // Sección IV: Causa de defunción
    @Column(name = "causa_i_a", columnDefinition = "TEXT")
    private String causaIa;

    @Column(name = "causa_i_a_intervalo", length = 100)
    private String causaIaIntervalo;

    @Column(name = "causa_i_b", columnDefinition = "TEXT")
    private String causaIb;

    @Column(name = "causa_i_b_intervalo", length = 100)
    private String causaIbIntervalo;

    @Column(name = "causa_i_c", columnDefinition = "TEXT")
    private String causaIc;

    @Column(name = "causa_i_c_intervalo", length = 100)
    private String causaIcIntervalo;

    @Column(name = "causa_i_d", columnDefinition = "TEXT")
    private String causaId;

    @Column(name = "causa_i_d_intervalo", length = 100)
    private String causaIdIntervalo;

    @Column(name = "causa_ii", columnDefinition = "TEXT")
    private String causaIi;

    // Códigos CIE-11 de cada causa (NULL si la causa se escribió sin seleccionar de la CIE-11)
    @Column(name = "causa_i_a_cie11", length = 50)
    private String causaIaCie11;

    @Column(name = "causa_i_b_cie11", length = 50)
    private String causaIbCie11;

    @Column(name = "causa_i_c_cie11", length = 50)
    private String causaIcCie11;

    @Column(name = "causa_i_d_cie11", length = 50)
    private String causaIdCie11;

    @Column(name = "causa_ii_cie11", length = 50)
    private String causaIiCie11;

    // Sección V: Defunciones accidentales y violentas
    @Column(name = "accidental_fue_presunto")
    private Integer accidentalFuePresunto;

    @Column(name = "accidental_lugar_lesion")
    private Integer accidentalLugarLesion;

    @Column(name = "accidental_ocurrio_trabajo")
    private Integer accidentalOcurrioTrabajo;

    @Column(name = "accidental_fue_transito")
    private Integer accidentalFueTransito;

    @Column(name = "accidental_arma_produjo", length = 255)
    private String accidentalArmaProdujo;

    // Sección VI: Datos de la defunción fetal (mortinato)
    @Column(name = "mortinato_madre_nombre", length = 255)
    private String mortinatoMadreNombre;

    @Column(name = "mortinato_madre_doc_numero", length = 13)
    private String mortinatoMadreDocNumero;

    @Column(name = "mortinato_madre_doc_libro", length = 50)
    private String mortinatoMadreDocLibro;

    @Column(name = "mortinato_madre_doc_folio", length = 50)
    private String mortinatoMadreDocFolio;

    @Column(name = "mortinato_madre_doc_partida", length = 50)
    private String mortinatoMadreDocPartida;

    @Column(name = "mortinato_madre_lugar_nac_pais", length = 100)
    private String mortinatoMadreLugarNacPais;

    @Column(name = "mortinato_madre_lugar_nac_departamento", length = 100)
    private String mortinatoMadreLugarNacDepartamento;

    @Column(name = "mortinato_madre_lugar_nac_municipio", length = 100)
    private String mortinatoMadreLugarNacMunicipio;

    @Column(name = "mortinato_madre_edad")
    private Integer mortinatoMadreEdad;

    @Column(name = "mortinato_madre_estado_civil")
    private Integer mortinatoMadreEstadoCivil;

    @Column(name = "mortinato_madre_pueblo_pertenencia")
    private Integer mortinatoMadrePuebloPertenencia;

    @Column(name = "mortinato_madre_residencia_direccion", length = 255)
    private String mortinatoMadreResidenciaDireccion;

    @Column(name = "mortinato_madre_residencia_municipio", length = 100)
    private String mortinatoMadreResidenciaMunicipio;

    @Column(name = "mortinato_madre_residencia_departamento", length = 100)
    private String mortinatoMadreResidenciaDepartamento;

    @Column(name = "mortinato_madre_ocupacion", length = 150)
    private String mortinatoMadreOcupacion;

    @Column(name = "mortinato_madre_sabe_leer")
    private Integer mortinatoMadreSabeLeer;

    @Column(name = "mortinato_madre_escolaridad")
    private Integer mortinatoMadreEscolaridad;

    @Column(name = "mortinato_madre_nacionalidad", length = 100)
    private String mortinatoMadreNacionalidad;

    @Column(name = "mortinato_embarazos_nacidos_vivos")
    private Integer mortinatoEmbarazosNacidosVivos;

    @Column(name = "mortinato_embarazos_nacidos_muertos")
    private Integer mortinatoEmbarazosNacidosMuertos;

    @Column(name = "mortinato_feto_sexo")
    private Integer mortinatoFetoSexo;

    @Column(name = "mortinato_feto_murio")
    private Integer mortinatoFetoMurio;

    @Column(name = "mortinato_parto_fue")
    private Integer mortinatoPartoFue;

    @Column(name = "mortinato_clase_parto")
    private Integer mortinatoClaseParto;

    @Column(name = "mortinato_via_parto")
    private Integer mortinatoViaParto;

    @Column(name = "mortinato_semanas_gestacion")
    private Integer mortinatoSemanasGestacion;

    @Column(name = "mortinato_causas_fetales", columnDefinition = "TEXT")
    private String mortinatoCausasFetales;

    @Column(name = "mortinato_causas_maternas", columnDefinition = "TEXT")
    private String mortinatoCausasMaternas;

    // Sección VII: Otros datos de la defunción
    @Column(name = "otros_hubo_necropsia")
    private Integer otrosHuboNecropsia;

    @Column(name = "otros_clase_asistencia")
    private Integer otrosClaseAsistencia;

    @Column(name = "otros_lugar_defuncion")
    private Integer otrosLugarDefuncion;
}
