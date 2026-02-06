package com.inmueblemanager.controller;

import com.inmueblemanager.model.PropiedadImagen;
import com.inmueblemanager.service.PropiedadImagenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/imagenes")
@RequiredArgsConstructor
public class PropiedadImagenController {

    private final PropiedadImagenService propiedadImagenService;

    @GetMapping
    public ResponseEntity<List<PropiedadImagen>> listarTodas() {
        return ResponseEntity.ok(propiedadImagenService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropiedadImagen> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(propiedadImagenService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<List<PropiedadImagen>> listarPorPropiedad(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(propiedadImagenService.listarPorPropiedad(propiedadId));
    }

    @PostMapping
    public ResponseEntity<PropiedadImagen> crear(@RequestBody PropiedadImagen propiedadImagen) {
        PropiedadImagen imagenCreada = propiedadImagenService.crear(propiedadImagen);
        return ResponseEntity.status(HttpStatus.CREATED).body(imagenCreada);
    }

    @PostMapping("/upload")
    public ResponseEntity<PropiedadImagen> subirArchivo(
            @RequestParam Long propiedadId,
            @RequestParam("archivo") MultipartFile archivo) {
        try {
            PropiedadImagen imagenCreada = propiedadImagenService.crearDesdeArchivo(propiedadId, archivo);
            return ResponseEntity.status(HttpStatus.CREATED).body(imagenCreada);
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropiedadImagen> actualizar(@PathVariable Long id, @RequestBody PropiedadImagen propiedadImagen) {
        try {
            PropiedadImagen imagenActualizada = propiedadImagenService.actualizar(id, propiedadImagen);
            return ResponseEntity.ok(imagenActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            propiedadImagenService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/propiedad/{propiedadId}/contar")
    public ResponseEntity<Long> contarPorPropiedad(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(propiedadImagenService.contarPorPropiedad(propiedadId));
    }
}
