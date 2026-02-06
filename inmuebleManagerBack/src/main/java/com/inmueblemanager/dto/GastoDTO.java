package com.inmueblemanager.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GastoDTO {
    private Long id;
    
    @NotBlank(message = "La descripción es requerida")
    private String descripcion;
    
    @NotBlank(message = "El tipo es requerido")
    private String tipo;
    
    @NotNull(message = "El importe es requerido")
    @DecimalMin(value = "0.0", message = "El importe debe ser mayor que 0")
    private Double importe;
    
    @NotNull(message = "La fecha es requerida")
    private LocalDate fecha;
    
    @NotNull(message = "El ID de propiedad es requerido")
    private Long propiedadId;
    
    // Método helper para convertir a BigDecimal
    public BigDecimal getImporteBigDecimal() {
        return importe != null ? BigDecimal.valueOf(importe) : null;
    }
}
