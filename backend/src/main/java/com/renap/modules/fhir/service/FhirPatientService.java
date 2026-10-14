package com.renap.modules.fhir.service;

import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import com.renap.modules.fhir.dto.PersonaFhirDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hl7.fhir.r4.model.*;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

/**
 * Servicio para consultar pacientes desde el servidor FHIR.
 * Transforma recursos FHIR Patient a DTOs del sistema.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FhirPatientService {

    private final IGenericClient fhirClient;
    
    private static final String CUI_SYSTEM = "http://renap.gob.gt/cui";

    /**
     * Busca un paciente por su ID interno de FHIR.
     * Ejemplo: /fhir/Patient/837871
     */
    @Cacheable(value = "fhirPatientById", key = "#fhirId")
    public PersonaFhirDTO buscarPorFhirId(String fhirId) {
        log.info("Buscando paciente FHIR por ID: {}", fhirId);
        
        try {
            log.debug("Realizando petición al servidor FHIR para ID: {}", fhirId);
            
            Patient patient = fhirClient
                    .read()
                    .resource(Patient.class)
                    .withId(fhirId)
                    .execute();
            
            log.info("Paciente encontrado exitosamente: {}", fhirId);
            return mapearPatientADTO(patient);
            
        } catch (ResourceNotFoundException e) {
            log.warn("Paciente no encontrado con FHIR ID: {} - {}", fhirId, e.getMessage());
            return PersonaFhirDTO.builder()
                    .encontrado(false)
                    .mensajeError("Paciente no encontrado en el servidor FHIR")
                    .build();
                    
        } catch (Exception e) {
            log.error("Error al buscar paciente por FHIR ID: {} - Error: {}", fhirId, e.getMessage(), e);
            return PersonaFhirDTO.builder()
                    .encontrado(false)
                    .mensajeError("Error de conexión con el servidor FHIR: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Busca un paciente por su CUI/DPI.
     * Ejemplo: /fhir/Patient?identifier=http://renap.gob.gt/cui|3593745140801
     */
    @Cacheable(value = "fhirPatientByCui", key = "#cui")
    public PersonaFhirDTO buscarPorCui(String cui) {
        log.info("Buscando paciente FHIR por CUI: {}", cui);
        
        // Limpiar el CUI (quitar espacios y guiones)
        String cuiLimpio = cui.replaceAll("[\\s-]", "");
        
        try {
            // Construir búsqueda por identifier
            Bundle bundle = fhirClient
                    .search()
                    .forResource(Patient.class)
                    .where(Patient.IDENTIFIER.exactly()
                            .systemAndCode(CUI_SYSTEM, cuiLimpio))
                    .returnBundle(Bundle.class)
                    .execute();
            
            // Verificar si se encontraron resultados
            if (bundle.getEntry().isEmpty()) {
                log.warn("No se encontró paciente con CUI: {}", cuiLimpio);
                return PersonaFhirDTO.builder()
                        .encontrado(false)
                        .mensajeError("No se encontró paciente con el CUI proporcionado")
                        .build();
            }
            
            // Tomar el primer resultado
            Patient patient = (Patient) bundle.getEntry().get(0).getResource();
            return mapearPatientADTO(patient);
            
        } catch (Exception e) {
            log.error("Error al buscar paciente por CUI: {}", cuiLimpio, e);
            return PersonaFhirDTO.builder()
                    .encontrado(false)
                    .mensajeError("Error de conexión con el servidor FHIR: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Mapea un recurso FHIR Patient a nuestro DTO simplificado.
     */
    private PersonaFhirDTO mapearPatientADTO(Patient patient) {
        PersonaFhirDTO dto = PersonaFhirDTO.builder()
                .fhirId(patient.getIdElement().getIdPart())
                .encontrado(true)
                .build();
        
        // ── 1. Identificadores ───────────────────────────────────
        patient.getIdentifier().stream()
                .filter(id -> CUI_SYSTEM.equals(id.getSystem()))
                .findFirst()
                .ifPresent(id -> dto.setCui(id.getValue()));
        
        // ── 2. Nombres ───────────────────────────────────────────
        if (patient.hasName() && !patient.getName().isEmpty()) {
            HumanName name = patient.getName().get(0);
            
            // Nombre completo formateado
            dto.setNombreCompleto(name.getNameAsSingleString());
            
            // Nombres individuales
            List<StringType> given = name.getGiven();
            if (!given.isEmpty()) {
                dto.setPrimerNombre(given.get(0).getValue());
                if (given.size() > 1) dto.setSegundoNombre(given.get(1).getValue());
                if (given.size() > 2) dto.setTercerNombre(given.get(2).getValue());
            }
            
            // Apellidos
            if (name.hasFamily()) {
                String family = name.getFamily();
                String[] apellidos = family.split(" ", 2);
                dto.setPrimerApellido(apellidos[0]);
                if (apellidos.length > 1) {
                    dto.setSegundoApellido(apellidos[1]);
                }
            }
        }
        
        // ── 3. Sexo ──────────────────────────────────────────────
        if (patient.hasGender()) {
            dto.setSexo(patient.getGender().toCode());
        }
        
        // ── 4. Fecha de nacimiento y edad ────────────────────────
        if (patient.hasBirthDate()) {
            Date birthDate = patient.getBirthDate();
            LocalDate localDate = birthDate.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            dto.setFechaNacimiento(localDate);
            
            // Calcular edad
            LocalDate hoy = LocalDate.now();
            Period periodo = Period.between(localDate, hoy);
            dto.setEdad(periodo.getYears());
        }
        
        // ── 5. Dirección ─────────────────────────────────────────
        if (patient.hasAddress() && !patient.getAddress().isEmpty()) {
            Address address = patient.getAddress().get(0);
            
            // Línea completa de dirección
            if (address.hasLine()) {
                dto.setDireccion(address.getLine().get(0).getValue());
            }
            
            // Departamento (state)
            if (address.hasState()) {
                dto.setDepartamento(address.getState());
            }
            
            // Municipio (city)
            if (address.hasCity()) {
                dto.setMunicipio(address.getCity());
            }
            
            // País (country)
            if (address.hasCountry()) {
                dto.setPais(address.getCountry());
            }
        }
        
        // ── 6. Contacto ──────────────────────────────────────────
        if (patient.hasTelecom()) {
            patient.getTelecom().forEach(telecom -> {
                if (telecom.getSystem() == ContactPoint.ContactPointSystem.PHONE) {
                    dto.setTelefono(telecom.getValue());
                } else if (telecom.getSystem() == ContactPoint.ContactPointSystem.EMAIL) {
                    dto.setEmail(telecom.getValue());
                }
            });
        }
        
        // ── 7. Estado civil ──────────────────────────────────────
        if (patient.hasMaritalStatus() && patient.getMaritalStatus().hasCoding()) {
            Coding coding = patient.getMaritalStatus().getCoding().get(0);
            dto.setEstadoCivil(coding.getCode());
        }
        
        // ── 8. Extensions (datos adicionales) ────────────────────
        patient.getExtension().forEach(extension -> {
            String url = extension.getUrl();
            
            // Nacionalidad
            if (url.contains("nationality") && extension.getValue() instanceof CodeableConcept) {
                CodeableConcept cc = (CodeableConcept) extension.getValue();
                if (cc.hasCoding()) {
                    dto.setNacionalidad(cc.getCoding().get(0).getDisplay());
                }
            }
            
            // Pueblo de pertenencia (ethnicity)
            if (url.contains("ethnicity") && extension.getValue() instanceof CodeableConcept) {
                CodeableConcept cc = (CodeableConcept) extension.getValue();
                if (cc.hasCoding()) {
                    dto.setPuebloPertenencia(cc.getCoding().get(0).getDisplay());
                }
            }
            
            // Ocupación
            if (url.contains("occupation") && extension.getValue() instanceof StringType) {
                StringType st = (StringType) extension.getValue();
                dto.setOcupacion(st.getValue());
            }
        });
        
        log.info("Paciente mapeado exitosamente: {} (CUI: {})", dto.getNombreCompleto(), dto.getCui());
        return dto;
    }
}
