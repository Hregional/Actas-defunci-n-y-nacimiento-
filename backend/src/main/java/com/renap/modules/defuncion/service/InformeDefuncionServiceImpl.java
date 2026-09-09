package com.renap.modules.defuncion.service;

import com.renap.modules.defuncion.dto.InformeDefuncionDTO;
import com.renap.modules.defuncion.dto.InformeDefuncionListDTO;
import com.renap.modules.defuncion.entity.InformeDefuncion;
import com.renap.modules.defuncion.mapper.InformeDefuncionMapper;
import com.renap.modules.defuncion.repository.InformeDefuncionRepository;
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
public class InformeDefuncionServiceImpl implements InformeDefuncionService {

    private static final Set<String> ESTADOS_VALIDOS = Set.of("BORRADOR", "COMPLETADO", "ENVIADO");

    private final InformeDefuncionRepository repository;
    private final InformeDefuncionMapper mapper;

    @Override
    public PageResponse<InformeDefuncionListDTO> buscar(String search, String estado, Pageable pageable) {
        Page<InformeDefuncion> page = repository.search(search, estado, pageable);
        Page<InformeDefuncionListDTO> dtoPage = page.map(mapper::toListDTO);
        return PageResponse.from(dtoPage);
    }

    @Override
    public InformeDefuncionDTO obtenerPorId(Long id) {
        return mapper.toDTO(findOrThrow(id));
    }

    @Override
    @Transactional
    public InformeDefuncionDTO crear(InformeDefuncionDTO dto) {
        InformeDefuncion entity = mapper.toEntity(dto);
        entity.setEstado("BORRADOR");
        InformeDefuncion saved = repository.save(entity);
        log.info("Informe de defunción creado con id={}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InformeDefuncionDTO actualizar(Long id, InformeDefuncionDTO dto) {
        InformeDefuncion entity = findOrThrow(id);
        mapper.updateFromDTO(dto, entity);
        InformeDefuncion saved = repository.save(entity);
        log.info("Informe de defunción actualizado id={}", saved.getId());
        return mapper.toDTO(saved);
    }

    @Override
    @Transactional
    public InformeDefuncionDTO cambiarEstado(Long id, String estado) {
        if (!ESTADOS_VALIDOS.contains(estado)) {
            throw new IllegalArgumentException("Estado no válido: " + estado);
        }
        InformeDefuncion entity = findOrThrow(id);
        entity.setEstado(estado);
        return mapper.toDTO(repository.save(entity));
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        findOrThrow(id);
        repository.deleteById(Objects.requireNonNull(id));
        log.info("Informe de defunción eliminado id={}", id);
    }

    private InformeDefuncion findOrThrow(Long id) {
        return repository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new ResourceNotFoundException("Informe de Defunción", id));
    }
}
