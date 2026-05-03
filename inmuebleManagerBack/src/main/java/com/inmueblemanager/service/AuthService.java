package com.inmueblemanager.service;

import com.inmueblemanager.dto.*;
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
    private final TwoFactorService twoFactorService;

    /**
     * Login de usuario - Si tiene 2FA activado, envía código en lugar de token
     */
    public LoginResponse login(LoginRequest loginRequest) {
        // Normalizar email (evitar problemas de mayúsculas/espacios)
        String email = loginRequest.getEmail() != null ? loginRequest.getEmail().trim().toLowerCase() : null;

        // Obtener usuario
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar contraseña
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            log.warn("Login fallido: bad credentials para email={} (userId={})", email, usuario.getId());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        log.info("Credenciales correctas para email={} (userId={})", email, usuario.getId());

        // Si tiene 2FA activado, generar y enviar código
        if (Boolean.TRUE.equals(usuario.getTwoFactorEnabled())) {
            twoFactorService.generateAndSendCode(usuario);
            log.info("2FA activado - código enviado a email={}", email);
            
            return LoginResponse.builder()
                    .requires2FA(true)
                    .twoFactorEnabled(true)
                    .id(usuario.getId())
                    .email(usuario.getEmail())
                    .nombre(usuario.getNombre())
                    .build();
        }

        // Si no tiene 2FA, generar token JWT directamente
        String token = tokenProvider.generateToken(usuario.getEmail());
        log.info("Login OK (sin 2FA) para email={} (userId={})", email, usuario.getId());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .expiresIn(tokenProvider.getExpirationTime())
                .requires2FA(false)
                .twoFactorEnabled(false)
                .build();
    }

    /**
     * Verifica el código 2FA y devuelve el token si es válido
     */
    public LoginResponse verifyTwoFactorCode(VerifyCodeRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null;

        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar el código
        if (!twoFactorService.verifyCode(usuario, request.getCode())) {
            throw new BadCredentialsException("Código de verificación inválido o expirado");
        }

        // Si el código es válido, generar token JWT
        String token = tokenProvider.generateToken(usuario.getEmail());
        log.info("2FA verificado exitosamente para email={} (userId={})", email, usuario.getId());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .id(usuario.getId())
                .email(usuario.getEmail())
                .nombre(usuario.getNombre())
                .expiresIn(tokenProvider.getExpirationTime())
                .requires2FA(false)
                .twoFactorEnabled(true)
                .build();
    }

    /**
     * Activa 2FA para el usuario autenticado
     */
    public TwoFactorToggleResponse enable2FA(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        twoFactorService.enable2FA(usuario);

        return TwoFactorToggleResponse.builder()
                .enabled(true)
                .mensaje("Autenticación de dos factores activada exitosamente")
                .build();
    }

    /**
     * Desactiva 2FA para el usuario autenticado
     */
    public TwoFactorToggleResponse disable2FA(Authentication authentication) {
        String email = authentication.getName();
        Usuario usuario = usuarioRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        twoFactorService.disable2FA(usuario);

        return TwoFactorToggleResponse.builder()
                .enabled(false)
                .mensaje("Autenticación de dos factores desactivada exitosamente")
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
                .twoFactorEnabled(false)
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
                .twoFactorEnabled(usuario.getTwoFactorEnabled())
                .build();
    }
}
