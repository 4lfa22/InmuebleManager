@echo off
echo ============================================
echo  Iniciando Backend - InmuebleManager
echo ============================================
echo.

cd inmuebleManagerBack

REM Intentar ejecutar el JAR si existe
if exist "target\*.jar" (
    echo [*] Ejecutando JAR compilado...
    java -jar target\*.jar
) else (
    echo [!] JAR no encontrado. Compilando proyecto...
    echo.
    
    REM Intentar con Maven
    where mvn >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [*] Usando Maven para compilar y ejecutar...
        call mvn clean package -DskipTests
        if %ERRORLEVEL% EQU 0 (
            java -jar target\*.jar
        ) else (
            echo [ERROR] Fallo la compilacion
            pause
        )
    ) else (
        echo [!] Maven no encontrado en PATH
        echo.
        echo Por favor, ejecuta el backend desde tu IDE:
        echo 1. Abre IntelliJ IDEA o Eclipse
        echo 2. Abre el proyecto inmuebleManagerBack
        echo 3. Ejecuta InmuebleManagerBackApplication.java
        echo.
        echo O instala Maven y agregalo al PATH del sistema
        echo.
        pause
    )
)
