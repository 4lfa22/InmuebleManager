package com.inmueblemanager.service;

import com.inmueblemanager.model.Usuario;
import com.inmueblemanager.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class TwoFactorService {

    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;
    private static final int CODE_LENGTH = 6;
    private static final int CODE_EXPIRY_MINUTES = 10;

    /**
     * Genera y envía un código de verificación 2FA
     */
    @Transactional
    public void generateAndSendCode(Usuario usuario) {
        String code = generateCode();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES);

        usuario.setTwoFactorCode(code);
        usuario.setTwoFactorCodeExpiry(expiry);
        usuarioRepository.save(usuario);

        emailService.sendVerificationCode(usuario.getEmail(), code);
        log.info("Código 2FA generado para usuario: {}", usuario.getEmail());
    }

    /**
     * Verifica si un código 2FA es válido
     */
    public boolean verifyCode(Usuario usuario, String code) {
        if (usuario.getTwoFactorCode() == null || usuario.getTwoFactorCodeExpiry() == null) {
            log.warn("No hay código 2FA para el usuario: {}", usuario.getEmail());
            return false;
        }

        if (LocalDateTime.now().isAfter(usuario.getTwoFactorCodeExpiry())) {
            log.warn("Código 2FA expirado para usuario: {}", usuario.getEmail());
            return false;
        }

        boolean isValid = usuario.getTwoFactorCode().equals(code);
        if (isValid) {
            log.info("Código 2FA válido para usuario: {}", usuario.getEmail());
            clearCode(usuario);
        } else {
            log.warn("Código 2FA inválido para usuario: {}", usuario.getEmail());
        }

        return isValid;
    }

    /**
     * Limpia el código 2FA después de usarlo
     */
    @Transactional
    public void clearCode(Usuario usuario) {
        usuario.setTwoFactorCode(null);
        usuario.setTwoFactorCodeExpiry(null);
        usuarioRepository.save(usuario);
    }

    /**
     * Genera un código numérico aleatorio de 6 dígitos
     */
    private String generateCode() {
        SecureRandom random = new SecureRandom();
        int code = random.nextInt(900000) + 100000; // Genera entre 100000 y 999999
        return String.valueOf(code);
    }

    /**
     * Activa 2FA para un usuario
     */
    @Transactional
    public void enable2FA(Usuario usuario) {
        usuario.setTwoFactorEnabled(true);
        usuarioRepository.save(usuario);
        log.info("2FA activado para usuario: {}", usuario.getEmail());
    }

    /**
     * Desactiva 2FA para un usuario
     */
    @Transactional
    public void disable2FA(Usuario usuario) {
        usuario.setTwoFactorEnabled(false);
        clearCode(usuario);
        usuarioRepository.save(usuario);
        log.info("2FA desactivado para usuario: {}", usuario.getEmail());
    }
}
