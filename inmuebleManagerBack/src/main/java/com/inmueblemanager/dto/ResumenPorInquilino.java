package com.inmueblemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumenPorInquilino {

    private Long inquilinoId;
    private String nombreInquilino;
    private String emailInquilino;
    
    private Long propiedadId;
    private String nombrePropiedad;
    
    // Datos financieros del inquilino
    private BigDecimal ingresosGenerados;
    private BigDecimal gastosAsociados;
    private BigDecimal beneficioNeto;
    
    // Período de estancia
    private String fechaInicio;
    private String fechaFin;
    private Integer diasEstancia;
}
