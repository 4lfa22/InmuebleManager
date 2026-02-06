package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "gastos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gasto extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoGasto tipo;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal importe;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propiedad_id", nullable = false)
    @JsonIgnore
    private Propiedad propiedad;
    
    // Método para exponer el ID de la propiedad sin cargar toda la entidad
    public Long getPropiedadId() {
        return propiedad != null ? propiedad.getId() : null;
    }
}
