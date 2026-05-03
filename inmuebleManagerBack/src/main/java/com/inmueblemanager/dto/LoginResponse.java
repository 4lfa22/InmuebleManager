package com.inmueblemanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String nombre;
    private Long expiresIn;
    private Boolean requires2FA; // Indica si se requiere código 2FA
    private Boolean twoFactorEnabled; // Indica si el usuario tiene 2FA activado
}
