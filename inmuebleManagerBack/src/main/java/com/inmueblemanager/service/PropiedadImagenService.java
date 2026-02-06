package com.inmueblemanager.service;

import com.inmueblemanager.model.PropiedadImagen;
import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.repository.PropiedadImagenRepository;
import com.inmueblemanager.repository.PropiedadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropiedadImagenService {

    private final PropiedadImagenRepository propiedadImagenRepository;
    private final PropiedadRepository propiedadRepository;

    public List<PropiedadImagen> listar() {
        return propiedadImagenRepository.findAll();
    }

    public PropiedadImagen obtenerPorId(Long id) {
        return propiedadImagenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
    }

    public List<PropiedadImagen> listarPorPropiedad(Long propiedadId) {
        return propiedadImagenRepository.findByPropiedadIdOrderByOrden(propiedadId);
    }

    public PropiedadImagen crear(PropiedadImagen propiedadImagen) {
        return propiedadImagenRepository.save(propiedadImagen);
    }

    public PropiedadImagen crearDesdeArchivo(Long propiedadId, MultipartFile archivo) throws IOException {
        Propiedad propiedad = propiedadRepository.findById(propiedadId)
                .orElseThrow(() -> new RuntimeException("Propiedad no encontrada"));

        String imagenData = Base64.getEncoder().encodeToString(archivo.getBytes());
        
        PropiedadImagen propiedadImagen = PropiedadImagen.builder()
                .imagenData(imagenData)
                .propiedad(propiedad)
                .orden(0)
                .build();

        return propiedadImagenRepository.save(propiedadImagen);
    }

    public PropiedadImagen actualizar(Long id, PropiedadImagen propiedadImagen) {
        PropiedadImagen imagenExistente = obtenerPorId(id);
        imagenExistente.setImagenData(propiedadImagen.getImagenData());
        imagenExistente.setOrden(propiedadImagen.getOrden());
        return propiedadImagenRepository.save(imagenExistente);
    }

    public void eliminar(Long id) {
        propiedadImagenRepository.deleteById(id);
    }

    public void eliminarPorPropiedad(Long propiedadId) {
        propiedadImagenRepository.deleteByPropiedadId(propiedadId);
    }

    public long contarPorPropiedad(Long propiedadId) {
        return propiedadImagenRepository.countByPropiedadId(propiedadId);
    }
}
