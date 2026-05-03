package com.inmueblemanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerifyCodeRequest {
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no es válido")
    private String email;
    
    @NotBlank(message = "El código es obligatorio")
    @Size(min = 6, max = 6, message = "El código debe tener 6 dígitos")
    private String code;
}
