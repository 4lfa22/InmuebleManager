# 🏠 Guía de Uso - Detalles de Propiedad

## Estructura Visual del Componente

```
┌─────────────────────────────────────────────────────────────┐
│                    DETALLES DE PROPIEDAD                    │
├─────────────────────────────────────────────────────────────┤
│
│  [← Volver al Dashboard]
│
│  ┌──────────────────────────────────┐
│  │ Nombre de Propiedad              │
│  │ Dirección, Ciudad                │
│  │ [Badge: Tipo]                    │
│  │                                  │
│  │ Dirección: ...                   │
│  │ Tipo: ...                        │
│  └──────────────────────────────────┘
│
│  ┌──────────────────────────────────┐
│  │ OPCIONES DE GESTIÓN              │
│  │ [🖼️  Gestionar Imágenes]         │
│  │ [👥 Gestionar Inquilinos]        │
│  │ [📄 Historial Alquileres]        │
│  │ [💰 Resumen Financiero]          │
│  │ [💳 Gestionar Gastos]            │
│  │ [🗑️  Eliminar Propiedad]         │
│  └──────────────────────────────────┘
│
├─────────────────────────────────────────────────────────────┤
│                    SECCIONES DINÁMICAS                      │
├─────────────────────────────────────────────────────────────┤
│
│  ▼ GESTIONAR IMÁGENES (cuando se activa)
│  ┌────────────────────────────────┐
│  │ Subir imagen:  [Choose File]   │
│  │                [Subir Imagen]  │
│  │ ─────────────────────────────  │
│  │                                │
│  │ [IMG] [IMG] [IMG]             │
│  │ [...] [...] [...]             │
│  └────────────────────────────────┘
│
│  ▼ GESTIONAR INQUILINOS (cuando se activa)
│  ┌────────────────────────────────────────────┐
│  │ [+ Agregar Inquilino]                      │
│  │ ──────────────────────────────────────────│
│  │ │ Nombre   │ Email  │ Tel  │ Doc │ Acción│
│  │ ├──────────┼────────┼──────┼─────┼──────│
│  │ │ Juan P.  │ j@m.es │ 123  │ DNI │  🗑️  │
│  │ │ Ana G.   │ a@m.es │ 456  │ DNI │  🗑️  │
│  │ └────────────────────────────────────────────┘
│
│  ▼ HISTORIAL DE ALQUILERES (cuando se activa)
│  ┌────────────────────────────────────────────┐
│  │ [+ Nuevo Alquiler]                         │
│  │ ──────────────────────────────────────────│
│  │ │ Inquilino │ Inicio │ Fin  │ $ │ Acción│
│  │ ├───────────┼────────┼──────┼──┼──────│
│  │ │ Juan P.   │ 01/01  │ 31/12│500│  🗑️  │
│  │ │ Ana G.    │ 15/02  │ 14/05│450│  🗑️  │
│  │ └────────────────────────────────────────────┘
│
│  ▼ GESTIONAR GASTOS (cuando se activa)
│  ┌────────────────────────────────────────────┐
│  │ [+ Agregar Gasto]                          │
│  │ ──────────────────────────────────────────│
│  │ │ Descripción │ Cat.     │ Monto │ Fecha  │
│  │ ├─────────────┼──────────┼───────┼────────│
│  │ │ Reparación  │ Mantenim │ 150   │ 01/01  │
│  │ │ Limpieza    │ Mantenim │ 50    │ 05/01  │
│  │ └────────────────────────────────────────────┘
│
│  ▼ RESUMEN FINANCIERO (cuando se activa)
│  ┌────────────────────────────────────────────┐
│  │ ┌──────────────┐  ┌──────────────┐        │
│  │ │ INGRESOS     │  │ GASTOS       │        │
│  │ │ €xxxxxxx.xx  │  │ €xxxxx.xx    │        │
│  │ └──────────────┘  └──────────────┘        │
│  │ ┌──────────────┐  ┌──────────────┐        │
│  │ │ GANANCIA     │  │ RENTABILIDAD │        │
│  │ │ €xxxxxx.xx   │  │ xx.xx%       │        │
│  │ └──────────────┘  └──────────────┘        │
│  └────────────────────────────────────────────┘
│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flujo de Interacción

### 1. Cargar Detalles de Propiedad
```
Usuario navega a /propiedad/{id}
    ↓
ActivatedRoute obtiene ID
    ↓
cargarPropiedad()
    ↓
PropiedadService.obtenerPorId(id)
    ↓
Muestra datos básicos en tarjeta
```

### 2. Ver Inquilinos
```
Usuario clica [👥 Gestionar Inquilinos]
    ↓
mostrarSeccion('inquilinos')
    ↓
cargarInquilinos()
    ↓
InquilinoService.obtenerPorPropiedad(propiedadId)
    ↓
Renderiza tabla con datos
```

### 3. Eliminar Inquilino
```
Usuario clica [🗑️] en fila
    ↓
confirm('¿Está seguro?')
    ↓
InquilinoService.eliminar(id)
    ↓
cargarInquilinos() [recarga tabla]
```

### 4. Subir Imagen
```
Usuario selecciona archivo
    ↓
seleccionarArchivo(event)
    ↓
Guarda en archivoSeleccionado
    ↓
Usuario clica [Subir Imagen]
    ↓
subirImagen()
    ↓
ImagenService.subirArchivo(propiedadId, archivo)
    ↓
cargarImagenes() [recarga galería]
```

### 5. Ver Resumen Financiero
```
Usuario clica [💰 Resumen Financiero]
    ↓
mostrarSeccion('financiero')
    ↓
cargarResumenFinanciero()
    ↓
ResumenFinancieroService.obtenerPorPropiedad(id)
    ↓
Mapea datos del backend
    ↓
Muestra tarjetas con datos
```

### 6. Eliminar Propiedad
```
Usuario clica [🗑️ Eliminar Propiedad]
    ↓
confirm('¿Seguro eliminar?')
    ↓
PropiedadService.eliminar(propiedadId)
    ↓
router.navigate(['/dashboard'])
```

---

## 📊 Estados del Componente

### seccionActiva
```typescript
''            // Nada seleccionado
'imagenes'    // Muestra sección de imágenes
'inquilinos'  // Muestra sección de inquilinos
'alquileres'  // Muestra sección de alquileres
'gastos'      // Muestra sección de gastos
'financiero'  // Muestra sección de financiero
```

### Ciclo de Vida
```
ngOnInit()
    ↓
this.route.params.subscribe()
    ↓
this.cargarPropiedad() [carga datos básicos]
    ↓
Usuario interactúa
    ↓
mostrarSeccion() [carga datos específicos]
```

---

## 🎯 Datos por Sección

### Inquilinos
```typescript
{
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  documentoIdentidad: string;
  propiedadId: number;
}
```

### Alquileres
```typescript
{
  id: number;
  propiedadId: number;
  inquilinoId: number;
  fechaInicio: Date;
  fechaFin: Date;
  importeTotal: number;
  metodoPago: string;
}
```

### Gastos
```typescript
{
  id: number;
  descripcion: string;
  monto: number;
  fecha: Date;
  categoria: string;
  propiedadId: number;
}
```

### Imágenes
```typescript
{
  id: number;
  imagenData: string;      // Base64
  orden: number;
  propiedadId: number;
  url: string;             // Convertida a dataURI
  descripcion: string;     // Generada automáticamente
}
```

### Resumen Financiero
```typescript
{
  propiedadId: number;
  nombrePropiedad: string;
  ingresosTotales: number;
  gastosTotales: number;
  beneficioNeto: number;
  gastosPorTipo: Map<string, number>;
  numeroAlquileres: number;
  numeroGastos: number;
  
  // Mapeado para mostrar:
  ingresos: number;
  gastos: number;
  ganancia: number;
  rentabilidad: number;  // %
}
```

---

## ⚡ Operaciones Principales

### Carga de Datos
- ✅ `cargarPropiedad()` - Datos básicos (al iniciar)
- ✅ `cargarInquilinos()` - Lista de inquilinos
- ✅ `cargarAlquileres()` - Historial de alquileres
- ✅ `cargarGastos()` - Gastos registrados
- ✅ `cargarImagenes()` - Imágenes subidas
- ✅ `cargarResumenFinanciero()` - Datos financieros

### Creación
- ⏳ `abrirFormularioInquilino()` - Placeholder
- ⏳ `abrirFormularioAlquiler()` - Placeholder
- ⏳ `abrirFormularioGasto()` - Placeholder
- ✅ `subirImagen()` - Subida directa de imágenes

### Eliminación
- ✅ `eliminarInquilino(id)` - Con confirmación
- ✅ `eliminarAlquiler(id)` - Con confirmación
- ✅ `eliminarGasto(id)` - Con confirmación
- ✅ `eliminarImagen(id)` - Con confirmación
- ✅ `eliminarPropiedad()` - Con confirmación + redirección

### Utilidades
- ✅ `obtenerNombreInquilino(id)` - Helper para mostrar nombres
- ✅ `seleccionarArchivo(event)` - Manejo de file input
- ✅ `mostrarSeccion(seccion)` - Activar sección y cargar datos

---

## 🔐 Validaciones

1. **Eliminación**: Siempre requiere confirmación `confirm()`
2. **Propiedad**: Se valida existencia antes de eliminar
3. **Archivo**: Se valida antes de subir (type="file")
4. **Datos**: Se mapean correctamente del backend

---

## 🎨 Estilos CSS

- Cards con `shadow-sm` para profundidad
- Badges para tipos
- Colores dinámicos para ganancias (rojo/verde)
- Tablas responsivas con Bootstrap
- Galería de imágenes en grid

---

## 📞 Ejemplo de Uso Real

### Usuario quiere ver gastos de una propiedad

```
1. Navega a /propiedad/5
   → ngOnInit() → cargarPropiedad()
   → Muestra "Casa Playa" con detalles

2. Clica botón "💳 Gestionar Gastos"
   → mostrarSeccion('gastos')
   → cargarGastos()
   → GET /api/gastos/propiedad/5
   → Tabla muestra:
     • Reparación del tejado - Mantenim - €450 - 01/01
     • Pintura exterior - Mantenim - €300 - 15/01

3. Clica eliminar en primera fila
   → confirm('¿Seguro?')
   → DELETE /api/gastos/1
   → cargarGastos() [recarga]
   → Ahora solo muestra la segunda

4. Ver resumen clicando "💰 Resumen Financiero"
   → cargarResumenFinanciero()
   → GET /api/resumen-financiero/propiedad/5
   → Muestra:
     • Ingresos: €2500
     • Gastos: €300
     • Ganancia: €2200
     • Rentabilidad: 88%
```

---

## ✨ Mejoras Futuras

1. **Modales para formularios** (en lugar de placeholders)
2. **Paginación** en tablas grandes
3. **Filtros** por fecha o categoría
4. **Edición** de registros existentes
5. **Exportación** a PDF
6. **Gráficos** de gastos vs ingresos
