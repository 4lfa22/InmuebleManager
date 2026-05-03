package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String nombre;

    // Campos para 2FA
    @Column(name = "two_factor_enabled")
    @Builder.Default
    private Boolean twoFactorEnabled = false;

    @Column(name = "two_factor_code")
    private String twoFactorCode;

    @Column(name = "two_factor_code_expiry")
    private LocalDateTime twoFactorCodeExpiry;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Propiedad> propiedades = new ArrayList<>();
}
