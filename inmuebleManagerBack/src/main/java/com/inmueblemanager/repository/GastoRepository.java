package com.inmueblemanager.repository;

import com.inmueblemanager.model.Gasto;
import com.inmueblemanager.model.TipoGasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {

    // Buscar gastos por propiedad
    List<Gasto> findByPropiedad_Id(Long propiedadId);

    // Buscar gastos por tipo
    List<Gasto> findByTipo(TipoGasto tipo);

    // Buscar gastos por propiedad y tipo
    List<Gasto> findByPropiedad_IdAndTipo(Long propiedadId, TipoGasto tipo);

    // Buscar gastos por rango de fechas
    List<Gasto> findByFechaBetween(LocalDate inicio, LocalDate fin);

    // Buscar gastos por propiedad en un rango de fechas
    List<Gasto> findByPropiedad_IdAndFechaBetween(Long propiedadId, LocalDate inicio, LocalDate fin);

    // Buscar gastos por propiedad, tipo y rango de fechas
    List<Gasto> findByPropiedad_IdAndTipoAndFechaBetween(
            Long propiedadId,
            TipoGasto tipo,
            LocalDate inicio,
            LocalDate fin
    );

    // Calcular gastos totales por propiedad
    @Query("SELECT COALESCE(SUM(g.importe), 0) FROM Gasto g WHERE g.propiedad.id = :propiedadId")
    BigDecimal calcularGastosTotalesByPropiedad(@Param("propiedadId") Long propiedadId);

    // Calcular gastos por propiedad en un rango de fechas
    @Query("SELECT COALESCE(SUM(g.importe), 0) FROM Gasto g " +
           "WHERE g.propiedad.id = :propiedadId AND g.fecha BETWEEN :inicio AND :fin")
    BigDecimal calcularGastosByPropiedadAndFechas(
            @Param("propiedadId") Long propiedadId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    // Calcular gastos por propiedad y tipo
    @Query("SELECT COALESCE(SUM(g.importe), 0) FROM Gasto g " +
           "WHERE g.propiedad.id = :propiedadId AND g.tipo = :tipo")
    BigDecimal calcularGastosByPropiedadAndTipo(
            @Param("propiedadId") Long propiedadId,
            @Param("tipo") TipoGasto tipo
    );

    // Calcular gastos por tipo en un rango de fechas
    @Query("SELECT COALESCE(SUM(g.importe), 0) FROM Gasto g " +
           "WHERE g.propiedad.id = :propiedadId AND g.tipo = :tipo AND g.fecha BETWEEN :inicio AND :fin")
    BigDecimal calcularGastosByPropiedadTipoAndFechas(
            @Param("propiedadId") Long propiedadId,
            @Param("tipo") TipoGasto tipo,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    // Obtener gastos agrupados por tipo para una propiedad
    @Query("SELECT g.tipo, SUM(g.importe) FROM Gasto g " +
           "WHERE g.propiedad.id = :propiedadId GROUP BY g.tipo")
    List<Object[]> obtenerGastosAgrupadosPorTipo(@Param("propiedadId") Long propiedadId);

    // Obtener gastos agrupados por tipo en un rango de fechas
    @Query("SELECT g.tipo, SUM(g.importe) FROM Gasto g " +
           "WHERE g.propiedad.id = :propiedadId AND g.fecha BETWEEN :inicio AND :fin GROUP BY g.tipo")
    List<Object[]> obtenerGastosAgrupadosPorTipoAndFechas(
            @Param("propiedadId") Long propiedadId,
            @Param("inicio") LocalDate inicio,
            @Param("fin") LocalDate fin
    );

    // Buscar gastos por usuario (a través de propiedad)
    @Query("SELECT g FROM Gasto g WHERE g.propiedad.usuario.id = :usuarioId")
    List<Gasto> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
