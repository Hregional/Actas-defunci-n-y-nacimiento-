package com.renap.modules.fhir;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.entity.InformeNacimiento;
import com.renap.modules.defuncion.dto.InformeDefuncionDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de cumplimiento general: validaciones de campos, límites y tipos.
 * Nota: semanas de gestación son Integer (1-45). Peso/talla siguen siendo BigDecimal.
 */
@SpringBootTest
@DisplayName("FHIR R4 Compliance Tests")
public class FhirComplianceTest {

    @Autowired
    private Validator validator;

    @Test
    @DisplayName("Nacimiento: Gestación debe aceptar valores enteros (1-45 semanas)")
    public void testGestacionEntero() {
        InformeNacimientoDTO dto = InformeNacimientoDTO.builder()
            .suscribeNombresApellidos("Dr. Juan Pérez")
            .suscribeQuienInforma(1)
            .lugarDepartamento("Guatemala")
            .lugarMunicipio("Guatemala")
            .ninoFechaNacimiento(LocalDate.now())
            .ninoSexo(1)
            .ninoPesoLibras(new BigDecimal("7.5"))
            .ninoTallaCm(new BigDecimal("49.5"))
            .ninoEdadGestacionalSemanas(38)   // entero
            .ninoAnomaliasCongenitas(2)
            .ninoTipoParto(1)
            .ninoPersonaAtendioElParto(1)
            .madrePrimerNombre("María")
            .madrePrimerApellido("González")
            .madreEdad(25)
            .madrePuebloPertenencia(4)
            .madreEstadoCivil(1)
            .madreEscolaridad(3)
            .build();

        Set<ConstraintViolation<InformeNacimientoDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Gestación como entero debe ser válida");
    }

    @Test
    @DisplayName("Nacimiento: Validar límites máximos de campos String")
    public void testStringLimits() {
        InformeNacimientoDTO dto = new InformeNacimientoDTO();

        // String que excede el límite de 255
        String nombreMuyLargo = "A".repeat(256);
        dto.setSuscribeNombresApellidos(nombreMuyLargo);

        Set<ConstraintViolation<InformeNacimientoDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Debe rechazar strings que exceden @Size");
        assertTrue(
            violations.stream().anyMatch(v ->
                v.getMessage().contains("255") || v.getMessage().contains("size")
            ),
            "Debe indicar violación de longitud máxima"
        );
    }

    @Test
    @DisplayName("Defunción: Mortinato gestación debe aceptar enteros")
    public void testMortinatoGestacionEntero() {
        InformeDefuncionDTO dto = InformeDefuncionDTO.builder()
            .infoQuienInformaNombres("Dr. Ana López")
            .infoQuienInformaTipo(1)
            .infoFechaDefuncion(LocalDate.now())
            .infoHoraDefuncion("14:30")
            .fallecidoNombreCompleto("Bebé Pérez")
            .fallecidoSexo(1)
            .fallecidoDocNumero("1234567890123")
            .fallecidoLugarNacPais("Guatemala")
            .fallecidoLugarNacDepartamento("Guatemala")
            .fallecidoLugarNacMunicipio("Guatemala")
            .fallecidoNacionalidad("Guatemalteco")
            .fallecidoOcupacion("Ninguna")
            .fallecidoEstadoCivil(1)
            .fallecidoPuebloPertenencia(1)
            .fallecidoResidenciaDireccion("Ciudad")
            .fallecidoResidenciaMunicipio("Guatemala")
            .fallecidoResidenciaDepartamento("Guatemala")
            .fallecidoEscolaridad(0)
            .causaIa("Asfixia perinatal")
            .mortinatoSemanasGestacion(32)   // entero
            .otrosHuboNecropsia(2)
            .otrosClaseAsistencia(1)
            .otrosLugarDefuncion(1)
            .build();

        Set<ConstraintViolation<InformeDefuncionDTO>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Mortinato gestación como entero debe ser válida");
    }

    @Test
    @DisplayName("Rangos clínicos de talla")
    public void testTallaRange() {
        InformeNacimientoDTO dto = new InformeNacimientoDTO();

        // Talla fuera del rango clínico (máx 100 cm para recién nacido)
        dto.setNinoTallaCm(new BigDecimal("150.0"));

        Set<ConstraintViolation<InformeNacimientoDTO>> violations = validator.validate(dto);
        assertTrue(
            violations.stream().anyMatch(v ->
                v.getPropertyPath().toString().contains("talla") ||
                v.getMessage().contains("100")
            ),
            "Debe rechazar valores fuera de rangos clínicos"
        );
    }

    @Test
    @DisplayName("Entidades JPA: Verificar anotaciones @Column(length)")
    public void testJpaColumnLengths() throws Exception {
        var suscribeField = InformeNacimiento.class.getDeclaredField("suscribeNombresApellidos");
        var columnAnnotation = suscribeField.getAnnotation(jakarta.persistence.Column.class);

        assertNotNull(columnAnnotation, "Campo debe tener @Column");
        assertEquals(255, columnAnnotation.length(), "Debe tener longitud 255");

        var cuiField = InformeNacimiento.class.getDeclaredField("madreCuiCedula");
        var cuiColumn = cuiField.getAnnotation(jakarta.persistence.Column.class);
        assertEquals(13, cuiColumn.length(), "CUI debe tener límite de 13 chars");
    }

    @Test
    @DisplayName("Gestación: debe ser Integer (no BigDecimal) en entidad")
    public void testGestacionTipo() throws Exception {
        var gestacionField = InformeNacimiento.class.getDeclaredField("ninoEdadGestacionalSemanas");
        assertNotNull(gestacionField, "Campo gestación debe existir");
        assertEquals(Integer.class, gestacionField.getType(), "Gestación debe ser Integer");
    }

    @Test
    @DisplayName("CUI: Validación de longitud")
    public void testCuiValidation() {
        InformeNacimientoDTO dto = createValidNacimiento();

        // CUI inválido (menos de 13 dígitos)
        dto.setMadreCuiCedula("123456789");
        Set<ConstraintViolation<InformeNacimientoDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "CUI corto debe ser inválido");

        // CUI válido (exactamente 13 dígitos)
        dto.setMadreCuiCedula("1234567890123");
        violations = validator.validate(dto);
        assertTrue(
            violations.stream().noneMatch(v ->
                v.getPropertyPath().toString().contains("madreCuiCedula")
            ),
            "CUI de 13 dígitos debe pasar validación de longitud"
        );
    }

    @Test
    @DisplayName("Hora: Formato HH:mm requerido")
    public void testTimeFormat() {
        InformeDefuncionDTO dto = createValidDefuncion();

        dto.setInfoHoraDefuncion("25:70");
        Set<ConstraintViolation<InformeDefuncionDTO>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty(), "Hora inválida debe ser rechazada");

        dto.setInfoHoraDefuncion("14:30");
        violations = validator.validate(dto);
        assertTrue(
            violations.stream().noneMatch(v ->
                v.getPropertyPath().toString().contains("Hora")
            ),
            "Hora válida debe pasar validación"
        );
    }

    // ── Métodos auxiliares ─────────────────────────────────────────────────

    private InformeNacimientoDTO createValidNacimiento() {
        return InformeNacimientoDTO.builder()
            .suscribeNombresApellidos("Dr. Juan Pérez")
            .suscribeQuienInforma(1)
            .lugarDepartamento("Guatemala")
            .lugarMunicipio("Guatemala")
            .ninoFechaNacimiento(LocalDate.now())
            .ninoSexo(1)
            .ninoPesoLibras(new BigDecimal("7.5"))
            .ninoTallaCm(new BigDecimal("50.0"))
            .ninoEdadGestacionalSemanas(38)
            .ninoAnomaliasCongenitas(2)
            .ninoTipoParto(1)
            .ninoPersonaAtendioElParto(1)
            .madrePrimerNombre("María")
            .madrePrimerApellido("González")
            .madreCuiCedula("1234567890123")
            .madreEdad(25)
            .madrePuebloPertenencia(4)
            .madreEstadoCivil(1)
            .madreEscolaridad(3)
            .build();
    }

    private InformeDefuncionDTO createValidDefuncion() {
        return InformeDefuncionDTO.builder()
            .infoQuienInformaNombres("Dr. Ana López")
            .infoQuienInformaTipo(1)
            .infoFechaDefuncion(LocalDate.now())
            .infoHoraDefuncion("14:30")
            .fallecidoNombreCompleto("Fallecido Prueba")
            .fallecidoSexo(1)
            .fallecidoDocNumero("1234567890123")
            .fallecidoLugarNacPais("Guatemala")
            .fallecidoLugarNacDepartamento("Guatemala")
            .fallecidoLugarNacMunicipio("Guatemala")
            .fallecidoNacionalidad("Guatemalteco")
            .fallecidoOcupacion("Empleado")
            .fallecidoEstadoCivil(1)
            .fallecidoPuebloPertenencia(1)
            .fallecidoResidenciaDireccion("Ciudad Guatemala")
            .fallecidoResidenciaMunicipio("Guatemala")
            .fallecidoResidenciaDepartamento("Guatemala")
            .fallecidoEscolaridad(3)
            .causaIa("Paro cardíaco")
            .otrosHuboNecropsia(2)
            .otrosClaseAsistencia(1)
            .otrosLugarDefuncion(1)
            .build();
    }
}
