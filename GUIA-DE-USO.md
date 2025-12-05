# 🚀 Guía de Uso Rápido - EcoTrip Calculator

## 📖 Cómo Usar la Aplicación

### 1️⃣ Abrir la Aplicación

Simplemente abre el archivo `index.html` en tu navegador web favorito:

- **Chrome**, **Firefox**, **Edge** o **Safari**
- No requiere servidor web (funciona con protocolo `file://`)
- Requiere JavaScript habilitado

### 2️⃣ Ingresar Datos del Viaje

#### Paso 1: Seleccionar Origen

1. **Click en el campo "Ciudad de Origen"**
2. **Escribe** el nombre de la ciudad (mínimo 2 caracteres)
3. **Aparecerán sugerencias** con badges de país:
   - 🇦🇷 Argentina (azul)
   - 🇧🇷 Brasil (verde)
   - 🇺🇾 Uruguay (naranja)
4. **Navega** con las flechas ↑↓ o usa el mouse
5. **Selecciona** presionando Enter o haciendo click

**Ejemplos:**

- Escribe "bue" → Buenos Aires
- Escribe "monte" → Montevideo
- Escribe "sao" → São Paulo

#### Paso 2: Seleccionar Destino

1. **Click en el campo "Ciudad de Destino"**
2. **Repite el proceso** del paso anterior
3. Al seleccionar destino, **la distancia se calculará automáticamente** si existe ruta

**Ejemplo de Cálculo Automático:**

```
Origen: Buenos Aires 🇦🇷
Destino: Montevideo 🇺🇾
✅ Distancia calculada automáticamente: 201 km
💡 Info adicional: 3 horas, ruta internacional
```

#### Paso 3: Verificar o Ingresar Distancia

**Caso A - Ruta Encontrada:**

- ✅ Campo de distancia se llena automáticamente
- ✅ Aparece notificación verde con información de la ruta
- Puedes modificar la distancia si lo deseas

**Caso B - Ruta No Encontrada:**

- ⚠️ Aparece mensaje "Ingresar manualmente"
- Ingresa la distancia en kilómetros
- La app funciona normalmente

#### Paso 4: Seleccionar Transporte

**Click en el tipo de transporte** que usarás:

| Transporte | Icono | Emisiones    |
| ---------- | ----- | ------------ |
| Auto       | 🚗    | 120 g CO₂/km |
| Bus        | 🚌    | 80 g CO₂/km  |
| Tren       | 🚆    | 41 g CO₂/km  |
| Avión      | ✈️    | 255 g CO₂/km |

La tarjeta seleccionada se marcará con borde verde.

#### Paso 5: Calcular

**Click en el botón "Calcular Impacto Ambiental"**

- Se mostrará un modal con los resultados
- Verás emisiones de CO₂, créditos de carbono, y árboles equivalentes

### 3️⃣ Ver Resultados

El modal mostrará:

#### 📊 Información del Viaje

- Origen → Destino
- Distancia total
- Tipo de transporte

#### 💨 Emisiones de CO₂

- Cantidad en kilogramos
- Comparación visual

#### 🌿 Créditos de Carbono

- Créditos necesarios para compensar
- Equivalente en dinero

#### 🌳 Árboles Equivalentes

- Número de árboles necesarios
- Para absorber las emisiones en un año

#### 📈 Impacto Ambiental

- Clasificación del impacto
- Mensaje personalizado
- Icono y color según nivel

### 4️⃣ Compartir Resultados

**Click en el botón "Compartir Resultados"**

**En Mobile/Tablet:**

- Se abre el menú nativo de compartir
- Comparte vía WhatsApp, Email, etc.

**En Desktop:**

- Se copian los resultados al portapapeles
- Aparece notificación de confirmación
- Pega con Ctrl+V donde quieras

## 🎯 Consejos de Uso

### Autocompletado Inteligente

✅ **Funciona con alias:**

- "CABA" → Buenos Aires
- "Sampa" → São Paulo
- "MVD" → Montevideo

✅ **Insensible a acentos:**

- "Cordoba" = "Córdoba"
- "Sao Paulo" = "São Paulo"

✅ **Búsqueda parcial:**

- "mont" encuentra "Montevideo"
- "rio" encuentra "Río de Janeiro"

### Navegación por Teclado

| Tecla    | Acción                 |
| -------- | ---------------------- |
| `Tab`    | Siguiente campo        |
| `↓`      | Siguiente sugerencia   |
| `↑`      | Sugerencia anterior    |
| `Enter`  | Seleccionar sugerencia |
| `Escape` | Cerrar sugerencias     |

### Rutas Disponibles

**45 ciudades** incluidas:

- 15 de Argentina
- 15 de Brasil
- 15 de Uruguay

**60 rutas** con distancias reales:

- Rutas nacionales dentro de cada país
- Rutas internacionales entre países
- Distancias verificadas y duración estimada

### Ejemplos de Rutas

#### Rutas Argentinas 🇦🇷

- Buenos Aires → Córdoba: 710 km
- Buenos Aires → Rosario: 300 km
- Córdoba → Mendoza: 650 km

#### Rutas Brasileñas 🇧🇷

- São Paulo → Río de Janeiro: 430 km
- São Paulo → Brasilia: 1015 km
- Río → Salvador: 1650 km

#### Rutas Uruguayas 🇺🇾

- Montevideo → Punta del Este: 130 km
- Montevideo → Salto: 498 km
- Montevideo → Colonia: 177 km

#### Rutas Internacionales 🌎

- Buenos Aires → Montevideo: 201 km
- Buenos Aires → Porto Alegre: 1125 km
- Montevideo → Porto Alegre: 985 km

## ❓ Preguntas Frecuentes

### ¿Qué pasa si mi ciudad no aparece?

Si tu ciudad no está en la base de datos:

1. Escribe el nombre de todas formas
2. Ingresa la distancia **manualmente**
3. La calculadora funcionará normalmente

### ¿Cómo se calculan las emisiones?

Usamos factores de emisión estándar por tipo de transporte:

- **Auto**: 120 g CO₂/km (promedio sedán gasolina)
- **Bus**: 80 g CO₂/km (por pasajero)
- **Tren**: 41 g CO₂/km (por pasajero)
- **Avión**: 255 g CO₂/km (vuelo corto/medio)

### ¿Puedo agregar más ciudades?

Sí, editando el archivo `data/cities.json`:

1. Abre el archivo en un editor de texto
2. Agrega tu ciudad con el formato correcto
3. Guarda y recarga la página

### ¿Las distancias son precisas?

Sí, las 60 rutas incluidas tienen:

- ✅ Distancias reales verificadas
- ✅ Duración estimada de viaje
- ✅ Tipo de ruta (carretera, internacional, etc.)

### ¿Funciona sin internet?

**Sí, completamente**:

- ✅ No requiere conexión a internet
- ✅ Todos los datos están en archivos JSON locales
- ✅ No hay dependencias externas

### ¿Es compatible con móviles?

**Sí, totalmente responsive**:

- ✅ Adaptado a smartphones
- ✅ Adaptado a tablets
- ✅ Touch-friendly
- ✅ Menú de compartir nativo en móvil

## 🔍 Debugging

Si algo no funciona, abre la consola del navegador (F12):

### Verificar Inicialización

Deberías ver:

```
🌍 Iniciando EcoTrip Calculator...
📡 Inicializando servicio de API...
✅ API Service inicializado: 45 ciudades, 60 rutas
✅ Autocompletado configurado
✅ EcoTrip Calculator inicializado correctamente
```

### Comandos Útiles

En la consola del navegador:

```javascript
// Ver número de ciudades
ecoTripApp.apiService.getCityCount();

// Ver número de rutas
ecoTripApp.apiService.getRouteCount();

// Buscar una ciudad
ecoTripApp.apiService.findCity("Buenos Aires");

// Ver distancia entre ciudades
ecoTripApp.apiService.getDistance("Buenos Aires", "Montevideo");

// Ver sugerencias
ecoTripApp.apiService.getSuggestions("bue", 5);
```

### Errores Comunes

**"API Service no disponible"**

- Verifica que `data/cities.json` y `data/routes.json` existan
- Verifica permisos de lectura de archivos
- Verifica que no haya errores en archivos JSON

**"Autocompletado no funciona"**

- Verifica que JavaScript esté habilitado
- Verifica consola por errores
- Recarga la página (Ctrl+F5)

**"Distancia no se calcula automáticamente"**

- La ruta puede no existir en la base de datos
- Ingresa la distancia manualmente
- Verifica los nombres de las ciudades

## 📱 Capturas de Ejemplo

### 1. Selección de Origen

```
┌─────────────────────────────┐
│ Ciudad de Origen            │
│ Buen▊                       │
├─────────────────────────────┤
│ Buenos Aires      🇦🇷       │
│ Buenos Aires, Argentina     │
└─────────────────────────────┘
```

### 2. Cálculo Automático

```
┌─────────────────────────────┐
│ ✅ Distancia encontrada     │
│ 201 km (3h, internacional)  │
└─────────────────────────────┘
```

### 3. Resultados

```
╔═════════════════════════════╗
║   Resultados del Cálculo    ║
╠═════════════════════════════╣
║ 📍 Buenos Aires → Montevideo║
║ 🚗 Auto                     ║
║ 📏 201 km                   ║
║                             ║
║ 💨 24.12 kg CO₂             ║
║ 🌿 0.24 créditos carbono    ║
║ 🌳 2.2 árboles              ║
╚═════════════════════════════╝
```

## ✨ Características Especiales

### 🎨 Temas Visuales

- Gradientes modernos
- Animaciones suaves
- Glassmorphism en tarjetas
- Modo oscuro/claro automático

### ♿ Accesibilidad

- Navegación completa por teclado
- Labels descriptivos
- ARIA attributes
- Alto contraste

### 🚀 Performance

- Búsqueda O(1) con índices
- Sin llamadas a red
- Carga instantánea
- Sin dependencias pesadas

---

## 🎉 ¡Disfruta Calculando tu Impacto Ambiental!

**EcoTrip Calculator** te ayuda a tomar decisiones conscientes sobre tus viajes y su impacto en el planeta.

💚 **Cada kilómetro cuenta**  
🌍 **Viaja responsablemente**  
🌱 **Compensa tu huella de carbono**

---

**¿Necesitas ayuda?**  
Consulta la documentación completa en:

- `README.md` - Información general
- `BACKEND-API.md` - Documentación técnica de API
- `IMPLEMENTACION-COMPLETADA.md` - Detalles de implementación
