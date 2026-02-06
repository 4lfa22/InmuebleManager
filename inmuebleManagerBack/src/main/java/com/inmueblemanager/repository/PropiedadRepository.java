package com.inmueblemanager.repository;

import com.inmueblemanager.model.Propiedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropiedadRepository extends JpaRepository<Propiedad, Long> {

    // Buscar propiedades por usuario
    List<Propiedad> findByUsuarioId(Long usuarioId);

    // Buscar propiedades por ciudad
    List<Propiedad> findByCiudad(String ciudad);

    // Buscar propiedades por tipo
    List<Propiedad> findByTipo(String tipo);

    // Buscar propiedades por usuario y ciudad
    List<Propiedad> findByUsuarioIdAndCiudad(Long usuarioId, String ciudad);

    // Buscar propiedades por usuario y tipo
    List<Propiedad> findByUsuarioIdAndTipo(Long usuarioId, String tipo);

    // Contar propiedades por usuario
    @Query("SELECT COUNT(p) FROM Propiedad p WHERE p.usuario.id = :usuarioId")
    Long contarPropiedadesByUsuario(@Param("usuarioId") Long usuarioId);
}
