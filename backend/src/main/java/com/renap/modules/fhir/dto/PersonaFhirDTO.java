package com.renap.modules.fhir.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO que representa los datos de una persona obtenidos desde el servidor FHIR.
 * Mapea recursos FHIR Patient a una estructura simplificada para el sistema.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonaFhirDTO {
    
    // Identificación
    private String cui;                    // CUI/DPI (identifier)
    private String fhirId;                 // ID interno del recurso FHIR
    
    // Datos personales
    private String nombreCompleto;         // Nombre completo formateado
    private String primerNombre;
    private String segundoNombre;
    private String tercerNombre;
    private String primerApellido;
    private String segundoApellido;
    private String apellidoCasada;
    
    // Información demográfica
    private String sexo;                   // "male" | "female" | "other" | "unknown"
    private LocalDate fechaNacimiento;
    private Integer edad;                  // Calculada a partir de fecha de nacimiento
    
    // Dirección
    private String direccion;              // Línea completa de dirección
    private String departamento;           // De address.state
    private String municipio;              // De address.city
    private String pais;                   // De address.country
    
    // Contacto
    private String telefono;
    private String email;
    
    // Datos adicionales
    private String nacionalidad;           // De extension
    private String estadoCivil;            // "never_married" | "married" | "divorced" | "widowed"
    private String puebloPertenencia;      // De extension (etnicity)
    private String ocupacion;              // De extension
    
    // Metadatos
    private Boolean encontrado;            // Indica si se encontró el paciente
    private String mensajeError;           // Mensaje de error si no se encontró
}
