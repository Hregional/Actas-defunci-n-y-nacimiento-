package com.renap.modules.estadisticas.service;

import com.renap.modules.estadisticas.dto.EstadisticasMesDTO;
import com.renap.modules.estadisticas.dto.ResumenDTO;
import com.renap.modules.nacimiento.repository.InformeNacimientoRepository;
import com.renap.modules.defuncion.repository.InformeDefuncionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EstadisticasService {

    private final InformeNacimientoRepository nacimientoRepo;
    private final InformeDefuncionRepository  defuncionRepo;

    private static final Locale ES = Locale.of("es", "GT");
    private static final String[] MESES = {
        "Ene","Feb","Mar","Abr","May","Jun",
        "Jul","Ago","Sep","Oct","Nov","Dic"
    };
    private static final String[] DIAS = {"Lun","Mar","Mié","Jue","Vie","Sáb","Dom"};

    public ResumenDTO obtenerResumen() {
        long nac = nacimientoRepo.count();
        long def = defuncionRepo.count();
        LocalDate hoy = LocalDate.now();
        String mes = hoy.getMonth().getDisplayName(TextStyle.FULL, ES);
        // Capitalizar
        mes = mes.substring(0,1).toUpperCase() + mes.substring(1);
        return ResumenDTO.builder()
                .totalNacimientos(nac)
                .totalDefunciones(def)
                .totalGeneral(nac + def)
                .anioActual(hoy.getYear())
                .mesActual(mes + " " + hoy.getYear())
                .build();
    }

    public List<EstadisticasMesDTO> obtenerPorMes(int anio) {
        List<EstadisticasMesDTO> result = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            LocalDate inicio = LocalDate.of(anio, m, 1);
            LocalDate fin    = inicio.withDayOfMonth(inicio.lengthOfMonth());
            long nac = nacimientoRepo.countByFechaRange(inicio, fin);
            long def = defuncionRepo.countByFechaRange(inicio, fin);
            result.add(EstadisticasMesDTO.builder()
                    .periodo(MESES[m - 1])
                    .nacimientos(nac)
                    .defunciones(def)
                    .build());
        }
        return result;
    }

    public List<EstadisticasMesDTO> obtenerUltimaSemana() {
        List<EstadisticasMesDTO> result = new ArrayList<>();
        LocalDate hoy = LocalDate.now();
        // Lunes de la semana actual
        LocalDate lunes = hoy.with(DayOfWeek.MONDAY);
        for (int d = 0; d < 7; d++) {
            LocalDate dia = lunes.plusDays(d);
            long nac = nacimientoRepo.countByFechaRange(dia, dia);
            long def = defuncionRepo.countByFechaRange(dia, dia);
            result.add(EstadisticasMesDTO.builder()
                    .periodo(DIAS[d])
                    .nacimientos(nac)
                    .defunciones(def)
                    .build());
        }
        return result;
    }
}
