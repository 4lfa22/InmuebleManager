package com.inmueblemanager.repository;

import com.inmueblemanager.model.Inquilino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface InquilinoRepository extends JpaRepository<Inquilino, Long> {

    // Buscar inquilino por email
    Optional<Inquilino> findByEmail(String email);

    // Buscar inquilino por teléfono
    Optional<Inquilino> findByTelefono(String telefono);

    // Buscar inquilinos por nombre (búsqueda parcial)
    List<Inquilino> findByNombreContainingIgnoreCase(String nombre);

    // Verificar si existe un inquilino por email
    boolean existsByEmail(String email);

    // Obtener inquilinos que han alquilado una propiedad específica
    @Query("SELECT DISTINCT a.inquilino FROM Alquiler a WHERE a.propiedad.id = :propiedadId")
    List<Inquilino> findByPropiedadId(@Param("propiedadId") Long propiedadId);

    // Obtener inquilinos de propiedades de un usuario
    @Query("SELECT DISTINCT a.inquilino FROM Alquiler a WHERE a.propiedad.usuario.id = :usuarioId")
    List<Inquilino> findByUsuarioId(@Param("usuarioId") Long usuarioId);
}
