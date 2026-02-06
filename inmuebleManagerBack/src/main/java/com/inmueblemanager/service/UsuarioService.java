package com.inmueblemanager.service;

import com.inmueblemanager.model.Usuario;
import com.inmueblemanager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public Usuario crear(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario actualizar(Long id, Usuario usuario) {
        Usuario usuarioExistente = obtenerPorId(id);
        usuarioExistente.setEmail(usuario.getEmail());
        usuarioExistente.setNombre(usuario.getNombre());
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            usuarioExistente.setPassword(usuario.getPassword());
        }
        return usuarioRepository.save(usuarioExistente);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }
}
