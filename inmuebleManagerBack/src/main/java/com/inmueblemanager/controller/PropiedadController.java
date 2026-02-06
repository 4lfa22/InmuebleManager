package com.inmueblemanager.controller;

import com.inmueblemanager.model.Propiedad;
import com.inmueblemanager.model.Usuario;
import com.inmueblemanager.service.PropiedadService;
import com.inmueblemanager.service.UsuarioService;
import com.inmueblemanager.dto.ResumenFinanciero;
import com.inmueblemanager.dto.PropiedadRequest;
import com.inmueblemanager.dto.PropiedadResponse;
import com.inmueblemanager.service.ResumenFinancieroService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/propiedades")
@RequiredArgsConstructor
public class PropiedadController {

    private final PropiedadService propiedadService;
    private final UsuarioService usuarioService;
    private final ResumenFinancieroService resumenFinancieroService;

    // ENDPOINT DESHABILITADO POR SEGURIDAD - usar /usuario/{usuarioId}
    // @GetMapping
    // public ResponseEntity<List<PropiedadResponse>> listarTodas() {
    //     List<Propiedad> propiedades = propiedadService.listar();
    //     List<PropiedadResponse> responses = propiedades.stream()
    //             .map(p -> PropiedadResponse.builder()
    //                     .id(p.getId())
    //                     .nombre(p.getNombre())
    //                     .direccion(p.getDireccion())
    //                     .ciudad(p.getCiudad())
    //                     .tipo(p.getTipo())
    //                     .build())
    //             .collect(Collectors.toList());
    //     return ResponseEntity.ok(responses);
    // }

    @GetMapping("/{id}")
    public ResponseEntity<PropiedadResponse> obtenerPorId(@PathVariable Long id) {
        try {
            Propiedad propiedad = propiedadService.obtenerPorId(id);
            PropiedadResponse response = PropiedadResponse.builder()
                    .id(propiedad.getId())
                    .nombre(propiedad.getNombre())
                    .direccion(propiedad.getDireccion())
                    .ciudad(propiedad.getCiudad())
                    .tipo(propiedad.getTipo())
                    .build();
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<PropiedadResponse>> listarPorUsuario(@PathVariable Long usuarioId) {
        List<Propiedad> propiedades = propiedadService.listarPorUsuario(usuarioId);
        List<PropiedadResponse> responses = propiedades.stream()
                .map(p -> PropiedadResponse.builder()
                        .id(p.getId())
                        .nombre(p.getNombre())
                        .direccion(p.getDireccion())
                        .ciudad(p.getCiudad())
                        .tipo(p.getTipo())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/ciudad/{ciudad}")
    public ResponseEntity<List<PropiedadResponse>> listarPorCiudad(@PathVariable String ciudad) {
        List<Propiedad> propiedades = propiedadService.listarPorCiudad(ciudad);
        List<PropiedadResponse> responses = propiedades.stream()
                .map(p -> PropiedadResponse.builder()
                        .id(p.getId())
                        .nombre(p.getNombre())
                        .direccion(p.getDireccion())
                        .ciudad(p.getCiudad())
                        .tipo(p.getTipo())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<PropiedadResponse>> listarPorTipo(@PathVariable String tipo) {
        List<Propiedad> propiedades = propiedadService.listarPorTipo(tipo);
        List<PropiedadResponse> responses = propiedades.stream()
                .map(p -> PropiedadResponse.builder()
                        .id(p.getId())
                        .nombre(p.getNombre())
                        .direccion(p.getDireccion())
                        .ciudad(p.getCiudad())
                        .tipo(p.getTipo())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping
    public ResponseEntity<PropiedadResponse> crear(@RequestBody PropiedadRequest request) {
        // Obtener usuario
        Usuario usuario = usuarioService.obtenerPorId(request.getUsuarioId());
        
        // Crear propiedad
        Propiedad propiedad = Propiedad.builder()
                .nombre(request.getNombre())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .tipo(request.getTipo())
                .usuario(usuario)
                .build();
        
        Propiedad propiedadCreada = propiedadService.crear(propiedad);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(
            PropiedadResponse.builder()
                .id(propiedadCreada.getId())
                .nombre(propiedadCreada.getNombre())
                .direccion(propiedadCreada.getDireccion())
                .ciudad(propiedadCreada.getCiudad())
                .tipo(propiedadCreada.getTipo())
                .usuarioId(propiedadCreada.getUsuario().getId())
                .build()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Propiedad> actualizar(@PathVariable Long id, @RequestBody Propiedad propiedad) {
        try {
            Propiedad propiedadActualizada = propiedadService.actualizar(id, propiedad);
            return ResponseEntity.ok(propiedadActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            propiedadService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ==================== ENDPOINTS DE RESUMEN FINANCIERO ====================

    @GetMapping("/{id}/resumen")
    public ResponseEntity<ResumenFinanciero> obtenerResumen(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPropiedad(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/resumen/fechas")
    public ResponseEntity<ResumenFinanciero> obtenerResumenPorFechas(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        try {
            return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPropiedadPorFechas(id, inicio, fin));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/usuario/{usuarioId}/resumen")
    public ResponseEntity<List<ResumenFinanciero>> obtenerResumenPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(resumenFinancieroService.obtenerResumenPorUsuario(usuarioId));
    }
}
