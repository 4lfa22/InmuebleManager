# ⚡ Quick Start - InmuebleManager

## 🏃 Desarrollo Local (Recomendado para desarrollo)

### Requisitos
- Node.js 18+
- Java 17+
- Maven 3.8+
- PostgreSQL

### Inicio Rápido

**Terminal 1 - Backend:**
```bash
cd inmuebleManagerBack
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd inmuebleManagerFront
npm install
ng serve --host 0.0.0.0
```

Accede a: **http://localhost:4200**

---

## 🌐 Con ngrok (Para acceso remoto/demo)

### Paso 1: Instalar ngrok
- Descarga desde https://ngrok.com/download
- O: `brew install ngrok` (macOS) / `choco install ngrok` (Windows)

### Paso 2: Crear 2 cuentas en ngrok.com

- Cuenta 1: Para Frontend
- Cuenta 2: Para Backend

### Paso 3: Levantar Backend y Frontend (localmente)

**Terminal 1 - Backend:**
```bash
cd inmuebleManagerBack
mvn spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd inmuebleManagerFront
ng serve --host 0.0.0.0
```

### Paso 4: Exponer con ngrok

**Terminal 3 - ngrok Frontend (Cuenta 1):**
```bash
ngrok config add-authtoken TOKEN_CUENTA_1
ngrok http 4200
# AnotaURL: https://xxxxx-frontend.ngrok-free.app
```

**Terminal 4 - ngrok Backend (Cuenta 2):**
```bash
ngrok config add-authtoken TOKEN_CUENTA_2
ngrok http 8080
# AnotaURL: https://xxxxx-backend.ngrok-free.app
```

### Paso 5: Configurar URL del Backend

En `inmuebleManagerFront/src/app/environment.ts`:

```typescript
const backendUrl = 'https://xxxxx-backend.ngrok-free.app';
```

Reemplaza `xxxxx-backend` con tu URL real.

### Paso 6: Acceder

Abre: **https://xxxxx-frontend.ngrok-free.app**

---

## 📋 Con Docker

```bash
docker-compose up -d
```

Accede a: **http://localhost:4200**

---

## ✅ Checklist

- [ ] Backend corriendo en puerto 8080
- [ ] Frontend corriendo en puerto 4200
- [ ] ngrok Frontend activo (Cuenta 1)
- [ ] ngrok Backend activo (Cuenta 2)
- [ ] environment.ts con URL correcta del backend
- [ ] Acceso desde navegador funciona

---

## 📚 Documentación Completa

- [Setup Dual ngrok](SETUP_NGROK_DUAL.md) - Guía detallada
- [Troubleshooting](TROUBLESHOOTING.md) - Solucionar problemas
- [README](README.md) - Información general
