package com.renap.modules.defuncion.repository;

import com.renap.modules.defuncion.entity.InformeDefuncion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface InformeDefuncionRepository extends JpaRepository<InformeDefuncion, Long> {

    @Query("""
        SELECT d FROM InformeDefuncion d
        WHERE (:search IS NULL OR :search = ''
            OR LOWER(d.fallecidoNombreCompleto) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(d.infoQuienInformaNombres) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:estado IS NULL OR :estado = '' OR d.estado = :estado)
        ORDER BY d.createdAt DESC
    """)
    Page<InformeDefuncion> search(
            @Param("search") String search,
            @Param("estado") String estado,
            Pageable pageable);

    /** Cuenta registros cuya fecha de defunción está en el rango [inicio, fin] */
    @Query("SELECT COUNT(d) FROM InformeDefuncion d WHERE d.infoFechaDefuncion BETWEEN :inicio AND :fin")
    long countByFechaRange(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}
