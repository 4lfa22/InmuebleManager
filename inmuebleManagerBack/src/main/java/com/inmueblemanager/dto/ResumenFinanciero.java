package com.inmueblemanager.dto;

import com.inmueblemanager.model.TipoGasto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenFinanciero {

    private Long propiedadId;
    private String nombrePropiedad;
    
    // Datos financieros principales
    private BigDecimal ingresosTotales;
    private BigDecimal gastosTotales;
    private BigDecimal beneficioNeto;
    
    // Desglose de gastos por tipo
    private Map<TipoGasto, BigDecimal> gastosPorTipo;
    
    // Estadísticas adicionales
    private Integer numeroAlquileres;
    private Integer numeroGastos;
    
    // Período analizado (opcional)
    private String fechaInicio;
    private String fechaFin;
}
