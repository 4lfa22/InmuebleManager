package com.inmueblemanager.controller;

import com.inmueblemanager.dto.GastoDTO;
import com.inmueblemanager.model.Gasto;
import com.inmueblemanager.model.TipoGasto;
import com.inmueblemanager.service.GastoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@RequiredArgsConstructor
public class GastoController {

    private final GastoService gastoService;

    // ENDPOINT DESHABILITADO POR SEGURIDAD - usar /usuario/{usuarioId} o /propiedad/{propiedadId}
    // @GetMapping
    // public ResponseEntity<List<Gasto>> listarTodos() {
    //     return ResponseEntity.ok(gastoService.listar());
    // }

    @GetMapping("/{id}")
    public ResponseEntity<Gasto> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(gastoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<List<Gasto>> listarPorPropiedad(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(gastoService.listarPorPropiedad(propiedadId));
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<Gasto>> listarPorTipo(@PathVariable TipoGasto tipo) {
        return ResponseEntity.ok(gastoService.listarPorTipo(tipo));
    }

    @GetMapping("/propiedad/{propiedadId}/tipo/{tipo}")
    public ResponseEntity<List<Gasto>> listarPorPropiedadYTipo(
            @PathVariable Long propiedadId,
            @PathVariable TipoGasto tipo) {
        return ResponseEntity.ok(gastoService.listarPorPropiedadYTipo(propiedadId, tipo));
    }

    @GetMapping("/fechas")
    public ResponseEntity<List<Gasto>> listarPorFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.listarPorFechas(inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}/fechas")
    public ResponseEntity<List<Gasto>> listarPorPropiedadYFechas(
            @PathVariable Long propiedadId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.listarPorPropiedadYFechas(propiedadId, inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}/tipo/{tipo}/fechas")
    public ResponseEntity<List<Gasto>> listarPorPropiedadTipoYFechas(
            @PathVariable Long propiedadId,
            @PathVariable TipoGasto tipo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.listarPorPropiedadTipoYFechas(propiedadId, tipo, inicio, fin));
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Gasto>> listarPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(gastoService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<Gasto> crear(@Valid @RequestBody GastoDTO gastoDTO) {
        Gasto gastoCreado = gastoService.crearPorPropiedadId(
            gastoDTO.getPropiedadId(),
            TipoGasto.valueOf(gastoDTO.getTipo()),
            gastoDTO.getImporteBigDecimal(),
            gastoDTO.getFecha(),
            gastoDTO.getDescripcion()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(gastoCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Gasto> actualizar(@PathVariable Long id, @RequestBody Gasto gasto) {
        try {
            Gasto gastoActualizado = gastoService.actualizar(id, gasto);
            return ResponseEntity.ok(gastoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            gastoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== ENDPOINTS DE CÁLCULOS FINANCIEROS ====================

    @GetMapping("/propiedad/{propiedadId}/gastos-totales")
    public ResponseEntity<?> calcularGastosTotales(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(gastoService.calcularGastosTotales(propiedadId));
    }

    @GetMapping("/propiedad/{propiedadId}/gastos/fechas")
    public ResponseEntity<?> calcularGastosPorFechas(
            @PathVariable Long propiedadId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.calcularGastosPorFechas(propiedadId, inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}/tipo/{tipo}/gastos-totales")
    public ResponseEntity<?> calcularGastosPorTipo(
            @PathVariable Long propiedadId,
            @PathVariable TipoGasto tipo) {
        return ResponseEntity.ok(gastoService.calcularGastosPorTipo(propiedadId, tipo));
    }

    @GetMapping("/propiedad/{propiedadId}/tipo/{tipo}/gastos/fechas")
    public ResponseEntity<?> calcularGastosPorTipoYFechas(
            @PathVariable Long propiedadId,
            @PathVariable TipoGasto tipo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.calcularGastosPorTipoYFechas(propiedadId, tipo, inicio, fin));
    }

    @GetMapping("/propiedad/{propiedadId}/gastos-por-tipo")
    public ResponseEntity<?> obtenerGastosAgrupadosPorTipo(@PathVariable Long propiedadId) {
        return ResponseEntity.ok(gastoService.obtenerGastosAgrupadosPorTipo(propiedadId));
    }

    @GetMapping("/propiedad/{propiedadId}/gastos-por-tipo/fechas")
    public ResponseEntity<?> obtenerGastosAgrupadosPorTipoYFechas(
            @PathVariable Long propiedadId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(gastoService.obtenerGastosAgrupadosPorTipoYFechas(propiedadId, inicio, fin));
    }
}
