package com.renap.modules.defuncion.service;

import com.renap.modules.defuncion.dto.InformeDefuncionDTO;
import com.renap.modules.defuncion.dto.InformeDefuncionListDTO;
import com.renap.shared.response.PageResponse;
import org.springframework.data.domain.Pageable;

public interface InformeDefuncionService {
    PageResponse<InformeDefuncionListDTO> buscar(String search, String estado, Pageable pageable);
    InformeDefuncionDTO obtenerPorId(Long id);
    InformeDefuncionDTO crear(InformeDefuncionDTO dto);
    InformeDefuncionDTO actualizar(Long id, InformeDefuncionDTO dto);
    InformeDefuncionDTO cambiarEstado(Long id, String estado);
    void eliminar(Long id);
}
