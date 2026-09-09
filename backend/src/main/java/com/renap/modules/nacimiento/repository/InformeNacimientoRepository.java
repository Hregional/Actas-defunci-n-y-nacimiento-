package com.renap.modules.nacimiento.repository;

import com.renap.modules.nacimiento.entity.InformeNacimiento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
public interface InformeNacimientoRepository extends JpaRepository<InformeNacimiento, Long> {

    Page<InformeNacimiento> findByEstado(String estado, Pageable pageable);

    @Query("""
        SELECT n FROM InformeNacimiento n
        WHERE (:search IS NULL OR :search = ''
            OR LOWER(n.ninoPrimerNombre) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(n.ninoPrimerApellido) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(n.madrePrimerApellido) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:estado IS NULL OR :estado = '' OR n.estado = :estado)
        ORDER BY n.createdAt DESC
    """)
    Page<InformeNacimiento> search(
            @Param("search") String search,
            @Param("estado") String estado,
            Pageable pageable);

    /** Cuenta registros cuya fecha de nacimiento está en el rango [inicio, fin] */
    @Query("SELECT COUNT(n) FROM InformeNacimiento n WHERE n.ninoFechaNacimiento BETWEEN :inicio AND :fin")
    long countByFechaRange(@Param("inicio") LocalDate inicio, @Param("fin") LocalDate fin);
}
