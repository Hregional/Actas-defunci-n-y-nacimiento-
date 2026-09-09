package com.renap.modules.nacimiento.service;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.dto.InformeNacimientoListDTO;
import com.renap.shared.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InformeNacimientoService {
    PageResponse<InformeNacimientoListDTO> buscar(String search, String estado, Pageable pageable);
    InformeNacimientoDTO obtenerPorId(Long id);
    InformeNacimientoDTO crear(InformeNacimientoDTO dto);
    InformeNacimientoDTO actualizar(Long id, InformeNacimientoDTO dto);
    InformeNacimientoDTO cambiarEstado(Long id, String estado);
    void eliminar(Long id);
}
