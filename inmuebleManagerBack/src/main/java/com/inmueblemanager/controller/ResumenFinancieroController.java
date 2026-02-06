package com.inmueblemanager.controller;

import com.inmueblemanager.dto.ResumenFinanciero;
import com.inmueblemanager.dto.ResumenPorInquilino;
import com.inmueblemanager.service.ResumenFinancieroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resumen-financiero")
@RequiredArgsConstructor
public class ResumenFinancieroController {

    private final ResumenFinancieroService resumenFinancieroService;

    @GetMapping("/propiedad/{propiedadId}")
    public ResponseEntity<ResumenFinanciero> obtenerResumenPropiedad(@PathVariable Long propiedadId) {
        try {
            return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPropiedad(propiedadId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ResumenFinanciero>> obtenerResumenPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPorUsuario(usuarioId));
    }

    @GetMapping("/propiedad/{propiedadId}/inquilinos")
    public ResponseEntity<List<ResumenPorInquilino>> obtenerResumenPorInquilinos(@PathVariable Long propiedadId) {
        try {
            return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPorInquilinos(propiedadId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/propiedad/{propiedadId}/inquilino/{inquilinoId}")
    public ResponseEntity<ResumenPorInquilino> obtenerResumenInquilino(
            @PathVariable Long propiedadId,
            @PathVariable Long inquilinoId) {
        try {
            return ResponseEntity.ok(resumenFinancieroService.obtenerResumenInquilino(propiedadId, inquilinoId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
