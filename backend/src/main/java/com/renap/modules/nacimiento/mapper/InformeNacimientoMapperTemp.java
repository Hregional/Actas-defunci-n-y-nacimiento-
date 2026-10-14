package com.renap.modules.nacimiento.mapper;

import com.renap.modules.nacimiento.dto.InformeNacimientoDTO;
import com.renap.modules.nacimiento.dto.InformeNacimientoListDTO;
import com.renap.modules.nacimiento.entity.InformeNacimiento;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper temporal manual para evitar problemas de compilación de MapStruct
 * Este será reemplazado una vez que MapStruct compile correctamente
 */
@Component
public class InformeNacimientoMapperTemp {

    public InformeNacimientoDTO toDTO(InformeNacimiento entity) {
        if (entity == null) return null;
        
        InformeNacimientoDTO dto = new InformeNacimientoDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public InformeNacimiento toEntity(InformeNacimientoDTO dto) {
        if (dto == null) return null;
        
        InformeNacimiento entity = new InformeNacimiento();
        BeanUtils.copyProperties(dto, entity, "id", "createdAt", "updatedAt", "estado");
        return entity;
    }

    public void updateFromDTO(InformeNacimientoDTO dto, InformeNacimiento entity) {
        if (dto == null || entity == null) return;
        
        BeanUtils.copyProperties(dto, entity, "id", "createdAt", "updatedAt", "estado");
    }

    public InformeNacimientoListDTO toListDTO(InformeNacimiento entity) {
        if (entity == null) return null;
        
        InformeNacimientoListDTO dto = new InformeNacimientoListDTO();
        
        // Construir nombre completo del niño
        StringBuilder nombreCompleto = new StringBuilder();
        if (entity.getNinoPrimerNombre() != null) {
            nombreCompleto.append(entity.getNinoPrimerNombre()).append(" ");
        }
        if (entity.getNinoSegundoNombre() != null) {
            nombreCompleto.append(entity.getNinoSegundoNombre()).append(" ");
        }
        if (entity.getNinoTercerNombre() != null) {
            nombreCompleto.append(entity.getNinoTercerNombre());
        }
        
        dto.setNinoNombreCompleto(nombreCompleto.toString().trim());
        dto.setNinoSexo(entity.getNinoSexo());
        dto.setSuscribeNombresApellidos(entity.getSuscribeNombresApellidos());
        dto.setMadrePrimerNombre(entity.getMadrePrimerNombre());
        dto.setMadreSegundoNombre(entity.getMadreSegundoNombre());
        dto.setMadrePrimerApellido(entity.getMadrePrimerApellido());
        dto.setMadreSegundoApellido(entity.getMadreSegundoApellido());
        dto.setMadreApellidoCasada(entity.getMadreApellidoCasada());
        dto.setMadreCuiCedula(entity.getMadreCuiCedula());
        
        // Copiar campos básicos
        BeanUtils.copyProperties(entity, dto, "ninoNombreCompleto");
        
        return dto;
    }

    public List<InformeNacimientoListDTO> toListDTOs(List<InformeNacimiento> entities) {
        if (entities == null) return null;
        
        return entities.stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }
}