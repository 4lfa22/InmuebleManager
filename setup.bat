@echo off
REM ================================================================
REM Script de inicialización de InmuebleManager
REM ================================================================

echo.
echo ==========================================
echo   INMUEBLE MANAGER - Setup Inicial
echo ==========================================
echo.

REM Verificar Node.js
echo [*] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no encontrado. Descargar desde https://nodejs.org
    exit /b 1
)
echo [OK] Node.js instalado

REM Verificar Maven
echo [*] Verificando Maven...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Maven no encontrado. Descargar desde https://maven.apache.org
    echo Se puede usar "mvn wrapper" para usar Maven wrapper
)

REM Crear .env si no existe
echo [*] Verificando archivo .env...
if not exist "inmuebleManagerBack\.env" (
    echo [*] Creando .env desde .env.example...
    copy "inmuebleManagerBack\.env.example" "inmuebleManagerBack\.env" >nul
    echo [OK] .env creado. Editar con las credenciales reales si es necesario
) else (
    echo [OK] .env ya existe
)

REM Instalar dependencias Frontend
echo.
echo [*] Instalando dependencias del Frontend...
cd inmuebleManagerFront
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Fallo al instalar dependencias del Frontend
    cd ..
    exit /b 1
)
cd ..
echo [OK] Dependencias del Frontend instaladas

REM Compilar Backend
echo.
echo [*] Compilando Backend...
if exist "mvn.cmd" (
    call mvn clean compile -f inmuebleManagerBack\pom.xml
) else (
    echo [WARNING] Maven no disponible. Saltando compilación del backend
)

echo.
echo ==========================================
echo   Setup completado exitosamente!
echo ==========================================
echo.
echo Para iniciar el proyecto:
echo 1. Backend:  cd inmuebleManagerBack ^&^& mvn spring-boot:run
echo 2. Frontend: cd inmuebleManagerFront ^&^& npm start
echo.
echo Base de datos: Si deseas usar Docker, ejecuta: docker-compose up -d
echo.
pause
