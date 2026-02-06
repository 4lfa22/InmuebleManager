package com.inmueblemanager.service;

import com.inmueblemanager.dto.LoginRequest;
import com.inmueblemanager.dto.LoginResponse;
import com.inmueblemanager.dto.RegistroRequest;
import com.inmueblemanager.dto.RegistroResponse;
import com.inmueblemanager.model.Usuario;
import com.inmueblemanager.repository.UsuarioRepository;
import com.inmueblemanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    /**
     * Login de usuario y generación de token JWT
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // Normalizar email (evitar problemas de mayúsculas/espacios)
        String email = loginRequest.getEmail() != null ? loginRequest.getEmail().trim().toLowerCase() : null;

        // Obtener usuario
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña de forma explícita para diagnosticar 401
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            log.warn("Login fallido: bad credentials para email={} (userId={})", email, usuario.getId());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        log.info("Login OK para email={} (userId={})", email, usuario.getId());

        // Generar token JWT
        String token = tokenProvider.generateToken(usuario.getEmail());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .expiresIn(tokenProvider.getExpirationTime())
                .build();
    }

    /**
     * Registro de nuevo usuario
     */
    public RegistroResponse registro(RegistroRequest registroRequest) {
        // Normalizar email
        String email = registroRequest.getEmail() != null ? registroRequest.getEmail().trim().toLowerCase() : null;

        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = Usuario.builder()
                .email(email)
                .password(passwordEncoder.encode(registroRequest.getPassword()))
                .nombre(registroRequest.getNombre())
                .build();

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return RegistroResponse.builder()
                .id(usuarioGuardado.getId())
                .email(usuarioGuardado.getEmail())
                .nombre(usuarioGuardado.getNombre())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }

    /**
     * Obtener usuario autenticado actual
     */
    public LoginResponse getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuario no autenticado");
        }

        // El nombre del principal es el email del usuario (configurado en JwtTokenProvider)
        String email = authentication.getName();

        // Buscar el usuario en BD
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return LoginResponse.builder()
                .token(null)
                .type("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .expiresIn(0L)
                .build();
    }
}
