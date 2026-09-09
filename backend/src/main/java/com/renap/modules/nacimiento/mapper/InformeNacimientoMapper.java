package com.renap.modules.nacimiento.mapper;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.dto.InformeNacimientoListDTO;
import com.renap.modules.nacimiento.entity.InformeNacimiento;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface InformeNacimientoMapper {

    InformeNacimientoDTO toDTO(InformeNacimiento entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "estado", ignore = true)
    InformeNacimiento toEntity(InformeNacimientoDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "estado", ignore = true)
    void updateFromDTO(InformeNacimientoDTO dto, @MappingTarget InformeNacimiento entity);

    @Mapping(target = "ninoNombreCompleto", expression = "java(buildNombreCompleto(entity))")
    @Mapping(target = "ninoSexo", source = "ninoSexo")
    @Mapping(target = "suscribeNombresApellidos", source = "suscribeNombresApellidos")
    InformeNacimientoListDTO toListDTO(InformeNacimiento entity);

    List<InformeNacimientoListDTO> toListDTOs(List<InformeNacimiento> entities);

    default String buildNombreCompleto(InformeNacimiento e) {
        StringBuilder sb = new StringBuilder();
        if (e.getNinoPrimerNombre() != null) sb.append(e.getNinoPrimerNombre()).append(" ");
        if (e.getNinoSegundoNombre() != null) sb.append(e.getNinoSegundoNombre()).append(" ");
        if (e.getNinoTercerNombre() != null) sb.append(e.getNinoTercerNombre());
        return sb.toString().trim();
    }
}
