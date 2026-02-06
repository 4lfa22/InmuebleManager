package com.inmueblemanager.service;

import com.inmueblemanager.dto.ResumenFinanciero;
import com.inmueblemanager.dto.ResumenPorInquilino;
import com.inmueblemanager.model.Alquiler;
import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.model.TipoGasto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumenFinancieroService {

    private final PropiedadService propiedadService;
    private final AlquilerService alquilerService;
    private final GastoService gastoService;

    /**
     * Obtiene un resumen financiero completo de una propiedad
     */
    public ResumenFinanciero obtenerResumenPropiedad(Long propiedadId) {
        Propiedad propiedad = propiedadService.obtenerPorId(propiedadId);
        
        BigDecimal ingresos = alquilerService.calcularIngresosTotales(propiedadId);
        BigDecimal gastos = gastoService.calcularGastosTotales(propiedadId);
        BigDecimal beneficio = propiedadService.calcularBeneficioNeto(propiedadId);
        
        Map<TipoGasto, BigDecimal> gastosPorTipo = gastoService.obtenerGastosAgrupadosPorTipo(propiedadId);
        
        int numeroAlquileres = alquilerService.listarPorPropiedad(propiedadId).size();
        int numeroGastos = gastoService.listarPorPropiedad(propiedadId).size();
        
        return ResumenFinanciero.builder()
                .propiedadId(propiedadId)
                .nombrePropiedad(propiedad.getNombre())
                .ingresosTotales(ingresos)
                .gastosTotales(gastos)
                .beneficioNeto(beneficio)
                .gastosPorTipo(gastosPorTipo)
                .numeroAlquileres(numeroAlquileres)
                .numeroGastos(numeroGastos)
                .build();
    }

    /**
     * Obtiene un resumen financiero de una propiedad en un rango de fechas
     */
    public ResumenFinanciero obtenerResumenPropiedadPorFechas(Long propiedadId, LocalDate inicio, LocalDate fin) {
        Propiedad propiedad = propiedadService.obtenerPorId(propiedadId);
        
        BigDecimal ingresos = alquilerService.calcularIngresosPorFechas(propiedadId, inicio, fin);
        BigDecimal gastos = gastoService.calcularGastosPorFechas(propiedadId, inicio, fin);
        BigDecimal beneficio = propiedadService.calcularBeneficioNetoPorFechas(propiedadId, inicio, fin);
        
        Map<TipoGasto, BigDecimal> gastosPorTipo = gastoService.obtenerGastosAgrupadosPorTipoYFechas(propiedadId, inicio, fin);
        
        int numeroAlquileres = alquilerService.listarPorPropiedadYFechas(propiedadId, inicio, fin).size();
        int numeroGastos = gastoService.listarPorPropiedadYFechas(propiedadId, inicio, fin).size();
        
        return ResumenFinanciero.builder()
                .propiedadId(propiedadId)
                .nombrePropiedad(propiedad.getNombre())
                .ingresosTotales(ingresos)
                .gastosTotales(gastos)
                .beneficioNeto(beneficio)
                .gastosPorTipo(gastosPorTipo)
                .numeroAlquileres(numeroAlquileres)
                .numeroGastos(numeroGastos)
                .fechaInicio(inicio.toString())
                .fechaFin(fin.toString())
                .build();
    }

    /**
     * Obtiene el resumen financiero de todas las propiedades de un usuario
     */
    public List<ResumenFinanciero> obtenerResumenPorUsuario(Long usuarioId) {
        List<Propiedad> propiedades = propiedadService.listarPorUsuario(usuarioId);
        List<ResumenFinanciero> resumenes = new ArrayList<>();
        
        for (Propiedad propiedad : propiedades) {
            resumenes.add(obtenerResumenPropiedad(propiedad.getId()));
        }
        
        return resumenes;
    }

    /**
     * Obtiene el resumen financiero por inquilino en una propiedad
     */
    public List<ResumenPorInquilino> obtenerResumenPorInquilinos(Long propiedadId) {
        Propiedad propiedad = propiedadService.obtenerPorId(propiedadId);
        List<Alquiler> alquileres = alquilerService.listarPorPropiedad(propiedadId);
        List<ResumenPorInquilino> resumenes = new ArrayList<>();
        
        for (Alquiler alquiler : alquileres) {
            BigDecimal ingresos = alquiler.getImporteTotal();
            BigDecimal gastos = gastoService.calcularGastosPorFechas(
                    propiedadId, 
                    alquiler.getFechaInicio(), 
                    alquiler.getFechaFin()
            );
            BigDecimal beneficio = ingresos.subtract(gastos);
            
            long diasEstancia = ChronoUnit.DAYS.between(alquiler.getFechaInicio(), alquiler.getFechaFin());
            
            ResumenPorInquilino resumen = ResumenPorInquilino.builder()
                    .inquilinoId(alquiler.getInquilino().getId())
                    .nombreInquilino(alquiler.getInquilino().getNombre() + " " + alquiler.getInquilino().getApellidos())
                    .emailInquilino(alquiler.getInquilino().getEmail())
                    .propiedadId(propiedadId)
                    .nombrePropiedad(propiedad.getNombre())
                    .ingresosGenerados(ingresos)
                    .gastosAsociados(gastos)
                    .beneficioNeto(beneficio)
                    .fechaInicio(alquiler.getFechaInicio().toString())
                    .fechaFin(alquiler.getFechaFin().toString())
                    .diasEstancia((int) diasEstancia)
                    .build();
            
            resumenes.add(resumen);
        }
        
        return resumenes;
    }

    /**
     * Obtiene el resumen de un inquilino específico
     */
    public ResumenPorInquilino obtenerResumenInquilino(Long propiedadId, Long inquilinoId) {
        List<Alquiler> alquileres = alquilerService.listarPorPropiedadEInquilino(propiedadId, inquilinoId);
        
        if (alquileres.isEmpty()) {
            throw new RuntimeException("No se encontraron alquileres para este inquilino en esta propiedad");
        }
        
        // Tomamos el primer alquiler para obtener datos básicos
        Alquiler alquiler = alquileres.get(0);
        Propiedad propiedad = propiedadService.obtenerPorId(propiedadId);
        
        BigDecimal ingresos = alquilerService.calcularIngresosPorInquilino(propiedadId, inquilinoId);
        BigDecimal gastos = gastoService.calcularGastosPorFechas(
                propiedadId, 
                alquiler.getFechaInicio(), 
                alquiler.getFechaFin()
        );
        BigDecimal beneficio = ingresos.subtract(gastos);
        
        long diasEstancia = ChronoUnit.DAYS.between(alquiler.getFechaInicio(), alquiler.getFechaFin());
        
        return ResumenPorInquilino.builder()
                .inquilinoId(inquilinoId)
                .nombreInquilino(alquiler.getInquilino().getNombre() + " " + alquiler.getInquilino().getApellidos())
                .emailInquilino(alquiler.getInquilino().getEmail())
                .propiedadId(propiedadId)
                .nombrePropiedad(propiedad.getNombre())
                .ingresosGenerados(ingresos)
                .gastosAsociados(gastos)
                .beneficioNeto(beneficio)
                .fechaInicio(alquiler.getFechaInicio().toString())
                .fechaFin(alquiler.getFechaFin().toString())
                .diasEstancia((int) diasEstancia)
                .build();
    }
}
