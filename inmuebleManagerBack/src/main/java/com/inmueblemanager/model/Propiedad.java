package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "propiedad")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Propiedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre identificativo para el propietario, ej: "Piso Centro Madrid"
    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, length = 255)
    private String direccion;

    @Column(length = 100)
    private String ciudad;

    @Column(length = 100)
    private String pais;

    // Precio base por noche (o por día), se puede usar en cálculos
    @Column(name = "precio_noche", precision = 10, scale = 2)
    private BigDecimal precioNoche;

    // Propietario de esta propiedad (el usuario dueño)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    @ToString.Exclude
    private Usuario propietario;

    // Ocupaciones (reservas/alquileres) de esta propiedad
    @OneToMany(mappedBy = "propiedad", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @ToString.Exclude
    private List<Ocupacion> ocupaciones = new ArrayList<>();
}
