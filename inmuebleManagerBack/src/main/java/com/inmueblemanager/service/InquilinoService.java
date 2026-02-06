package com.inmueblemanager.service;

import com.inmueblemanager.model.Inquilino;
import com.inmueblemanager.repository.InquilinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InquilinoService {

    private final InquilinoRepository inquilinoRepository;

    public Inquilino crear(Inquilino inquilino) {
        return inquilinoRepository.save(inquilino);
    }

    public List<Inquilino> listar() {
        return inquilinoRepository.findAll();
    }

    public Inquilino obtenerPorId(Long id) {
        return inquilinoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquilino no encontrado"));
    }

    public Inquilino obtenerPorEmail(String email) {
        return inquilinoRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Inquilino no encontrado"));
    }

    public Inquilino obtenerPorTelefono(String telefono) {
        return inquilinoRepository.findByTelefono(telefono)
                .orElseThrow(() -> new RuntimeException("Inquilino no encontrado"));
    }

    public List<Inquilino> buscarPorNombre(String nombre) {
        return inquilinoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public boolean existePorEmail(String email) {
        return inquilinoRepository.existsByEmail(email);
    }

    public List<Inquilino> listarPorPropiedad(Long propiedadId) {
        return inquilinoRepository.findByPropiedadId(propiedadId);
    }

    public List<Inquilino> listarPorUsuario(Long usuarioId) {
        return inquilinoRepository.findByUsuarioId(usuarioId);
    }

    public Inquilino actualizar(Long id, Inquilino inquilino) {
        Inquilino inquilinoExistente = obtenerPorId(id);
        inquilinoExistente.setNombre(inquilino.getNombre());
        inquilinoExistente.setApellidos(inquilino.getApellidos());
        inquilinoExistente.setEmail(inquilino.getEmail());
        inquilinoExistente.setTelefono(inquilino.getTelefono());
        inquilinoExistente.setDocumentoIdentidad(inquilino.getDocumentoIdentidad());
        return inquilinoRepository.save(inquilinoExistente);
    }

    public void eliminar(Long id) {
        inquilinoRepository.deleteById(id);
    }
}
