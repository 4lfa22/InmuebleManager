package com.inmueblemanager.repository;

import com.inmueblemanager.model.Alquiler;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {

    // Buscar alquileres por propiedad
    List<Alquiler> findByPropiedadId(Long propiedadId);

    // Buscar alquileres por inquilino
    List<Alquiler> findByInquilinoId(Long inquilinoId);

    // Buscar alquileres por rango de fechas
    List<Alquiler> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);

    // Buscar alquileres de una propiedad en un rango de fechas
    @Query("SELECT a FROM Alquiler a WHERE a.propiedad.id = :propiedadId " +
           "AND ((a.fechaInicio BETWEEN :inicio AND :fin) OR (a.fechaFin BETWEEN :inicio AND :fin) " +
           "OR (a.fechaInicio <= :inicio AND a.fechaFin >= :fin))")
    List<Alquiler> findByPropiedadIdAndFechasBetween(
            @Param("propiedadId") Long propiedadId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    // Buscar alquileres de un inquilino en una propiedad específica
    List<Alquiler> findByPropiedadIdAndInquilinoId(Long propiedadId, Long inquilinoId);

    // Calcular ingresos totales por propiedad
    @Query("SELECT COALESCE(SUM(a.importeTotal), 0) FROM Alquiler a WHERE a.propiedad.id = :propiedadId")
    BigDecimal calcularIngresosTotalesByPropiedad(@Param("propiedadId") Long propiedadId);

    // Calcular ingresos por propiedad en un rango de fechas
    @Query("SELECT COALESCE(SUM(a.importeTotal), 0) FROM Alquiler a WHERE a.propiedad.id = :propiedadId " +
           "AND ((a.fechaInicio BETWEEN :inicio AND :fin) OR (a.fechaFin BETWEEN :inicio AND :fin) " +
           "OR (a.fechaInicio <= :inicio AND a.fechaFin >= :fin))")
    BigDecimal calcularIngresosByPropiedadAndFechas(
            @Param("propiedadId") Long propiedadId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    // Calcular ingresos por inquilino en una propiedad
    @Query("SELECT COALESCE(SUM(a.importeTotal), 0) FROM Alquiler a " +
           "WHERE a.propiedad.id = :propiedadId AND a.inquilino.id = :inquilinoId")
    BigDecimal calcularIngresosByPropiedadAndInquilino(
            @Param("propiedadId") Long propiedadId,
            @Param("inquilinoId") Long inquilinoId
    );

    // Buscar alquileres por usuario (a través de propiedad)
    @Query("SELECT a FROM Alquiler a WHERE a.propiedad.usuario.id = :usuarioId")
    List<Alquiler> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
