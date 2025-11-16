package com.inmueblemanager.repository;

import com.inmueblemanager.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Para buscar por email (útil para login, registro, etc.)
    Optional<Usuario> findByEmail(String email);

    boolean existsByEmail(String email);
}
