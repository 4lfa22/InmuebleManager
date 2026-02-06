package com.inmueblemanager.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlquilerDTO {
    private Long id;
    private Long inquilinoId;
    private String inquilinoNombre;
    private Long propiedadId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private BigDecimal importeTotal;
    private String metodoPago;
}
