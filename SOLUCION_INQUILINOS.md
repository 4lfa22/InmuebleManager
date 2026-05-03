# Solución - Error 400 al Crear Inquilinos

## Problema
El servidor respondía con status 400 al intentar crear inquilinos. Esto se debía a:

1. **Mismatch de campos**: El frontend enviaba `nombre` y `apellidos` separados, pero el backend tenía `nombreCompleto`
2. **Relación incompleta**: Faltaba la relación ManyToOne con Propiedad
3. **Emails duplicados**: La BD podría tener emails duplicados violando la restricción UNIQUE

## Cambios Realizados

### Backend

#### 1. **Modelo Inquilino** (`Inquilino.java`)
- ❌ Eliminado: `nombreCompleto`
- ✅ Agregado: `nombre` (String, NOT NULL)
- ✅ Agregado: `apellidos` (String, NOT NULL)
- ✅ Agregado: Relación `@ManyToOne` con `Propiedad`

```java
@Column(nullable = false)
private String nombre;

@Column(nullable = false)
private String apellidos;

@ManyToOne
@JoinColumn(name = "propiedad_id")
private Propiedad propiedad;
```

#### 2. **Servicio InquilinoService** (`InquilinoService.java`)
- Actualizado método `buscarPorNombre()`: ahora busca en `nombre` en lugar de `nombreCompleto`
- Actualizado método `actualizar()`: ahora actualiza `nombre` y `apellidos` separados

#### 3. **Repositorio InquilinoRepository** (`InquilinoRepository.java`)
- Actualizado método de búsqueda: `findByNombreContainingIgnoreCase()` en lugar de `findByNombreCompletoContainingIgnoreCase()`

### Frontend

#### PropiedadDetalleComponent (`propiedad-detalle.component.ts`)
- Separado lógica de **crear** vs **actualizar**
- Al **crear**: No se envía ID (solo se envían los campos necesarios)
- Al **actualizar**: Se envían todos los campos incluyendo ID
- Mejorados mensajes de error para mostrar detalles del servidor

## Procedimiento de Migración

### Opción 1: Dejar que Hibernate lo maneje (Recomendado)
1. Ejecutar la aplicación con `spring.jpa.hibernate.ddl-auto=update`
2. Hibernate creará las nuevas columnas automáticamente
3. Los datos antiguos se preservarán

### Opción 2: Script SQL Manual
Si los cambios automáticos fallan:

1. Ejecutar el script `MIGRATION_INQUILINOS.sql` en PostgreSQL
2. Este script:
   - Agrega las nuevas columnas
   - Elimina duplicados de email
   - Establece restricciones correctas
   - Crea la relación con Propiedad

```sql
-- Ejecutar en pgAdmin o línea de comandos
psql -U postgres -d gestion_inmuebles -f MIGRATION_INQUILINOS.sql
```

## Pruebas

Después de aplicar los cambios:

1. **Limpiar base de datos (opcional)**:
   ```sql
   DELETE FROM inquilinos;
   ```

2. **Reiniciar aplicación backend**

3. **En el frontend**:
   - Ir a una propiedad
   - Clic en tab "Inquilinos"
   - Clic en "Agregar"
   - Completar formulario con datos nuevos y únicos
   - Guardar

4. **Verificar**:
   - Debe aparecer en la tabla
   - Se puede editar: clic en lápiz
   - Se puede eliminar: clic en papelera

## Campos del Formulario

- **Nombre** (requerido): Primera parte del nombre
- **Apellidos** (requerido): Apellido(s)
- **Email** (requerido, único): Email del inquilino
- **Teléfono** (requerido): Número de contacto
- **Documento de Identidad** (requerido): DNI/Pasaporte

## Si Sigue Habiendo Errores 400

Causas posibles:

1. **Email duplicado**: Usar un email nuevo que no exista en la BD
2. **Datos incompletos**: Asegurar que todos los campos están completos
3. **Caracteres especiales**: Evitar caracteres especiales en nombre/apellidos
4. **Propiedad inexistente**: Verificar que la propiedad existe en la BD

Para debug:
- Revisar logs del backend: `spring.jpa.show-sql=true` mostrará las queries
- Ver error específico en consola del navegador (pestaña Network)

## Estado Final

✅ Inquilinos ahora tienen nombre y apellidos separados
✅ Relación correcta con Propiedad
✅ CRUD funcional (Create, Read, Update, Delete)
✅ Validación de campos en frontend y backend
✅ Mensajes de error detallados
