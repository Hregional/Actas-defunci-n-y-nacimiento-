package com.renap.modules.defuncion.mapper;

import com.renap.modules.defuncion.dto.InformeDefuncionDTO;
import com.renap.modules.defuncion.dto.InformeDefuncionListDTO;
import com.renap.modules.defuncion.entity.InformeDefuncion;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface InformeDefuncionMapper {

    InformeDefuncionDTO toDTO(InformeDefuncion entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "estado", ignore = true)
    InformeDefuncion toEntity(InformeDefuncionDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDTO(InformeDefuncionDTO dto, @MappingTarget InformeDefuncion entity);

    InformeDefuncionListDTO toListDTO(InformeDefuncion entity);
}
