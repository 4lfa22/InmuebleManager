# 🚀 Setup Dual ngrok para InmuebleManager

## Requisitos
- Dos cuentas gratuitas en [ngrok.com](https://ngrok.com)
- Backend ejecutándose en puerto `8080`
- Frontend ejecutándose en puerto `4200`

## Paso 1: Crear dos cuentas de ngrok

1. Ve a https://ngrok.com/signup
2. Crea **Cuenta 1** (Frontend)
   - Email: `tu-email-1@gmail.com`
   - Guarda el auth token
3. Crea **Cuenta 2** (Backend)
   - Email: `tu-email-2@gmail.com`
   - Guarda el auth token

## Paso 2: Instalar ngrok

```bash
# Windows
choco install ngrok
# o descargar desde https://ngrok.com/download

# macOS
brew install ngrok

# Linux
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok
```

## Paso 3: Configurar tokens de autenticación

### Terminal 1 - ngrok para Frontend (Cuenta 1)
```bash
ngrok config add-authtoken TOKEN_CUENTA_1
ngrok http 4200
```

Copia la URL generada: `https://xxxxx-frontend.ngrok-free.app`

### Terminal 2 - ngrok para Backend (Cuenta 2)
En una **segunda terminal**, configura el segundo token:
```bash
# Para Windows (en una terminal diferente, puede usar otro nombre de sesión)
ngrok config add-authtoken TOKEN_CUENTA_2

# O especificar directamente
ngrok http 8080 --authtoken TOKEN_CUENTA_2
```

Copia la URL generada: `https://xxxxx-backend.ngrok-free.app`

**⚠️ IMPORTANTE:** Cada ngrok necesita su propia sesión/terminal. No puedes usar ambas en la misma línea de comandos.

## Paso 4: Configurar environment.ts

En `inmuebleManagerFront/src/app/environment.ts`, reemplaza:

```typescript
const backendUrl = 'https://BACKEND_NGROK_URL.ngrok-free.app';
```

Con tu URL real del backend generada en el Paso 3:

```typescript
const backendUrl = 'https://abc123def456-backend.ngrok-free.app';
```

## Paso 5: Iniciar la aplicación

### Terminal 1 - Backend
```bash
cd inmuebleManagerBack
mvn spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd inmuebleManagerFront
ng serve --host 0.0.0.0
```

### Terminal 3 - ngrok Frontend (Cuenta 1)
```bash
ngrok config add-authtoken TOKEN_CUENTA_1
ngrok http 4200
# Verás: https://xxxxx-frontend.ngrok-free.app
```

### Terminal 4 - ngrok Backend (Cuenta 2)
```bash
ngrok config add-authtoken TOKEN_CUENTA_2
ngrok http 8080
# Verás: https://xxxxx-backend.ngrok-free.app
```

## Paso 6: Acceder a la aplicación

Abre en tu navegador:
```
https://xxxxx-frontend.ngrok-free.app
```

El frontend accederá al backend a través de:
```
https://xxxxx-backend.ngrok-free.app
```

## Verificación

✅ Backend debe estar levantado en `http://localhost:8080`
✅ Frontend debe estar levantado en `http://localhost:4200`
✅ ngrok frontend debe estar activo exponiendo puerto 4200
✅ ngrok backend debe estar activo exponiendo puerto 8080
✅ `environment.ts` debe tener la URL correcta del backend

## Solución de Problemas

### Error: "Too many connections"
- Significa que hay múltiples instancias de ngrok del mismo token
- Solución: Cierra otras ventanas/terminales con ngrok

### Error: CORS
- Verifica que `CorsConfig.java` tiene `allowedOriginPatterns`
- Backend debe ser accesible desde el frontend

### Error: Conexión rechazada
- Asegúrate de que el backend está corriendo en `http://localhost:8080`
- Asegúrate de que el frontend está corriendo en `http://localhost:4200`

## Automación (Opcional)

Para automatizar los comandos, puedes crear un script que inicie todo:

### Windows (PowerShell)
```powershell
# start-ngrok-dual.ps1
Start-Process "ngrok" -ArgumentList "config add-authtoken TOKEN_CUENTA_1; ngrok http 4200"
Start-Process "ngrok" -ArgumentList "config add-authtoken TOKEN_CUENTA_2; ngrok http 8080"
Start-Process "powershell" -ArgumentList "cd inmuebleManagerBack; mvn spring-boot:run"
Start-Process "powershell" -ArgumentList "cd inmuebleManagerFront; ng serve --host 0.0.0.0"
```

### Linux/macOS (Bash)
```bash
#!/bin/bash
# start-ngrok-dual.sh

# Terminal 1: ngrok Frontend
gnome-terminal -- bash -c "ngrok config add-authtoken TOKEN_CUENTA_1; ngrok http 4200; exec bash"

# Terminal 2: ngrok Backend
gnome-terminal -- bash -c "ngrok config add-authtoken TOKEN_CUENTA_2; ngrok http 8080; exec bash"

# Terminal 3: Backend
gnome-terminal -- bash -c "cd inmuebleManagerBack; mvn spring-boot:run; exec bash"

# Terminal 4: Frontend
gnome-terminal -- bash -c "cd inmuebleManagerFront; ng serve --host 0.0.0.0; exec bash"
```

## Resumen

| Componente | Puerto Local | URL ngrok | Cuenta |
|-----------|--------------|-----------|--------|
| Frontend  | 4200         | https://xxxxx-frontend.ngrok-free.app | Cuenta 1 |
| Backend   | 8080         | https://xxxxx-backend.ngrok-free.app | Cuenta 2 |

Una vez que tengas ambas URLs de ngrok activas, accede a la aplicación a través de la URL del frontend ngrok.
