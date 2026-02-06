package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "alquileres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alquiler extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @Column(name = "importe_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal importeTotal;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inquilino_id", nullable = false)
    @JsonIgnoreProperties({"alquileres", "documentoIdentidad", "email", "telefono"})
    private Inquilino inquilino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propiedad_id", nullable = false)
    @JsonIgnore
    private Propiedad propiedad;
}
