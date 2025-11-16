package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ocupacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ocupacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Propiedad a la que pertenece esta ocupación
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propiedad_id", nullable = false)
    @ToString.Exclude
    private Propiedad propiedad;

    // Opcional: nombre del inquilino, por si el propietario quiere apuntarlo
    @Column(name = "nombre_inquilino", length = 150)
    private String nombreInquilino;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    // Importe total cobrado por esta ocupación
    @Column(name = "importe_total", precision = 12, scale = 2, nullable = false)
    private BigDecimal importeTotal;

    // Tipo de pago: transferencia, efectivo, tarjeta, bizum...
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pago", length = 20)
    private TipoPago tipoPago;

    // Estado de la ocupación: reservado, en curso, finalizado, cancelado...
    @Enumerated(EnumType.STRING)
    @Column(name = "estado", length = 20)
    private EstadoOcupacion estado;
}
