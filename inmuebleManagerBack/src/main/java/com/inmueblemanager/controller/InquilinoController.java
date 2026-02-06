package com.inmueblemanager.controller;

import com.inmueblemanager.model.Inquilino;
import com.inmueblemanager.service.InquilinoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquilinos")
@RequiredArgsConstructor
public class InquilinoController {

    private final InquilinoService inquilinoService;

    // ENDPOINT DESHABILITADO POR SEGURIDAD - usar /usuario/{usuarioId}
    // @GetMapping
    // public ResponseEntity<List<Inquilino>> listarTodos() {
    //     return ResponseEntity.ok(inquilinoService.listar());
    // }

    @GetMapping("/{id}")
    public ResponseEntity<Inquilino> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(inquilinoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Inquilino> obtenerPorEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(inquilinoService.obtenerPorEmail(email));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/telefono/{telefono}")
    public ResponseEntity<Inquilino> obtenerPorTelefono(@PathVariable String telefono) {
        try {
            return ResponseEntity.ok(inquilinoService.obtenerPorTelefono(telefono));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Inquilino>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(inquilinoService.buscarPorNombre(nombre));
    }

    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<List<Inquilino>> listarPorPropiedad(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(inquilinoService.listarPorPropiedad(propiedadId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Inquilino>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(inquilinoService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Inquilino> crear(@RequestBody Inquilino inquilino) {
        if (inquilinoService.existePorEmail(inquilino.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Inquilino inquilinoCreado = inquilinoService.crear(inquilino);
        return ResponseEntity.status(HttpStatus.CREATED).body(inquilinoCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Inquilino> actualizar(@PathVariable Long id, @RequestBody Inquilino inquilino) {
        try {
            Inquilino inquilinoActualizado = inquilinoService.actualizar(id, inquilino);
            return ResponseEntity.ok(inquilinoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            inquilinoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
