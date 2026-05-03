# 🆘 GUÍA DE TROUBLESHOOTING - INMUEBLE MANAGER

## 🚫 Errores Comunes y Soluciones

---

## 1. Backend - Errores de Conexión a BD

### Error: "Connection refused" o "could not translate hostname"

```
Connection refused to host: localhost:5432
```

**Soluciones:**

a) Verificar que PostgreSQL está ejecutándose:
```bash
# Windows
tasklist | findstr postgres

# Linux/Mac
ps aux | grep postgres
```

b) Usar Docker para iniciar PostgreSQL:
```bash
docker-compose up -d
```

c) Verificar credenciales en `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

---

### Error: "FATAL: database does not exist"

```
FATAL: database "gestion_inmuebles" does not exist
```

**Soluciones:**

```bash
# Conectar a PostgreSQL y crear BD
psql -U postgres -c "CREATE DATABASE gestion_inmuebles;"

# O usar Docker
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE gestion_inmuebles;"
```

---

## 2. Backend - Errores de JWT

### Error: "JWT token is malformed"

```
JWT token is malformed
```

**Causas:**
- Token no comienza con "Bearer "
- Token corrupto
- Token expirado

**Soluciones:**
```javascript
// En el cliente, asegurarse de agregar "Bearer " antes del token
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

### Error: "Failed to sign key"

```
Failed to sign key with id
```

**Causa:** JWT_SECRET muy corto o no configurado

**Solución:**
```properties
# En .env - DEBE tener al menos 32 caracteres
JWT_SECRET=thisismysecrethashkey32charactersminimumrequired
```

---

### Error: "Token signature does not match"

```
Token signature does not match
```

**Causa:** JWT_SECRET diferente entre generación y validación

**Solución:**
```bash
# Asegurarse que JWT_SECRET es igual en:
# - Generación del token (AuthService)
# - Validación del token (JwtTokenProvider)
```

---

## 3. Frontend - Errores de Compilación

### Error: "Cannot find module"

```
Module not found: Error: Can't resolve '@angular/common'
```

**Solución:**
```bash
cd inmuebleManagerFront
npm install
npm start
```

---

### Error: "ng: command not found"

```
ng: command not found
```

**Solución:**
```bash
# Instalar globalmente (no recomendado)
npm install -g @angular/cli@19

# O usar npx
npx ng serve
```

---

## 4. Frontend - Errores de Autenticación

### Error: "401 Unauthorized" en requests

```
HTTP Error 401 (Unauthorized)
```

**Causas:**
- Token expirado
- Token no se envía correctamente
- Usuario no autenticado

**Soluciones:**

a) Verificar que el token se guarda:
```typescript
// En auth.service.ts
console.log(this.getToken()); // Debe retornar el token
```

b) Verificar que el interceptor agrega el header:
```typescript
// En auth.interceptor.ts
console.log('Token agregado:', token);
```

c) Verificar que las cookies/localStorage están habilitadas

---

### Error: "CORS error"

```
Access to XMLHttpRequest blocked by CORS policy
```

**Causa:** Frontend y backend en orígenes diferentes sin configuración CORS

**Soluciones:**

a) Verificar que frontend está en `localhost:4200`:
```bash
cd inmuebleManagerFront && npm start
```

b) Verificar que backend tiene CORS configurado:
```java
// SecurityConfig.java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200"));
```

c) Reiniciar ambos servidores

---

## 5. Base de Datos - Errores de Migración

### Error: "No schema has been set"

```
No schema has been set in connection
```

**Causa:** Hibernate intenta crear tablas pero falta configuración

**Solución:**
```properties
# Asegurar que DDL auto está configurado correctamente
spring.jpa.hibernate.ddl-auto=update  # Desarrollo
spring.jpa.hibernate.ddl-auto=validate # Producción
```

---

### Error: "Column does not exist"

```
ERROR: column "created_at" does not exist
```

**Causa:** Después de agregar BaseEntity, la BD no tiene las nuevas columnas

**Soluciones:**

a) Eliminar la BD y dejar que Hibernate la recree:
```bash
# PostgreSQL
dropdb gestion_inmuebles
createdb gestion_inmuebles
```

b) O ejecutar SQL manual:
```sql
ALTER TABLE usuarios ADD COLUMN created_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN updated_at TIMESTAMP;
ALTER TABLE usuarios ADD COLUMN deleted_at BOOLEAN DEFAULT FALSE;

-- Repetir para: propiedades, alquileres, gastos, inquilinos
```

---

## 6. Docker - Errores

### Error: "Cannot connect to Docker daemon"

```
error during connect: cannot connect to Docker daemon
```

**Solución:**
```bash
# Windows (Docker Desktop)
# Abrir Docker Desktop

# Linux
sudo systemctl start docker

# Mac
open /Applications/Docker.app
```

---

### Error: "Port already in use"

```
Error response from daemon: Ports are not available
```

**Causa:** Puerto 5432 ya en uso

**Soluciones:**

a) Cambiar puerto en docker-compose.yml:
```yaml
ports:
  - "5433:5432"  # Usar 5433 en lugar de 5432
```

b) O matar el proceso:
```bash
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5432
kill -9 <PID>
```

---

## 7. Maven - Errores de Build

### Error: "Maven not found"

```
mvn: command not found
```

**Soluciones:**

a) Instalar Maven desde https://maven.apache.org

b) O usar Maven wrapper (incluido en algunos proyectos):
```bash
./mvnw clean install  # Linux/Mac
mvnw.cmd clean install  # Windows
```

---

### Error: "Dependency not found"

```
[ERROR] Failed to execute goal on project inmuebleManagerBack
[ERROR] Cannot find parent: com.inmueblemanager:parent
```

**Solución:**
```bash
# Limpiar caché de Maven
rm -rf ~/.m2/repository
mvn clean install
```

---

## 8. Validaciones - Errores 400

### Error: "Email already registered"

```json
{
  "status": 400,
  "message": "El email ya está registrado"
}
```

**Solución:**
```
Usar un email diferente o eliminar el usuario existente
```

---

### Error: "Validation failed"

```json
{
  "status": 400,
  "message": "Validación fallida: email: El email debe ser válido, password: La contraseña debe tener al menos 6 caracteres"
}
```

**Solución:**
```
Revisar los requisitos:
- Email: debe ser un email válido (ej: user@example.com)
- Password: mínimo 6 caracteres
- Nombre: entre 2 y 100 caracteres
```

---

## 🔍 Debugging Tips

### 1. Habilitar logs detallados

```properties
# application.properties
logging.level.com.inmueblemanager=DEBUG
logging.level.org.springframework.security=DEBUG
logging.level.org.hibernate.SQL=DEBUG
```

### 2. Ver SQL queries

```properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 3. Usar Swagger para probar endpoints

```
http://localhost:8080/swagger-ui.html
```

### 4. Ver requests en el navegador

```
F12 → Network tab → Ver requests/responses
```

### 5. Logs de Spring Security

```
Buscar "Getting security context from HttpSession" en los logs
```

---

## 📞 ¿Aún tiene problemas?

1. Revisar los logs:
   - Backend: Console de IntelliJ o terminal
   - Frontend: Console del navegador (F12)

2. Buscar el error en Google o Stack Overflow

3. Revisar la documentación oficial:
   - Spring Boot: https://spring.io/projects/spring-boot
   - Angular: https://angular.io/docs
   - PostgreSQL: https://www.postgresql.org/docs/

4. Contactar al equipo de desarrollo

---

**Última actualización: Diciembre 2025**
