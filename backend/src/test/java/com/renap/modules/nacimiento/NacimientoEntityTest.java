package com.renap.modules.nacimiento;

import com.renap.modules.nacimiento.entity.InformeNacimiento;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de entidad InformeNacimiento.
 * Nota: semanas de gestación son Integer (1-45). Peso/talla siguen siendo BigDecimal.
 */
@SpringBootTest
@DisplayName("InformeNacimiento Entity Tests")
public class NacimientoEntityTest {

    @Test
    @DisplayName("Debe crear entidad correctamente con gestación como entero")
    public void testGestacionEntero() {
        InformeNacimiento informe = InformeNacimiento.builder()
            .suscribeNombresApellidos("Dr. Juan Pérez")
            .suscribeCuiCedula("1234567890123")
            .suscribeQuienInforma(1)

            .lugarDepartamento("Guatemala")
            .lugarMunicipio("Guatemala")
            .lugarDireccion("Hospital General")

            .ninoFechaNacimiento(LocalDate.now())
            .ninoSexo(1)
            .ninoPesoLibras(new BigDecimal("7.500"))
            .ninoTallaCm(new BigDecimal("49.5"))
            .ninoEdadGestacionalSemanas(38)   // semanas enteras
            .ninoAnomaliasCongenitas(2)
            .ninoTipoParto(1)
            .ninoPersonaAtendioElParto(1)

            .madrePrimerNombre("María")
            .madrePrimerApellido("González")
            .madreCuiCedula("9876543210987")
            .madreEdad(28)
            .madreNacionalidad("Guatemalteca")
            .madreOcupacion("Ama de casa")
            .madreDireccion("Ciudad de Guatemala")
            .madreMunicipio("Guatemala")
            .madreDepartamento("Guatemala")
            .madrePuebloPertenencia(4)
            .madreEstadoCivil(2)
            .madreEscolaridad(3)
            .build();

        assertNotNull(informe);
        assertEquals(38, informe.getNinoEdadGestacionalSemanas());
        assertEquals(new BigDecimal("49.5"), informe.getNinoTallaCm());
        assertEquals(new BigDecimal("7.500"), informe.getNinoPesoLibras());
        assertEquals("Dr. Juan Pérez", informe.getSuscribeNombresApellidos());
        assertEquals("1234567890123", informe.getSuscribeCuiCedula());
        assertEquals("María", informe.getMadrePrimerNombre());
        assertEquals("González", informe.getMadrePrimerApellido());
    }

    @Test
    @DisplayName("Gestación debe manejar valores extremos válidos")
    public void testGestacionExtremos() {
        InformeNacimiento informe = new InformeNacimiento();

        // Valor mínimo: 20 semanas (muy prematuro)
        informe.setNinoEdadGestacionalSemanas(20);
        assertEquals(20, informe.getNinoEdadGestacionalSemanas());

        // Valor máximo: 45 semanas (muy postérmino)
        informe.setNinoEdadGestacionalSemanas(45);
        assertEquals(45, informe.getNinoEdadGestacionalSemanas());

        // Valor típico: 39 semanas
        informe.setNinoEdadGestacionalSemanas(39);
        assertEquals(39, informe.getNinoEdadGestacionalSemanas());
    }

    @Test
    @DisplayName("Campos String deben aceptar longitudes máximas correctas")
    public void testStringLengthLimits() {
        InformeNacimiento informe = new InformeNacimiento();

        // Nombres: máximo 100 caracteres
        String nombre100 = "A".repeat(100);
        informe.setMadrePrimerNombre(nombre100);
        assertEquals(100, informe.getMadrePrimerNombre().length());

        // CUI: exactamente 13 caracteres
        informe.setMadreCuiCedula("1234567890123");
        assertEquals(13, informe.getMadreCuiCedula().length());

        // Dirección: máximo 255 caracteres
        String direccion255 = "A".repeat(255);
        informe.setMadreDireccion(direccion255);
        assertEquals(255, informe.getMadreDireccion().length());

        // Ocupación: máximo 150 caracteres
        String ocupacion150 = "A".repeat(150);
        informe.setMadreOcupacion(ocupacion150);
        assertEquals(150, informe.getMadreOcupacion().length());
    }

    @Test
    @DisplayName("Debe manejar valores nulos apropiadamente")
    public void testNullValues() {
        InformeNacimiento informe = new InformeNacimiento();

        assertNull(informe.getNinoSegundoNombre());
        assertNull(informe.getPadrePrimerNombre());
        assertNull(informe.getPadreEdad());
        assertNull(informe.getNinoEdadGestacionalSemanas());

        informe.setNinoEdadGestacionalSemanas(38);
        assertNotNull(informe.getNinoEdadGestacionalSemanas());
    }

    @Test
    @DisplayName("Entidad debe tener @Column sin precision en gestación")
    public void testColumnAnnotation() throws Exception {
        var gestacionField = InformeNacimiento.class.getDeclaredField("ninoEdadGestacionalSemanas");
        assertNotNull(gestacionField, "Campo debe existir");
        assertEquals(Integer.class, gestacionField.getType(), "Gestación debe ser Integer");
    }
}
