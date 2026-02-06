#!/bin/bash

# ================================================================
# Script de inicialización de InmuebleManager
# ================================================================

echo ""
echo "=========================================="
echo "  INMUEBLE MANAGER - Setup Inicial"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar Node.js
echo -e "[*] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js no encontrado. Descargar desde https://nodejs.org${NC}"
    exit 1
fi
echo -e "${GREEN}[OK] Node.js instalado${NC}"
node --version

# Verificar Maven
echo -e "[*] Verificando Maven..."
if ! command -v mvn &> /dev/null; then
    echo -e "${YELLOW}[WARNING] Maven no encontrado. Descargar desde https://maven.apache.org${NC}"
else
    echo -e "${GREEN}[OK] Maven instalado${NC}"
    mvn --version | head -1
fi

# Crear .env si no existe
echo -e "[*] Verificando archivo .env..."
if [ ! -f "inmuebleManagerBack/.env" ]; then
    echo -e "[*] Creando .env desde .env.example..."
    cp "inmuebleManagerBack/.env.example" "inmuebleManagerBack/.env"
    echo -e "${GREEN}[OK] .env creado. Editar con las credenciales reales si es necesario${NC}"
else
    echo -e "${GREEN}[OK] .env ya existe${NC}"
fi

# Instalar dependencias Frontend
echo ""
echo -e "[*] Instalando dependencias del Frontend..."
cd inmuebleManagerFront
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}[ERROR] Fallo al instalar dependencias del Frontend${NC}"
    cd ..
    exit 1
fi
cd ..
echo -e "${GREEN}[OK] Dependencias del Frontend instaladas${NC}"

# Compilar Backend
echo ""
echo -e "[*] Compilando Backend..."
if command -v mvn &> /dev/null; then
    mvn clean compile -f inmuebleManagerBack/pom.xml
    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}[WARNING] Compilación del backend falló${NC}"
    else
        echo -e "${GREEN}[OK] Backend compilado${NC}"
    fi
else
    echo -e "${YELLOW}[WARNING] Maven no disponible. Saltando compilación del backend${NC}"
fi

echo ""
echo "=========================================="
echo "  Setup completado exitosamente!"
echo "=========================================="
echo ""
echo "Para iniciar el proyecto:"
echo "1. Backend:  cd inmuebleManagerBack && mvn spring-boot:run"
echo "2. Frontend: cd inmuebleManagerFront && npm start"
echo ""
echo "Base de datos: Si deseas usar Docker, ejecuta: docker-compose up -d"
echo ""
