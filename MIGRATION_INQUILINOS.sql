-- Script para migrar la estructura de la tabla inquilinos
-- Este script debe ejecutarse ANTES de reiniciar la aplicación

-- 1. Eliminar restricción unique si existe
ALTER TABLE inquilinos DROP CONSTRAINT IF EXISTS inquilinos_email_key;

-- 2. Agregar nuevas columnas si no existen
ALTER TABLE inquilinos 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(255),
ADD COLUMN IF NOT EXISTS apellidos VARCHAR(255),
ADD COLUMN IF NOT EXISTS propiedad_id BIGINT;

-- 3. Si existe la columna nombre_completo, migrar los datos
-- (comentar esto si ya se ejecutó)
-- UPDATE inquilinos SET nombre = SPLIT_PART(nombre_completo, ' ', 1), apellidos = SPLIT_PART(nombre_completo, ' ', 2);

-- 4. Eliminar duplicados de email (mantener el más antiguo)
DELETE FROM inquilinos t1
WHERE EXISTS (
    SELECT 1 FROM inquilinos t2
    WHERE t1.email = t2.email
    AND t1.id > t2.id
    AND t1.email IS NOT NULL
);

-- 5. Establecer NOT NULL en las nuevas columnas
ALTER TABLE inquilinos 
ALTER COLUMN nombre SET NOT NULL,
ALTER COLUMN apellidos SET NOT NULL;

-- 6. Agregar nueva restricción unique
ALTER TABLE inquilinos 
ADD CONSTRAINT inquilinos_email_key UNIQUE(email);

-- 7. Agregar restricción de clave foránea si la tabla propiedad existe
ALTER TABLE inquilinos
ADD CONSTRAINT fk_inquilinos_propiedad
FOREIGN KEY (propiedad_id) REFERENCES propiedades(id);

COMMIT;
