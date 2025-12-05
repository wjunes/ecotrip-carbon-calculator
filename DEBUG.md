# 🐛 Guía de Debugging - Problema de Cálculo Automático

## ❗ Problema Reportado

La distancia no se está calculando automáticamente al seleccionar ciudades del autocompletado.

## 🔍 Pasos para Diagnosticar

### 1. Abrir la Consola del Navegador

1. Abre `index.html` en tu navegador
2. Presiona **F12** (o Ctrl+Shift+I en Chrome/Edge, Cmd+Option+I en Mac)
3. Ve a la pestaña **Console**

### 2. Verificar Inicialización

Al cargar la página, deberías ver:

```
🌍 Iniciando EcoTrip Calculator...
📡 Inicializando servicio de API...
✅ DistanceAPIService inicializado correctamente
📊 45 ciudades cargadas
🛣️  60 rutas disponibles
✅ API Service conectado a RoutesData
✅ API Service conectado a UIManager
✅ Autocompletado configurado
✅ EcoTrip Calculator inicializado correctamente
```

#### ⚠️ Si NO ves estos mensajes:

**Problema: Archivos JSON no se cargan (protocolo file://)**

**Solución 1 - Usar un servidor local:**

```powershell
# En PowerShell, desde la carpeta del proyecto:
cd e:\carbon-calculator
python -m http.server 8000
# O si tienes Node.js:
npx http-server -p 8000
```

Luego abre: `http://localhost:8000`

**Solución 2 - Permitir archivos locales en Chrome:**

1. Cierra Chrome completamente
2. Ejecuta Chrome con: `chrome.exe --allow-file-access-from-files`
3. Abre `index.html`

### 3. Probar Autocompletado

1. Click en campo "Origen"
2. Escribe "bue"
3. Deberías ver en consola:
   ```
   (Al escribir, se muestran sugerencias)
   ```
4. Click en "Buenos Aires"
5. Deberías ver:
   ```
   ✅ Ciudad origen seleccionada: {id: "ar_bsas", name: "Buenos Aires", ...}
   ⚠️ Origen o destino vacío, no se puede calcular
   ```

### 4. Seleccionar Destino

1. Click en campo "Destino"
2. Escribe "monte"
3. Click en "Montevideo"
4. Deberías ver:
   ```
   ✅ Ciudad destino seleccionada: {id: "uy_montevideo", name: "Montevideo", ...}
   🔍 Calculando distancia: Buenos Aires → Montevideo
   🔍 RoutesData.calculateDistance: Buenos Aires → Montevideo
   📡 API Service disponible: true
   🔎 Buscando en API Service...
   🔍 findRoute: Buscando ruta entre "Buenos Aires" y "Montevideo"
   📍 Ciudad origen encontrada: {id: "ar_bsas", name: "Buenos Aires", ...}
   📍 Ciudad destino encontrada: {id: "uy_montevideo", name: "Montevideo", ...}
   🔑 Clave de ruta: ar_bsas-uy_montevideo
   🛣️  Ruta encontrada: {id: "route_xxx", distance: 201, ...}
   📊 Resultado de API: {distance: 201, duration: 3, ...}
   ✅ Ruta encontrada en API: 201 km
   📊 Resultado del cálculo: {distance: 201, method: "api_route", ...}
   ```

### 5. Verificar Campo de Distancia

- El input de distancia debería llenarse con: **201**
- Debería aparecer una notificación verde: **"✅ Distancia encontrada: 201 km (3h, international)"**

## 🔧 Problemas Comunes y Soluciones

### Problema 1: "API Service no disponible"

**Causa:** Archivos JSON no se cargaron

**Verificar:**

```javascript
// En consola del navegador:
ecoTripApp.apiService;
// Debería retornar un objeto, no null
```

**Solución:**

- Usar servidor local (ver arriba)
- Verificar que existen `data/cities.json` y `data/routes.json`

### Problema 2: "Ciudad origen/destino no encontrada"

**Causa:** Problema con normalización de nombres

**Verificar:**

```javascript
// En consola:
ecoTripApp.apiService.findCity("Buenos Aires");
// Debería retornar objeto de ciudad
```

**Solución:**

- Seleccionar ciudad del autocompletado en lugar de escribir manualmente
- Verificar que el nombre coincide exactamente

### Problema 3: "Ruta no encontrada"

**Causa:** La ruta no existe en routes.json

**Verificar:**

```javascript
// En consola:
ecoTripApp.apiService.getRouteInfo("Buenos Aires", "Montevideo");
// Debería retornar objeto con distancia
```

**Rutas disponibles para probar:**

- Buenos Aires → Montevideo: 201 km
- Buenos Aires → Córdoba: 710 km
- São Paulo → Río de Janeiro: 430 km
- Montevideo → Punta del Este: 130 km

### Problema 4: "Modo manual activado"

**Causa:** El selector está en modo manual

**Verificar:**

- El selector "Modo de Distancia" debe estar en **"Calcular automáticamente"**

**Solución:**

- Cambiar el selector a modo automático
- Volver a seleccionar origen y destino

### Problema 5: "TypeError o ReferenceError"

**Causa:** Error en el código JavaScript

**Verificar consola:**

- Buscar mensajes de error en rojo
- Ver el stack trace

**Solución:**

- Reportar el error específico
- Verificar que todos los archivos JS se cargaron correctamente

## 🧪 Tests Manuales

### Test 1: Ruta Argentina

```
Origen: Buenos Aires
Destino: Córdoba
Esperado: 710 km
```

### Test 2: Ruta Uruguay

```
Origen: Montevideo
Destino: Punta del Este
Esperado: 130 km
```

### Test 3: Ruta Internacional

```
Origen: Buenos Aires
Destino: Montevideo
Esperado: 201 km
```

### Test 4: Ruta Brasil

```
Origen: São Paulo
Destino: Río de Janeiro
Esperado: 430 km
```

### Test 5: Ruta No Existente

```
Origen: Buenos Aires
Destino: Ushuaia
Esperado: ⚠️ Mensaje "No se pudo calcular la distancia. Por favor, ingrésala manualmente."
```

## 📊 Comandos de Debug en Consola

### Ver estado del API Service

```javascript
ecoTripApp.apiService.getCityCount(); // Debería retornar 45
ecoTripApp.apiService.getRouteCount(); // Debería retornar 60
```

### Buscar ciudad específica

```javascript
ecoTripApp.apiService.findCity("Buenos Aires");
ecoTripApp.apiService.findCity("Montevideo");
```

### Buscar ruta específica

```javascript
ecoTripApp.apiService.getRouteInfo("Buenos Aires", "Montevideo");
ecoTripApp.apiService.getDistance("Buenos Aires", "Montevideo");
```

### Ver sugerencias

```javascript
ecoTripApp.apiService.getSuggestions("bue", 5);
ecoTripApp.apiService.getSuggestions("mon", 5);
```

### Ver ciudades y rutas seleccionadas

```javascript
ecoTripApp.ui.selectedOriginCity;
ecoTripApp.ui.selectedDestinationCity;
```

### Ver índices cargados

```javascript
// Ver todas las ciudades cargadas
ecoTripApp.apiService.cityIndex;

// Ver todas las rutas cargadas
ecoTripApp.apiService.routeIndex;
```

## 📝 Reporte de Problemas

Si después de seguir estos pasos el problema persiste, reporta:

1. **Mensajes de consola** (copia todo lo que aparece)
2. **Errores** (mensajes en rojo)
3. **Navegador y versión** (Chrome 120, Firefox 121, etc.)
4. **Modo de apertura** (file:// o http://localhost)
5. **Pasos exactos** que seguiste
6. **Resultado esperado** vs **resultado obtenido**

---

## 🎯 Solución Rápida más Común

**El problema más común es el protocolo file://**

**Solución rápida:**

```powershell
cd e:\carbon-calculator
python -m http.server 8000
```

Luego abre: **http://localhost:8000**

Esto debería resolver el 90% de los casos.
