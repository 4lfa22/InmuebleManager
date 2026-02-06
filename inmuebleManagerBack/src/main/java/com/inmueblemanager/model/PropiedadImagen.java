package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "propiedad_imagenes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PropiedadImagen extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imagen_data", columnDefinition = "TEXT", nullable = false)
    private String imagenData;

    @Column(name = "orden")
    private Integer orden = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propiedad_id", nullable = false)
    private Propiedad propiedad;
}
