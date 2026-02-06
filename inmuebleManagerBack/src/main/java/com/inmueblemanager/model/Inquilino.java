package com.inmueblemanager.model;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inquilinos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquilino extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellidos;

    @Column(name = "documento_identidad")
    private String documentoIdentidad;

    @Column(unique = true)
    private String email;

    @Column(name = "telefono")
    private String telefono;

    @OneToMany(mappedBy = "inquilino", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    @JsonIgnore
    private List<Alquiler> alquileres = new ArrayList<>();
}
