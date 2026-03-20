@echo off
echo ============================================
echo  Iniciando Entorno Completo - InmuebleManager
echo ============================================
echo.
echo [1/3] PostgreSQL: Asegurate de que este corriendo
echo [2/3] Backend: Iniciando en puerto 8080...
echo [3/3] ngrok: Exponiendo backend a internet...
echo.
pause

REM Iniciar Backend en una nueva ventana
start "Backend Spring Boot" cmd /k "cd /d %~dp0 & start-backend.bat"

REM Esperar 10 segundos para que el backend inicie
echo.
echo Esperando 10 segundos para que el backend inicie...
timeout /t 10 /nobreak

REM Iniciar ngrok en una nueva ventana
start "ngrok Backend" cmd /k "ngrok http 8080"

echo.
echo ============================================
echo  Entorno iniciado correctamente
echo ============================================
echo.
echo Backend: http://localhost:8080
echo ngrok: Revisa la terminal de ngrok para obtener la URL publica
echo.
echo IMPORTANTE: Copia la URL de ngrok y actualizala en:
echo   inmuebleManagerFront/src/app/environment.ts
echo.
pause
