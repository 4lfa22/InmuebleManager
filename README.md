# InmuebleManager - Sistema de Gestión de Inmuebles

Aplicación fullstack para la gestión de propiedades, alquileres, gastos e inquilinos.

## 🏗️ Arquitectura

- **Backend**: Spring Boot 3.3.4 + PostgreSQL
- **Frontend**: Angular 19.1.0 + Bootstrap 5
- **Autenticación**: JWT (JSON Web Tokens)
- **Base de datos**: PostgreSQL con Hibernating (JPA)

## 📋 Requisitos Previos

- Java 17 o superior
- Maven 3.8+
- Node.js 18+ y npm
- PostgreSQL 12+

## 🚀 Instalación y Ejecución

### 1. Configurar Base de Datos

```sql
CREATE DATABASE gestion_inmuebles;
```

### 2. Variables de Entorno (Backend)

Crear archivo `.env` en `inmuebleManagerBack/`:

```bash
JWT_SECRET=tu_clave_secreta_de_minimo_32_caracteres
JWT_EXPIRATION=3600000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=gestion_inmuebles
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

### 3. Ejecutar Backend

```bash
cd inmuebleManagerBack
mvn clean install
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

### 4. Ejecutar Frontend

```bash
cd inmuebleManagerFront
npm install
npm start
```

El frontend estará disponible en: `http://localhost:4200`

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de usuario
- `POST /api/auth/registro` - Registro de nuevo usuario

### Propiedades
- `GET /api/propiedades` - Listar todas las propiedades
- `GET /api/propiedades/{id}` - Obtener propiedad por ID
- `GET /api/propiedades/usuario/{usuarioId}` - Listar propiedades del usuario
- `POST /api/propiedades` - Crear nueva propiedad
- `PUT /api/propiedades/{id}` - Actualizar propiedad
- `DELETE /api/propiedades/{id}` - Eliminar propiedad

### Alquileres
- `GET /api/alquileres` - Listar todos los alquileres
- `GET /api/alquileres/{id}` - Obtener alquiler por ID
- `GET /api/alquileres/usuario/{usuarioId}` - Listar alquileres del usuario
- `POST /api/alquileres` - Crear nuevo alquiler
- `PUT /api/alquileres/{id}` - Actualizar alquiler
- `DELETE /api/alquileres/{id}` - Eliminar alquiler

### Gastos
- `GET /api/gastos` - Listar todos los gastos
- `GET /api/gastos/{id}` - Obtener gasto por ID
- `POST /api/gastos` - Crear nuevo gasto
- `PUT /api/gastos/{id}` - Actualizar gasto
- `DELETE /api/gastos/{id}` - Eliminar gasto

## 🔐 Seguridad

- Contraseñas hasheadas con BCrypt
- JWT para autenticación stateless
- CORS configurado para desarrollo local
- Validación de entrada en DTOs
- Manejo de excepciones global

## 📖 Documentación API

Una vez iniciado el backend, accede a Swagger UI:
`http://localhost:8080/swagger-ui.html`

## 🔧 Configuración por Entorno

### Desarrollo (por defecto)
- `src/main/resources/application.properties`

### Producción
- Modificar variables de entorno
- Cambiar `spring.jpa.hibernate.ddl-auto` a `validate`
- Usar conexión HTTPS

## 📝 Estructura de Carpetas

```
inmuebleManager/
├── inmuebleManagerBack/          # Backend Spring Boot
│   ├── src/main/java/com/inmueblemanager/
│   │   ├── config/              # Configuración (JWT, CORS, Security)
│   │   ├── controller/          # Controladores REST
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── exception/           # Manejo de excepciones
│   │   ├── model/               # Entidades JPA
│   │   ├── repository/          # Repositorios JPA
│   │   ├── security/            # Seguridad JWT
│   │   └── service/             # Lógica de negocio
│   ├── pom.xml                  # Dependencias Maven
│   └── .env.example             # Variables de entorno
│
├── inmuebleManagerFront/        # Frontend Angular
│   ├── src/app/
│   │   ├── components/          # Componentes
│   │   ├── guards/              # Auth Guard
│   │   ├── interceptors/        # HTTP Interceptors
│   │   ├── services/            # Servicios Angular
│   │   └── app.routes.ts        # Rutas
│   ├── package.json
│   └── angular.json
│
└── package.json                 # Scripts de desarrollo
```

## 🐛 Troubleshooting

### Error de conexión a BD
```
Verificar que PostgreSQL está ejecutándose
Comprobar credenciales en variables de entorno
```

### Error de token JWT
```
Asegurar que JWT_SECRET tiene al menos 32 caracteres
Verificar que el token no ha expirado
```

### CORS errors
```
Confirmar que el frontend está en http://localhost:4200
Verificar la configuración de CORS en SecurityConfig
```

## 📄 Licencia

Proyecto educativo - TFG 2025

## 👥 Autor

Proyecto desarrollado como Trabajo de Fin de Grado
