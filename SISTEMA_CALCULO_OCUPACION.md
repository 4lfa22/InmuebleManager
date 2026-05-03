# 📊 Sistema de Cálculo de Ocupación - Documentación Técnica

## Problema Identificado y Resuelto

### ❌ ANTES
- Ocupación era **aleatoria** (0-100% random)
- Cambiaba con cada refresco
- No reflejaba datos reales
- Imposible de testear

### ✅ AHORA
- Ocupación calculada en **base a datos de BD**
- Datos consistentes y reales
- Se actualiza automáticamente al agregar/modificar alquileres
- 100% determinístico

---

## 🧮 Algoritmo de Cálculo

### Paso 1: Obtener Alquileres de la Propiedad
```typescript
// Dashboard carga alquileres para cada propiedad
this.alquilerService.obtenerPorPropiedad(propiedadId).subscribe(...)
```

### Paso 2: Calcular Ocupación Real
```typescript
private calcularOcupacionReal(alquileres: Alquiler[]): number {
  // 1. Obtener mes actual
  const ahora = new Date();
  const mesActual = ahora.getMonth();
  const anioActual = ahora.getFullYear();
  
  // 2. Calcular primer y último día del mes
  const primerDia = new Date(anioActual, mesActual, 1);
  const ultimoDia = new Date(anioActual, mesActual + 1, 0);
  const diasDelMes = ultimoDia.getDate();
  
  // 3. Por cada alquiler, contar días de solapamiento con el mes
  let diasAlquilados = 0;
  alquileres.forEach(alquiler => {
    if (alquiler.fechaFin >= primerDia && alquiler.fechaInicio <= ultimoDia) {
      // Calcular intersección de fechas
      const inicio = alquiler.fechaInicio > primerDia ? alquiler.fechaInicio : primerDia;
      const fin = alquiler.fechaFin < ultimoDia ? alquiler.fechaFin : ultimoDia;
      
      const diasSolapados = (fin - inicio) / (1000 * 60 * 60 * 24) + 1;
      diasAlquilados += Math.max(0, diasSolapados);
    }
  });
  
  // 4. Retornar porcentaje
  return (diasAlquilados / diasDelMes) * 100;
}
```

---

## 📅 Ejemplos Prácticos

### Ejemplo 1: Enero con un alquiler de 30 días

```
Mes: Enero 2026
Días del mes: 31

Alquiler:
  Inicio: 01/01/2026
  Fin:    30/01/2026
  
Días alquilados: 30 (del 1 al 30)
Ocupación: (30 / 31) * 100 = 96.77% 🟢 (Alquilada)
```

### Ejemplo 2: Enero con 2 alquileres

```
Mes: Enero 2026
Días del mes: 31

Alquiler 1:
  Inicio: 01/01/2026
  Fin:    15/01/2026
  Días: 15
  
Alquiler 2:
  Inicio: 16/01/2026
  Fin:    31/01/2026
  Días: 16
  
Total días alquilados: 15 + 16 = 31
Ocupación: (31 / 31) * 100 = 100% 🟢 (Alquilada)
```

### Ejemplo 3: Enero parcialmente alquilado

```
Mes: Enero 2026
Días del mes: 31

Alquiler:
  Inicio: 01/01/2026
  Fin:    15/01/2026
  
Días alquilados: 15
Ocupación: (15 / 31) * 100 = 48.39% 🔴 (Libre)
```

### Ejemplo 4: Alquiler que atraviesa meses

```
Diciembre 2025 + Enero 2026

Alquiler:
  Inicio: 20/12/2025
  Fin:    10/01/2026
  
Enero 2026:
  - Primer día de enero: 01/01
  - Último día de enero: 31/01
  - El alquiler entra el 01/01 (porque fechaInicio 20/12 < ultimoDia)
  - El alquiler sale el 10/01 (porque fechaFin 10/01 < ultimoDia)
  - Días de solapamiento: del 01/01 al 10/01 = 10 días
  
Ocupación en Enero: (10 / 31) * 100 = 32.25% 🔴 (Libre)
```

---

## 🎯 Estados Visuales

Basado en ocupación calculada:

| Ocupación | Estado | Color | Emoji |
|-----------|--------|-------|-------|
| ≥ 90% | Alquilada | Verde | 🟢 |
| 50-89% | Parcial | Amarillo | 🟡 |
| < 50% | Libre | Rojo | 🔴 |

---

## 💰 Beneficio Mensual

```
Beneficio = Ingresos Totales - Gastos Totales
```

El backend calcula esto en `ResumenFinancieroService` basándose en:
- Suma de importes de alquileres del mes
- Suma de gastos registrados del mes

---

## 🔄 Flujo de Datos

### 1. Cargar Dashboard
```
DashboardComponent.ngOnInit()
  ↓
cargarPropiedades()
  ├─ PropiedadService.listarPorUsuario(userId)
  ├─ cargarResumenesPropiedades()
  │   ├─ ResumenFinancieroService.obtenerPorPropiedad()
  │   └─ recalcularKPIs()
  └─ cargarAlquileresPropiedades()
      ├─ AlquilerService.obtenerPorPropiedad()
      └─ recalcularKPIs()
```

### 2. Mostrar en Tarjeta
```
obtenerOcupacionPropiedad(propiedadId)
  ├─ this.alquileresPorPropiedad.get(propiedadId)
  └─ calcularOcupacionReal(alquileres)

obtenerBeneficioMes(propiedadId)
  └─ this.resumenes.get(propiedadId).beneficioNeto
```

### 3. Actualizar en Tiempo Real
```
Cuando usuario agrega/modifica alquiler o gasto:
  ├─ Propiedad-Detalle recarga datos
  └─ Dashboard se actualiza automáticamente (en siguiente carga)
```

---

## 🔢 Precisión

### Precisión Decimal
- Ocupación: `number:'1.0-0'` → 85% (sin decimales)
- Beneficio: `currency` → €1.234,56 (2 decimales)
- Rentabilidad: `number:'1.0-1'` → 88.5% (1 decimal)

### Manejo de Fechas
```typescript
// Las fechas se comparan correctamente:
if (fechaFin >= primerDia && fechaInicio <= ultimoDia)

// Los días se cuentan incluyendo inicio y fin:
const diferenciaDias = (fin - inicio) / milisegundosPorDia + 1;
```

---

## 🚨 Casos Especiales

### Alquiler sin días de solapamiento
```
Alquiler: 15/02 - 28/02
Mes analizado: Enero
Resultado: 0% (sin solapamiento)
```

### Alquiler exacto del mes
```
Alquiler: 01/01 - 31/01
Mes: Enero (31 días)
Resultado: (31/31) * 100 = 100%
```

### Sin alquileres
```
Alquileres: []
Resultado: 0% 🔴 (Libre)
```

---

## 📝 Notas Técnicas

### 1. Cálculo en Frontend vs Backend
- **Frontend**: Calcula ocupación (requiere fechas)
- **Backend**: Calcula resumen financiero (suma de montos)

### 2. Performance
- Cálculo es O(n) donde n = número de alquileres
- Se hace con lazy loading (cuando se muestra dashboard)

### 3. Zona Horaria
- Usa `new Date()` que es local del navegador
- Para aplicaciones internacionales, convertir a UTC

### 4. Actualización
- Datos se cargan al inicializar componente
- Para refrescar: Recargar página o agregar button "Actualizar"

---

## ✅ Beneficios

| Aspecto | Beneficio |
|---------|-----------|
| **Precisión** | 100% basado en datos reales |
| **Consistencia** | Mismo resultado siempre |
| **Dinámico** | Cambia cuando se agregan datos |
| **Testeable** | Fácil de verificar |
| **Mantenible** | Código claro y documentado |

---

## 🔮 Futuras Mejoras (Opcionales)

1. **Endpoint Backend** para ocupación (menos cálculo frontend)
2. **Caché** de cálculos (para mejor performance)
3. **Histórico** de ocupación (gráfico por mes)
4. **Proyecciones** (ocupación estimada próximos meses)
5. **Alertas** (ocupación baja, alquileres próximos a vencer)

---

## 📞 Resumen

La ocupación ahora es:
- ✅ Real (basada en alquileres)
- ✅ Consistente (no cambia al refrescar)
- ✅ Actualizable (se actualiza con nuevos datos)
- ✅ Visible (en dashboard y detalles de propiedad)
- ✅ Profesional (refleja realidad del negocio)
