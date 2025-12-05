# 🌐 Backend Pseudo-API - EcoTrip Calculator

## 📋 Descripción General

Se ha implementado un sistema de pseudo-API basado en archivos JSON para proporcionar:

1. **Base de datos de ciudades** de Uruguay, Brasil y Argentina
2. **Cálculo automático de distancias** entre ciudades
3. **Autocompletado inteligente** con soporte para alias y búsqueda insensible a acentos
4. **Información detallada de rutas** (duración, tipo de camino, países)

## 🗂️ Estructura de Archivos

### Archivos de Datos

```
data/
├── cities.json      # Base de datos de 45 ciudades (15 por país)
└── routes.json      # Base de datos de 60 rutas con distancias
```

### Archivos de Código

```
js/
├── distance-api.js   # Servicio principal de API (DistanceAPIService)
├── routes-data.js    # Gestión de rutas (actualizado para usar API)
├── ui.js            # UI Manager (actualizado con autocompletado)
└── app.js           # Inicialización de la app (actualizado)

css/components/
└── autocomplete.css  # Estilos para autocompletado
```

## 📊 Estructura de Datos

### cities.json

```json
{
  "metadata": {
    "version": "1.0",
    "totalCities": 45,
    "countries": ["Argentina", "Brasil", "Uruguay"]
  },
  "countries": {
    "argentina": {
      "code": "AR",
      "name": "Argentina",
      "cities": [
        {
          "id": "ar_bsas",
          "name": "Buenos Aires",
          "state": "Buenos Aires",
          "latitude": -34.6037,
          "longitude": -58.3816,
          "population": 3075000,
          "aliases": ["CABA", "Capital Federal", "BA"]
        }
        // ... más ciudades
      ]
    }
    // ... más países
  }
}
```

### routes.json

```json
{
  "metadata": {
    "version": "1.0",
    "totalRoutes": 60
  },
  "routes": [
    {
      "id": "route_001",
      "origin": "ar_bsas",
      "destination": "ar_cordoba",
      "distance": 710,
      "durationHours": 9.5,
      "type": "highway",
      "countries": ["AR"]
    }
    // ... más rutas
  ]
}
```

## 🔧 API Service - DistanceAPIService

### Inicialización

```javascript
const apiService = new DistanceAPIService();
await apiService.initialize();
```

### Métodos Principales

#### `initialize()`

Carga los archivos JSON y construye índices para búsqueda rápida.

```javascript
await apiService.initialize();
console.log(`Cargadas ${apiService.getCityCount()} ciudades`);
```

#### `findCity(query)`

Busca una ciudad por nombre o alias (insensible a acentos).

```javascript
const city = apiService.findCity("Buenos Aires");
// Retorna: { id, name, state, latitude, longitude, population, aliases }
```

#### `getDistance(origin, destination)`

Obtiene la distancia entre dos ciudades (bidireccional).

```javascript
const distance = apiService.getDistance("Buenos Aires", "Montevideo");
// Retorna: 201 (km) o null si no existe la ruta
```

#### `getSuggestions(query, limit)`

Obtiene sugerencias para autocompletado ordenadas por relevancia.

```javascript
const suggestions = apiService.getSuggestions("monte", 5);
// Retorna: Array de ciudades ordenadas por prioridad
// Priority 1: Nombre empieza con "monte"
// Priority 2: Nombre contiene "monte"
// Priority 3: Alias coincide
```

#### `getRouteInfo(origin, destination)`

Obtiene información completa de una ruta.

```javascript
const info = apiService.getRouteInfo("Buenos Aires", "Montevideo");
// Retorna: {
//   distance: 201,
//   durationHours: 3,
//   type: 'international',
//   countries: ['AR', 'UY'],
//   originCity: {...},
//   destinationCity: {...}
// }
```

## 🎨 Sistema de Autocompletado

### Características

- ✅ **Búsqueda en tiempo real** mientras el usuario escribe
- ✅ **Insensible a acentos** (Córdoba = Cordoba)
- ✅ **Soporte para alias** (CABA → Buenos Aires)
- ✅ **Navegación con teclado** (↑↓ Enter Escape)
- ✅ **Badges de país** con colores distintivos
- ✅ **Información contextual** (estado/provincia)

### Badges de País

```css
🇦🇷 Argentina  - Azul    (#74b9ff)
🇧🇷 Brasil     - Verde   (#55efc4)
🇺🇾 Uruguay    - Naranja (#fdcb6e)
```

### Navegación por Teclado

| Tecla    | Acción                        |
| -------- | ----------------------------- |
| `↓`      | Siguiente sugerencia          |
| `↑`      | Sugerencia anterior           |
| `Enter`  | Seleccionar sugerencia actual |
| `Escape` | Cerrar sugerencias            |

## 🔄 Flujo de Integración

### 1. Inicialización en app.js

```javascript
class EcoTripApp {
  async init() {
    // 1. Inicializar API Service
    await this.initializeAPIService();

    // 2. Crear instancias de módulos
    this.ui = new UIManager();
    this.routesData = new RoutesData(this.apiService);

    // 3. Conectar API Service con UI
    this.ui.setAPIService(this.apiService);
  }
}
```

### 2. Cálculo Automático de Distancias

```javascript
// En routes-data.js
calculateDistance(origin, destination) {
  // 1. Intentar con API Service (prioridad)
  if (this.apiService) {
    const routeInfo = this.apiService.getRouteInfo(origin, destination);
    if (routeInfo) {
      return {
        distance: routeInfo.distance,
        method: 'api_route',
        routeInfo: routeInfo  // Info adicional
      };
    }
  }

  // 2. Fallback a rutas conocidas (legacy)
  // 3. Fallback a estimación
  // 4. Retornar null (entrada manual)
}
```

### 3. Autocompletado en ui.js

```javascript
// Configurar autocompletado
setupAutocomplete() {
  this.setupAutocompleteInput(
    this.originInput,
    originSuggestions,
    (cityData) => {
      this.selectedOriginCity = cityData;
      this.tryAutoCalculateDistance();
    }
  );
}

// Mostrar sugerencias
input.addEventListener('input', (e) => {
  const suggestions = this.apiService.getSuggestions(query, 8);
  this.showSuggestions(container, suggestions, onSelect);
});
```

## 📈 Datos Incluidos

### Ciudades por País

- **Argentina (15 ciudades)**: Buenos Aires, Córdoba, Rosario, Mendoza, La Plata, Tucumán, Mar del Plata, Salta, Santa Fe, San Juan, Resistencia, Neuquén, Posadas, Bariloche, Ushuaia

- **Brasil (15 ciudades)**: São Paulo, Río de Janeiro, Brasilia, Salvador, Fortaleza, Belo Horizonte, Manaos, Curitiba, Recife, Porto Alegre, Belém, Goiânia, Guarulhos, Campinas, Florianópolis

- **Uruguay (15 ciudades)**: Montevideo, Salto, Paysandú, Maldonado, Rivera, Tacuarembó, Melo, Mercedes, Artigas, Minas, San José, Durazno, Florida, Treinta y Tres, Rocha

### Rutas Incluidas

- **60 rutas bidireccionales** con distancias reales
- Tipos de ruta: `highway`, `international`, `coastal`, `ferry`, `bridge`
- Información de duración estimada
- Rutas dentro de países e internacionales

## 🚀 Modo de Funcionamiento

### Modo Automático (con API)

1. Usuario escribe en origen → aparecen sugerencias
2. Usuario selecciona ciudad → se guarda `selectedOriginCity`
3. Usuario escribe en destino → aparecen sugerencias
4. Usuario selecciona ciudad → se guarda `selectedDestinationCity`
5. **Automáticamente** se consulta distancia en API
6. Si existe ruta → muestra distancia + info (duración, tipo)
7. Si NO existe ruta → mensaje "Ingresa la distancia manualmente"

### Modo Manual (legacy/fallback)

1. Usuario escribe origen y destino libremente
2. Puede ingresar la distancia manualmente
3. Funciona con KNOWN_ROUTES antiguas si están definidas

## 🎯 Ventajas del Sistema

✅ **Sin dependencias externas** - No requiere Google Maps API ni internet
✅ **Rendimiento O(1)** - Búsquedas instantáneas con índices Map
✅ **Flexible y extensible** - Fácil agregar más ciudades/rutas editando JSON
✅ **Backward compatible** - Funciona con datos legacy si API no está disponible
✅ **UX mejorada** - Autocompletado inteligente con navegación por teclado
✅ **Datos verificables** - Distancias y coordenadas reales de fuentes oficiales

## 🔧 Mantenimiento

### Agregar Nueva Ciudad

Editar `data/cities.json`:

```json
{
  "id": "ar_nueva",
  "name": "Nueva Ciudad",
  "state": "Provincia",
  "latitude": -34.0,
  "longitude": -58.0,
  "population": 100000,
  "aliases": ["Alias1", "Alias2"]
}
```

### Agregar Nueva Ruta

Editar `data/routes.json`:

```json
{
  "id": "route_new",
  "origin": "ar_bsas",
  "destination": "ar_nueva",
  "distance": 500,
  "durationHours": 6.5,
  "type": "highway",
  "countries": ["AR"]
}
```

**Nota**: Las rutas son bidireccionales automáticamente.

## 🐛 Debugging

```javascript
// En consola del navegador
console.log(ecoTripApp.apiService.getCityCount()); // Número de ciudades
console.log(ecoTripApp.apiService.getRouteCount()); // Número de rutas
console.log(ecoTripApp.apiService.findCity("Buenos")); // Buscar ciudad
console.log(ecoTripApp.apiService.getSuggestions("mon", 5)); // Sugerencias
```

## 📝 Notas Técnicas

- Los IDs de ciudades siguen el formato: `{país}_{abreviatura}` (ej: `ar_bsas`)
- Los IDs de rutas siguen el formato: `route_{número}` (ej: `route_001`)
- Las distancias están en kilómetros
- Las duraciones están en horas decimales (9.5h = 9h 30min)
- Las coordenadas usan el sistema WGS84 (latitud, longitud)
- La búsqueda normaliza texto: elimina acentos y convierte a mayúsculas

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Autor**: EcoTrip Calculator Team
