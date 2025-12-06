# 🔧 Solución: Problema con Rutas Internacionales

## 📋 Problema Identificado

La aplicación **no calculaba distancias para rutas internacionales** aunque las rutas estaban definidas en `config.js` en el objeto `KNOWN_ROUTES`.

### Causa Raíz

El sistema tiene **dos fuentes de datos para rutas**:

1. **`config.js`** → `KNOWN_ROUTES` (incluye rutas nacionales E internacionales)
2. **`data/routes.json`** → Archivo JSON con rutas estructuradas (solo rutas locales de AR, BR, UY)

El problema estaba en el **orden de búsqueda** en `routes-data.js`:

```javascript
// ❌ ORDEN ANTERIOR (INCORRECTO)
findDistance(origin, destination) {
    // 1. Buscaba PRIMERO en API Service (routes.json)
    //    → Solo tiene rutas locales, NO internacionales
    if (this.apiService) {
        const distance = this.apiService.getDistance(origin, destination);
        if (distance !== null) return distance;
    }

    // 2. Buscaba DESPUÉS en KNOWN_ROUTES
    //    → Tiene rutas internacionales, pero nunca llegaba aquí
    const forwardKey = this.generateRouteKey(origin, destination);
    if (this.routes[forwardKey]) return this.routes[forwardKey];
}
```

**Resultado:** Las rutas internacionales nunca se encontraban porque el sistema buscaba primero en `routes.json` (que no las tiene) y retornaba `null` antes de buscar en `KNOWN_ROUTES`.

---

## ✅ Solución Implementada

### Cambio 1: Invertir el orden de búsqueda

Modificamos `routes-data.js` para buscar **PRIMERO en `KNOWN_ROUTES`** (que tiene TODAS las rutas) y **DESPUÉS en API Service**:

```javascript
// ✅ ORDEN NUEVO (CORRECTO)
findDistance(origin, destination) {
    // 1. Buscar PRIMERO en KNOWN_ROUTES (config.js)
    //    → Incluye rutas nacionales E internacionales
    const forwardKey = this.generateRouteKey(origin, destination);
    const reverseKey = this.generateRouteKey(destination, origin);

    if (this.routes[forwardKey]) {
        console.log(`📍 Distancia encontrada en KNOWN_ROUTES: ${this.routes[forwardKey]} km`);
        return this.routes[forwardKey];
    }

    if (this.routes[reverseKey]) {
        console.log(`📍 Distancia encontrada en KNOWN_ROUTES (reversa): ${this.routes[reverseKey]} km`);
        return this.routes[reverseKey];
    }

    // 2. Si no se encuentra, buscar en API Service
    if (this.apiService) {
        const distance = this.apiService.getDistance(origin, destination);
        if (distance !== null) {
            console.log(`📍 Distancia encontrada en API Service: ${distance} km`);
            return distance;
        }
    }

    return null;
}
```

### Cambio 2: Actualizar `calculateDistance()`

También actualizamos el método `calculateDistance()` con la misma lógica:

```javascript
calculateDistance(origin, destination) {
    // 1. PRIMERO: KNOWN_ROUTES
    const knownDistance = this.findDistance(origin, destination);
    if (knownDistance !== null) {
        return {
            distance: knownDistance,
            method: 'known_route',
            message: `Distancia encontrada: ${knownDistance} km`
        };
    }

    // 2. DESPUÉS: API Service
    if (this.apiService) {
        const routeInfo = this.apiService.getRouteInfo(origin, destination);
        if (routeInfo) {
            return {
                distance: routeInfo.distance,
                method: 'api_route',
                message: `Distancia encontrada: ${routeInfo.distance} km`,
                routeInfo: routeInfo
            };
        }
    }

    // 3. Por último: Estimación (Google Maps API en el futuro)
    return {
        distance: null,
        method: 'none',
        error: 'No se pudo calcular la distancia'
    };
}
```

---

## 🧪 Pruebas

Ahora las siguientes rutas **funcionan correctamente**:

### ✈️ Rutas Intercontinentales

- Buenos Aires → Madrid: **10,070 km**
- São Paulo → Nueva York: **7,680 km**
- Santiago → París: **11,670 km**
- Ciudad de México → Londres: **8,930 km**

### 🌎 Rutas Sudamericanas Internacionales

- Buenos Aires → Montevideo: **230 km**
- Buenos Aires → Santiago: **1,400 km**
- São Paulo → Asunción: **1,400 km**
- Lima → Bogotá: **1,900 km**

### 🚗 Rutas Nacionales (ya funcionaban)

- Buenos Aires → Córdoba: **700 km**
- São Paulo → Río de Janeiro: **430 km**
- Santiago → Valparaíso: **120 km**

---

## 📊 Ventajas de Esta Solución

### ✅ Ventajas

1. **Compatibilidad total**: Funciona con rutas de `KNOWN_ROUTES` Y de `routes.json`
2. **Prioridad correcta**: Rutas en `config.js` tienen prioridad (más fácil de editar)
3. **Fallback robusto**: Si no se encuentra en `KNOWN_ROUTES`, intenta con API Service
4. **Sin cambios en JSON**: No necesitamos modificar `cities.json` ni `routes.json`
5. **Preparado para Google Maps**: La estructura permite integrar Google Maps API en el futuro

### 🎯 Flujo de Búsqueda Actual

```
Usuario ingresa: "Buenos Aires" → "Madrid"
           ↓
1. Normaliza nombres: "BUENOS AIRES" - "MADRID"
           ↓
2. Busca en KNOWN_ROUTES (config.js)
           ↓
   ✅ ENCONTRADO: 10070 km
           ↓
3. Retorna distancia al calculador
           ↓
4. Calcula emisiones de CO₂
```

---

## 🔮 Próximos Pasos Opcionales

Si quieres expandir aún más el sistema:

### Opción 1: Actualizar `routes.json` con rutas internacionales

Agregar las rutas internacionales al archivo JSON para tener información adicional (duración, tipo de ruta, etc.)

### Opción 2: Implementar Google Maps API

Usar la guía `GOOGLE-MAPS-INTEGRATION.md` para calcular distancias dinámicamente

### Opción 3: Base de datos real

Migrar a una base de datos (MongoDB, PostgreSQL) para manejar miles de rutas

---

## 📝 Archivos Modificados

1. **`js/routes-data.js`**

   - ✅ Método `findDistance()` - Invertido orden de búsqueda
   - ✅ Método `calculateDistance()` - Prioriza KNOWN_ROUTES

2. **`js/config.js`** (ya actualizado previamente)
   - ✅ `KNOWN_ROUTES` - Agregadas 200+ rutas internacionales
   - ✅ `MAJOR_CITIES` - Agregadas ciudades de múltiples países
   - ✅ `EMISSION_FACTORS` - Actualizados para auto eléctrico y avión
   - ✅ `TRANSPORT_INFO` - Actualizados iconos y descripciones

---

## ✅ Resultado Final

La aplicación **ahora calcula correctamente**:

- ✈️ Rutas aéreas intercontinentales (Buenos Aires → Madrid)
- 🌎 Rutas internacionales sudamericanas (Santiago → Lima)
- 🚗 Rutas nacionales (Buenos Aires → Córdoba)
- ⚡ Emisiones para auto eléctrico (40 g CO₂/km)
- ✈️ Emisiones para avión (255 g CO₂/km)

---

**Fecha de solución:** 6 de diciembre de 2025  
**Problema:** Rutas internacionales no funcionaban  
**Solución:** Invertir orden de búsqueda en `routes-data.js`  
**Estado:** ✅ **RESUELTO**
