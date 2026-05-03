package com.inmueblemanager.controller;

import com.inmueblemanager.dto.*;
import com.inmueblemanager.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-2fa")
    public ResponseEntity<LoginResponse> verifyTwoFactor(@Valid @RequestBody VerifyCodeRequest request) {
        LoginResponse response = authService.verifyTwoFactorCode(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/enable")
    public ResponseEntity<TwoFactorToggleResponse> enable2FA() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        TwoFactorToggleResponse response = authService.enable2FA(authentication);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/2fa/disable")
    public ResponseEntity<TwoFactorToggleResponse> disable2FA() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        TwoFactorToggleResponse response = authService.disable2FA(authentication);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<RegistroResponse> registro(@Valid @RequestBody RegistroRequest registroRequest) {
        RegistroResponse response = authService.registro(registroRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<LoginResponse> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        LoginResponse response = authService.getCurrentUser(authentication);
        return ResponseEntity.ok(response);
    }
}
