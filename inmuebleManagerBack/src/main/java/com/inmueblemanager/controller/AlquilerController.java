package com.inmueblemanager.controller;

import com.inmueblemanager.dto.AlquilerDTO;
import com.inmueblemanager.model.Alquiler;
import com.inmueblemanager.service.AlquilerService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/alquileres")
@RequiredArgsConstructor
public class AlquilerController {

    private final AlquilerService alquilerService;

    // ENDPOINT DESHABILITADO POR SEGURIDAD - usar /usuario/{usuarioId}
    // @GetMapping
    // public ResponseEntity<List<Alquiler>> listarTodos() {
    //     return ResponseEntity.ok(alquilerService.listar());
    // }

    @GetMapping("/{id}")
    public ResponseEntity<Alquiler> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(alquilerService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/propiedad/{propiedadId}/fechas")
    public ResponseEntity<List<Alquiler>> listarPorPropiedadYFechas(
            @PathVariable Long propiedadId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(alquilerService.listarPorPropiedadYFechas(propiedadId, inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<List<Alquiler>> listarPorPropiedad(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(alquilerService.listarPorPropiedad(propiedadId));
    }

    @GetMapping("/inquilino/{inquilinoId}")
    public ResponseEntity<List<Alquiler>> listarPorInquilino(@PathVariable Long inquilinoId) {
        return ResponseEntity.ok(alquilerService.listarPorInquilino(inquilinoId));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Alquiler>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(alquilerService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Alquiler> crear(@RequestBody AlquilerDTO alquilerDTO) {
        Alquiler alquilerCreado = alquilerService.crearPorIds(
            alquilerDTO.getInquilinoId(),
            alquilerDTO.getPropiedadId(),
            alquilerDTO.getFechaInicio(),
            alquilerDTO.getFechaFin(),
            alquilerDTO.getImporteTotal(),
            alquilerDTO.getMetodoPago()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(alquilerCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alquiler> actualizar(@PathVariable Long id, @RequestBody Alquiler alquiler) {
        try {
            Alquiler alquilerActualizado = alquilerService.actualizar(id, alquiler);
            return ResponseEntity.ok(alquilerActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            alquilerService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== ENDPOINTS DE CÁLCULOS FINANCIEROS ====================

    @GetMapping("/propiedad/{propiedadId}/ingresos-totales")
    public ResponseEntity<?> calcularIngresosTotales(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(alquilerService.calcularIngresosTotales(propiedadId));
    }

    @GetMapping("/propiedad/{propiedadId}/ingresos/fechas")
    public ResponseEntity<?> calcularIngresosPorFechas(
            @PathVariable Long propiedadId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(alquilerService.calcularIngresosPorFechas(propiedadId, inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}/inquilino/{inquilinoId}/ingresos")
    public ResponseEntity<?> calcularIngresosPorInquilino(
            @PathVariable Long propiedadId,
            @PathVariable Long inquilinoId) {
        return ResponseEntity.ok(alquilerService.calcularIngresosPorInquilino(propiedadId, inquilinoId));
    }
}
