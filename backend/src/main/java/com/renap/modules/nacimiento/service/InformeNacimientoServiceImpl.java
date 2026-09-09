package com.renap.modules.nacimiento.service;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.dto.InformeNacimientoListDTO;
import com.renap.modules.nacimiento.entity.InformeNacimiento;
import com.renap.modules.nacimiento.mapper.InformeNacimientoMapper;
import com.renap.modules.nacimiento.repository.InformeNacimientoRepository;
import com.renap.shared.exception.ResourceNotFoundException;
import com.renap.shared.response.PageResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@SuppressWarnings("null")
public class InformeNacimientoServiceImpl implements InformeNacimientoService {

    private static final Set<String> ESTADOS_VALIDOS = Set.of("BORRADOR", "COMPLETADO", "ENVIADO");

    private final InformeNacimientoRepository repository;
    private final InformeNacimientoMapper mapper;

    @Override
    public PageResponse<InformeNacimientoListDTO> buscar(String search, String estado, Pageable pageable) {
        Page<InformeNacimiento> page = repository.search(search, estado, pageable);
        Page<InformeNacimientoListDTO> dtoPage = page.map(mapper::toListDTO);
        return PageResponse.from(dtoPage);
    }

    @Override
    public InformeNacimientoDTO obtenerPorId(Long id) {
        return mapper.toDTO(findOrThrow(id));
    }

    @Override
    @Transactional
    public InformeNacimientoDTO crear(InformeNacimientoDTO dto) {
        InformeNacimiento entity = mapper.toEntity(dto);
        entity.setEstado("BORRADOR");
        InformeNacimiento saved = repository.save(entity);
        log.info("Informe de nacimiento creado con id={}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InformeNacimientoDTO actualizar(Long id, InformeNacimientoDTO dto) {
        InformeNacimiento entity = findOrThrow(id);
        mapper.updateFromDTO(dto, entity);
        InformeNacimiento saved = repository.save(entity);
        log.info("Informe de nacimiento actualizado id={}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InformeNacimientoDTO cambiarEstado(Long id, String estado) {
        if (!ESTADOS_VALIDOS.contains(estado)) {
            throw new IllegalArgumentException("Estado no válido: " + estado);
        }
        InformeNacimiento entity = findOrThrow(id);
        entity.setEstado(estado);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        findOrThrow(id);
        repository.deleteById(Objects.requireNonNull(id));
        log.info("Informe de nacimiento eliminado id={}", id);
    }

    private InformeNacimiento findOrThrow(Long id) {
        return repository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Informe de Nacimiento", id));
    }
}
