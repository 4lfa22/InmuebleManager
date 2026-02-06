package com.inmueblemanager.repository;

import com.inmueblemanager.model.PropiedadImagen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropiedadImagenRepository extends JpaRepository<PropiedadImagen, Long> {
    List<PropiedadImagen> findByPropiedadIdOrderByOrden(Long propiedadId);
    void deleteByPropiedadId(Long propiedadId);
    long countByPropiedadId(Long propiedadId);
}
