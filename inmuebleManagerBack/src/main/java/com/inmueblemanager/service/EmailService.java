package com.inmueblemanager.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationCode(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Código de Verificación - InmuebleManager");
            message.setText(buildVerificationEmailBody(code));
            
            mailSender.send(message);
            log.info("Código de verificación enviado a: {}", toEmail);
        } catch (Exception e) {
            log.error("Error al enviar email a {}: {}", toEmail, e.getMessage());
            throw new RuntimeException("Error al enviar el código de verificación");
        }
    }

    private String buildVerificationEmailBody(String code) {
        return String.format(
            """
            Hola,
            
            Has solicitado un código de verificación para acceder a InmuebleManager.
            
            Tu código de verificación es: %s
            
            Este código expirará en 10 minutos.
            
            Si no has solicitado este código, por favor ignora este mensaje.
            
            Saludos,
            El equipo de InmuebleManager
            """,
            code
        );
    }
}
