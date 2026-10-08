package com.renap.modules.defuncion.mapper;

import com.renap.modules.defuncion.dto.InformeDefuncionDTO;
import com.renap.modules.defuncion.dto.InformeDefuncionListDTO;
import com.renap.modules.defuncion.entity.InformeDefuncion;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

/**
 * Mapper temporal manual para evitar problemas de compilación de MapStruct
 * Este será reemplazado una vez que MapStruct compile correctamente
 */
@Component
public class InformeDefuncionMapperTemp {

    public InformeDefuncionDTO toDTO(InformeDefuncion entity) {
        if (entity == null) return null;
        
        InformeDefuncionDTO dto = new InformeDefuncionDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }

    public InformeDefuncion toEntity(InformeDefuncionDTO dto) {
        if (dto == null) return null;
        
        InformeDefuncion entity = new InformeDefuncion();
        BeanUtils.copyProperties(dto, entity, "id", "createdAt", "updatedAt", "estado");
        return entity;
    }

    public void updateFromDTO(InformeDefuncionDTO dto, InformeDefuncion entity) {
        if (dto == null || entity == null) return;
        
        BeanUtils.copyProperties(dto, entity, "id", "createdAt", "updatedAt", "estado");
    }

    public InformeDefuncionListDTO toListDTO(InformeDefuncion entity) {
        if (entity == null) return null;
        
        InformeDefuncionListDTO dto = new InformeDefuncionListDTO();
        BeanUtils.copyProperties(entity, dto);
        return dto;
    }
}