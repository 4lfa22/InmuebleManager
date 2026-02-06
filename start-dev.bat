@echo off
REM Script para iniciar el desarrollo local (sin ngrok)
REM Inicia tanto el frontend (Angular) como el backend (Spring Boot)

echo ============================================
echo  InmuebleManager - Desarrollo Local
echo ============================================
echo.
echo Terminal 1: Iniciando Backend (Puerto 8080)...
echo Terminal 2: Iniciando Frontend (Puerto 4200)...
echo.
echo Abre dos terminales (PowerShell o CMD) y ejecuta:
echo.
echo TERMINAL 1 (Backend):
echo   cd inmuebleManagerBack
echo   mvn spring-boot:run
echo.
echo TERMINAL 2 (Frontend):
echo   cd inmuebleManagerFront
echo   ng serve --host 0.0.0.0
echo.
echo Luego accede a: http://localhost:4200
echo.
pause
