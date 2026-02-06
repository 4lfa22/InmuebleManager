package com.inmueblemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropiedadResponse {
    private Long id;
    private String nombre;
    private String direccion;
    private String ciudad;
    private String tipo;
    private Long usuarioId;
}
