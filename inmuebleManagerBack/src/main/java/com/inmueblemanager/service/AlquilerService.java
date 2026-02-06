package com.inmueblemanager.service;

import com.inmueblemanager.model.Alquiler;
import com.inmueblemanager.model.Inquilino;
import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.repository.AlquilerRepository;
import com.inmueblemanager.repository.InquilinoRepository;
import com.inmueblemanager.repository.PropiedadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AlquilerService {

    private final AlquilerRepository alquilerRepository;
    private final InquilinoRepository inquilinoRepository;
    private final PropiedadRepository propiedadRepository;

    public Alquiler crear(Alquiler alquiler) {
        return alquilerRepository.save(alquiler);
    }

    public Alquiler crearPorIds(Long inquilinoId, Long propiedadId, LocalDate fechaInicio, 
                                 LocalDate fechaFin, BigDecimal importeTotal, String metodoPago) {
        Inquilino inquilino = inquilinoRepository.findById(inquilinoId)
                .orElseThrow(() -> new RuntimeException("Inquilino no encontrado"));
        
        Propiedad propiedad = propiedadRepository.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));
        
        Alquiler alquiler = Alquiler.builder()
                .inquilino(inquilino)
                .propiedad(propiedad)
                .fechaInicio(fechaInicio)
                .fechaFin(fechaFin)
                .importeTotal(importeTotal)
                .metodoPago(metodoPago)
                .build();
        
        return alquilerRepository.save(alquiler);
    }

    public List<Alquiler> listar() {
        return alquilerRepository.findAll();
    }

    public Alquiler obtenerPorId(Long id) {
        return alquilerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alquiler no encontrado"));
    }

    public Alquiler actualizar(Long id, Alquiler alquiler) {
        Alquiler alquilerExistente = obtenerPorId(id);
        alquilerExistente.setFechaInicio(alquiler.getFechaInicio());
        alquilerExistente.setFechaFin(alquiler.getFechaFin());
        alquilerExistente.setImporteTotal(alquiler.getImporteTotal());
        alquilerExistente.setMetodoPago(alquiler.getMetodoPago());
        return alquilerRepository.save(alquilerExistente);
    }

    public void eliminar(Long id) {
        alquilerRepository.deleteById(id);
    }

    // ==================== MÉTODOS DE CONSULTA Y FILTRADO ====================

    public List<Alquiler> listarPorPropiedad(Long propiedadId) {
        return alquilerRepository.findByPropiedadId(propiedadId);
    }

    public List<Alquiler> listarPorInquilino(Long inquilinoId) {
        return alquilerRepository.findByInquilinoId(inquilinoId);
    }

    public List<Alquiler> listarPorPropiedadYFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        return alquilerRepository.findByPropiedadIdAndFechasBetween(propiedadId, inicio, fin);
    }

    public List<Alquiler> listarPorPropiedadEInquilino(Long propiedadId, Long inquilinoId) {
        return alquilerRepository.findByPropiedadIdAndInquilinoId(propiedadId, inquilinoId);
    }

    public List<Alquiler> listarPorUsuario(Long usuarioId) {
        return alquilerRepository.findByUsuarioId(usuarioId);
    }

    // ==================== MÉTODOS DE CÁLCULO FINANCIERO ====================

    public BigDecimal calcularIngresosTotales(Long propiedadId) {
        return alquilerRepository.calcularIngresosTotalesByPropiedad(propiedadId);
    }

    public BigDecimal calcularIngresosPorFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        return alquilerRepository.calcularIngresosByPropiedadAndFechas(propiedadId, inicio, fin);
    }

    public BigDecimal calcularIngresosPorInquilino(Long propiedadId, Long inquilinoId) {
        return alquilerRepository.calcularIngresosByPropiedadAndInquilino(propiedadId, inquilinoId);
    }
}
