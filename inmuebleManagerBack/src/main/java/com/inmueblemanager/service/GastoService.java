package com.inmueblemanager.service;

import com.inmueblemanager.model.Gasto;
import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.model.TipoGasto;
import com.inmueblemanager.repository.GastoRepository;
import com.inmueblemanager.repository.PropiedadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GastoService {

    private final GastoRepository gastoRepository;
    private final PropiedadRepository propiedadRepository;

    public Gasto crear(Gasto gasto) {
        return gastoRepository.save(gasto);
    }

    public Gasto crearPorPropiedadId(Long propiedadId, TipoGasto tipo, BigDecimal importe, 
                                      LocalDate fecha, String descripcion) {
        Propiedad propiedad = propiedadRepository.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));
        
        Gasto gasto = Gasto.builder()
                .propiedad(propiedad)
                .tipo(tipo)
                .importe(importe)
                .fecha(fecha)
                .descripcion(descripcion)
                .build();
        
        return gastoRepository.save(gasto);
    }

    public List<Gasto> listar() {
        return gastoRepository.findAll();
    }

    public Gasto obtenerPorId(Long id) {
        return gastoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gasto no encontrado"));
    }

    public Gasto actualizar(Long id, Gasto gasto) {
        Gasto gastoExistente = obtenerPorId(id);
        gastoExistente.setTipo(gasto.getTipo());
        gastoExistente.setImporte(gasto.getImporte());
        gastoExistente.setFecha(gasto.getFecha());
        gastoExistente.setDescripcion(gasto.getDescripcion());
        return gastoRepository.save(gastoExistente);
    }

    public void eliminar(Long id) {
        gastoRepository.deleteById(id);
    }

    // ==================== MÉTODOS DE CONSULTA Y FILTRADO ====================

    public List<Gasto> listarPorPropiedad(Long propiedadId) {
        return gastoRepository.findByPropiedad_Id(propiedadId);
    }

    public List<Gasto> listarPorTipo(TipoGasto tipo) {
        return gastoRepository.findByTipo(tipo);
    }

    public List<Gasto> listarPorPropiedadYTipo(Long propiedadId, TipoGasto tipo) {
        return gastoRepository.findByPropiedad_IdAndTipo(propiedadId, tipo);
    }

    public List<Gasto> listarPorFechas(LocalDate inicio, LocalDate fin) {
        return gastoRepository.findByFechaBetween(inicio, fin);
    }

    public List<Gasto> listarPorPropiedadYFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        return gastoRepository.findByPropiedad_IdAndFechaBetween(propiedadId, inicio, fin);
    }

    public List<Gasto> listarPorPropiedadTipoYFechas(Long propiedadId, TipoGasto tipo, LocalDate inicio, LocalDate fin) {
        return gastoRepository.findByPropiedad_IdAndTipoAndFechaBetween(propiedadId, tipo, inicio, fin);
    }

    public List<Gasto> listarPorUsuario(Long usuarioId) {
        return gastoRepository.findByUsuarioId(usuarioId);
    }

    // ==================== MÉTODOS DE CÁLCULO FINANCIERO ====================

    public BigDecimal calcularGastosTotales(Long propiedadId) {
        return gastoRepository.calcularGastosTotalesByPropiedad(propiedadId);
    }

    public BigDecimal calcularGastosPorFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        return gastoRepository.calcularGastosByPropiedadAndFechas(propiedadId, inicio, fin);
    }

    public BigDecimal calcularGastosPorTipo(Long propiedadId, TipoGasto tipo) {
        return gastoRepository.calcularGastosByPropiedadAndTipo(propiedadId, tipo);
    }

    public BigDecimal calcularGastosPorTipoYFechas(Long propiedadId, TipoGasto tipo, LocalDate inicio, LocalDate fin) {
        return gastoRepository.calcularGastosByPropiedadTipoAndFechas(propiedadId, tipo, inicio, fin);
    }

    // ==================== MÉTODOS DE ANÁLISIS ====================

    public Map<TipoGasto, BigDecimal> obtenerGastosAgrupadosPorTipo(Long propiedadId) {
        List<Object[]> resultados = gastoRepository.obtenerGastosAgrupadosPorTipo(propiedadId);
        Map<TipoGasto, BigDecimal> gastosPorTipo = new HashMap<>();
        
        for (Object[] resultado : resultados) {
            TipoGasto tipo = (TipoGasto) resultado[0];
            BigDecimal total = (BigDecimal) resultado[1];
            gastosPorTipo.put(tipo, total);
        }
        
        return gastosPorTipo;
    }

    public Map<TipoGasto, BigDecimal> obtenerGastosAgrupadosPorTipoYFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        List<Object[]> resultados = gastoRepository.obtenerGastosAgrupadosPorTipoAndFechas(propiedadId, inicio, fin);
        Map<TipoGasto, BigDecimal> gastosPorTipo = new HashMap<>();
        
        for (Object[] resultado : resultados) {
            TipoGasto tipo = (TipoGasto) resultado[0];
            BigDecimal total = (BigDecimal) resultado[1];
            gastosPorTipo.put(tipo, total);
        }
        
        return gastosPorTipo;
    }
}
