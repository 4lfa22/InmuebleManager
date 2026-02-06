package com.inmueblemanager.service;

import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.repository.PropiedadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropiedadService {

    private final PropiedadRepository propiedadRepository;
    private final AlquilerService alquilerService;
    private final GastoService gastoService;

    public Propiedad crear(Propiedad propiedad) {
        return propiedadRepository.save(propiedad);
    }

    public List<Propiedad> listar() {
        return propiedadRepository.findAll();
    }

    public Propiedad obtenerPorId(Long id) {
        return propiedadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));
    }

    public Propiedad actualizar(Long id, Propiedad propiedad) {
        Propiedad propiedadExistente = obtenerPorId(id);
        propiedadExistente.setNombre(propiedad.getNombre());
        propiedadExistente.setDireccion(propiedad.getDireccion());
        propiedadExistente.setCiudad(propiedad.getCiudad());
        propiedadExistente.setTipo(propiedad.getTipo());
        return propiedadRepository.save(propiedadExistente);
    }

    public void eliminar(Long id) {
        propiedadRepository.deleteById(id);
    }

    // ==================== MÉTODOS DE CONSULTA Y FILTRADO ====================

    public List<Propiedad> listarPorUsuario(Long usuarioId) {
        return propiedadRepository.findByUsuarioId(usuarioId);
    }

    public List<Propiedad> listarPorCiudad(String ciudad) {
        return propiedadRepository.findByCiudad(ciudad);
    }

    public List<Propiedad> listarPorTipo(String tipo) {
        return propiedadRepository.findByTipo(tipo);
    }

    public List<Propiedad> listarPorUsuarioYCiudad(Long usuarioId, String ciudad) {
        return propiedadRepository.findByUsuarioIdAndCiudad(usuarioId, ciudad);
    }

    public Long contarPropiedadesPorUsuario(Long usuarioId) {
        return propiedadRepository.contarPropiedadesByUsuario(usuarioId);
    }

    // ==================== MÉTODOS DE ANÁLISIS FINANCIERO ====================

    /**
     * Calcula el beneficio neto de una propiedad (ingresos - gastos)
     */
    public BigDecimal calcularBeneficioNeto(Long propiedadId) {
        BigDecimal ingresos = alquilerService.calcularIngresosTotales(propiedadId);
        BigDecimal gastos = gastoService.calcularGastosTotales(propiedadId);
        return ingresos.subtract(gastos);
    }

    /**
     * Calcula el beneficio neto de una propiedad en un rango de fechas
     */
    public BigDecimal calcularBeneficioNetoPorFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        BigDecimal ingresos = alquilerService.calcularIngresosPorFechas(propiedadId, inicio, fin);
        BigDecimal gastos = gastoService.calcularGastosPorFechas(propiedadId, inicio, fin);
        return ingresos.subtract(gastos);
    }

    /**
     * Calcula el beneficio generado por un inquilino específico (ingresos del inquilino - gastos durante su estancia)
     */
    public BigDecimal calcularBeneficioPorInquilino(Long propiedadId, Long inquilinoId, LocalDate inicio, LocalDate fin) {
        BigDecimal ingresos = alquilerService.calcularIngresosPorInquilino(propiedadId, inquilinoId);
        BigDecimal gastos = gastoService.calcularGastosPorFechas(propiedadId, inicio, fin);
        return ingresos.subtract(gastos);
    }
}
