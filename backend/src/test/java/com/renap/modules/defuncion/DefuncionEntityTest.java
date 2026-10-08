package com.renap.modules.defuncion;

import com.renap.modules.defuncion.entity.InformeDefuncion;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Tests de entidad InformeDefuncion.
 * Nota: semanas de gestación son Integer (1-45), peso/talla siguen siendo BigDecimal.
 */
@SpringBootTest
@DisplayName("InformeDefuncion Entity Tests")
public class DefuncionEntityTest {

    @Test
    @DisplayName("Debe crear entidad con mortinato gestación como entero")
    public void testMortinatoGestacion() {
        InformeDefuncion informe = InformeDefuncion.builder()
            .infoQuienInformaNombres("Dr. Ana López")
            .infoDocumentoIdentificacion("1234567890123")
            .infoQuienInformaTipo(1)
            .infoFechaDefuncion(LocalDate.now())
            .infoHoraDefuncion("14:30")
            .infoLugarDireccion("Hospital Nacional")
            .infoLugarMunicipio("Guatemala")
            .infoLugarDepartamento("Guatemala")

            .fallecidoNombreCompleto("Bebé González")
            .fallecidoSexo(1)
            .fallecidoDocNumero("9876543210987")
            .fallecidoLugarNacPais("Guatemala")
            .fallecidoLugarNacDepartamento("Guatemala")
            .fallecidoLugarNacMunicipio("Guatemala")
            .fallecidoNacionalidad("Guatemalteco")
            .fallecidoOcupacion("Ninguna")
            .fallecidoEstadoCivil(1)
            .fallecidoPuebloPertenencia(1)
            .fallecidoResidenciaDireccion("Ciudad Guatemala")
            .fallecidoResidenciaMunicipio("Guatemala")
            .fallecidoResidenciaDepartamento("Guatemala")
            .fallecidoEscolaridad(0)

            .causaIa("Asfixia perinatal")
            .causaIaIntervalo("Inmediato")

            .mortinatoMadreNombre("María González")
            .mortinatoSemanasGestacion(32)   // semanas enteras
            .mortinatoFetoSexo(1)
            .mortinatoFetoMurio(1)

            .otrosHuboNecropsia(2)
            .otrosClaseAsistencia(1)
            .otrosLugarDefuncion(1)
            .build();

        assertNotNull(informe);
        assertEquals(32, informe.getMortinatoSemanasGestacion());
        assertEquals("Dr. Ana López", informe.getInfoQuienInformaNombres());
        assertEquals("1234567890123", informe.getInfoDocumentoIdentificacion());
        assertEquals("Bebé González", informe.getFallecidoNombreCompleto());
        assertEquals("María González", informe.getMortinatoMadreNombre());
    }

    @Test
    @DisplayName("Mortinato gestación debe manejar valores extremos válidos")
    public void testMortinatoGestacionExtremos() {
        InformeDefuncion informe = new InformeDefuncion();

        // Valor mínimo: 1 semana
        informe.setMortinatoSemanasGestacion(1);
        assertEquals(1, informe.getMortinatoSemanasGestacion());

        // Valor máximo: 45 semanas (muy postérmino)
        informe.setMortinatoSemanasGestacion(45);
        assertEquals(45, informe.getMortinatoSemanasGestacion());

        // Valor típico: 32 semanas
        informe.setMortinatoSemanasGestacion(32);
        assertEquals(32, informe.getMortinatoSemanasGestacion());
    }

    @Test
    @DisplayName("Campos String deben aceptar longitudes máximas correctas")
    public void testStringLengthLimits() {
        InformeDefuncion informe = new InformeDefuncion();

        // Nombre completo: máximo 255 caracteres
        String nombre255 = "A".repeat(255);
        informe.setInfoQuienInformaNombres(nombre255);
        assertEquals(255, informe.getInfoQuienInformaNombres().length());

        // DPI: exactamente 13 caracteres
        informe.setFallecidoDocNumero("1234567890123");
        assertEquals(13, informe.getFallecidoDocNumero().length());

        // Ocupación: máximo 150 caracteres
        String ocupacion150 = "A".repeat(150);
        informe.setFallecidoOcupacion(ocupacion150);
        assertEquals(150, informe.getFallecidoOcupacion().length());

        // No. Colegiado: máximo 50 caracteres
        String colegiado50 = "A".repeat(50);
        informe.setInfoNoColegiado(colegiado50);
        assertEquals(50, informe.getInfoNoColegiado().length());
    }

    @Test
    @DisplayName("Debe manejar valores nulos apropiadamente")
    public void testNullValues() {
        InformeDefuncion informe = new InformeDefuncion();

        assertNull(informe.getMortinatoMadreNombre());
        assertNull(informe.getMortinatoSemanasGestacion());
        assertNull(informe.getFallecidoEdadHoras());
        assertNull(informe.getAccidentalArmaProdujo());

        informe.setMortinatoSemanasGestacion(28);
        assertNotNull(informe.getMortinatoSemanasGestacion());
    }

    @Test
    @DisplayName("Campos TEXT deben aceptar contenido largo")
    public void testTextFields() {
        InformeDefuncion informe = new InformeDefuncion();

        String causaLarga = "Descripción muy detallada de la causa de muerte que puede incluir múltiples condiciones médicas, síntomas observados, y circunstancias específicas que llevaron al fallecimiento del paciente en el hospital.";

        informe.setCausaIa(causaLarga);
        informe.setCausaIb(causaLarga);
        informe.setCausaIc(causaLarga);
        informe.setCausaIi(causaLarga);

        assertEquals(causaLarga, informe.getCausaIa());
        assertEquals(causaLarga, informe.getCausaIb());
        assertEquals(causaLarga, informe.getCausaIc());
        assertEquals(causaLarga, informe.getCausaIi());

        String intervalo100 = "A".repeat(100);
        informe.setCausaIaIntervalo(intervalo100);
        assertEquals(100, informe.getCausaIaIntervalo().length());
    }
}
