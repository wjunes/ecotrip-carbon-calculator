# 🌍 EcoTrip Calculator - Calculadora de Impacto Ambiental

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.ecma-international.org/ecma-262/)
[![HTML5](https://img.shields.io/badge/HTML-5-orange.svg)](https://www.w3.org/html/)
[![CSS3](https://img.shields.io/badge/CSS-3-blue.svg)](https://www.w3.org/Style/CSS/)

**EcoTrip Calculator** es una aplicación web interactiva que permite calcular el impacto ambiental de tus viajes, mostrando las emisiones de CO₂ y los créditos de carbono necesarios para compensarlas según el medio de transporte utilizado.

---

## ✨ Características

### 🚗 Cálculo de Emisiones

- **4 Medios de Transporte**: Bicicleta 🚴, Auto 🚗, Camión 🚚, Ómnibus 🚌
- **Factores de Emisión Realistas**: Basados en datos estándar de la industria
- **Cálculo Instantáneo**: Resultados en tiempo real

### 📊 Análisis Detallado

- **Emisiones de CO₂**: Calculadas en kg con conversión automática
- **Créditos de Carbono**: Cantidad necesaria para compensar el viaje
- **Equivalencia en Árboles**: Número de árboles necesarios para absorber las emisiones
- **Costo Estimado**: Precio aproximado de los créditos de carbono

### 🎨 Interfaz Moderna

- **Diseño Responsivo**: Funciona en móviles, tablets y escritorio
- **Animaciones Suaves**: Transiciones y efectos visuales atractivos
- **Modal de Resultados**: Presentación clara y profesional de datos
- **Notificaciones**: Feedback visual inmediato

### 🔧 Funcionalidades Adicionales

- **Modo Automático/Manual**: Calcula distancias o ingrésalas manualmente
- **Rutas Predefinidas**: Base de datos con distancias entre ciudades principales
- **Historial Local**: Guarda tus últimos 10 cálculos
- **Compartir Resultados**: Función para compartir en redes sociales
- **Validación Inteligente**: Verifica todos los datos antes de calcular

---

## 🚀 Instalación y Uso

### Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere instalación de dependencias

### Inicio Rápido

1. **Clona el repositorio** o descarga los archivos
2. **Abre** el archivo `index.html` en tu navegador
3. ¡Listo! La aplicación está funcionando

### Estructura del Proyecto

```
carbon-calculator/
├── index.html              # Página principal
├── README.md              # Este archivo
├── css/
│   └── styles.css         # Estilos CSS
└── js/
    ├── config.js          # Configuración y constantes
    ├── rotes.data.js      # Manejo de rutas y distancias
    ├── calculator.js      # Lógica de cálculos
    ├── ui.js              # Gestión de interfaz
    └── app.js             # Aplicación principal
```

---

## 📖 Guía de Uso

### Paso 1: Ingresar Datos del Viaje

1. **Origen**: Ingresa la ciudad de origen
2. **Destino**: Ingresa la ciudad de destino
3. **Modo de Distancia**:
   - **Automático**: La app intentará calcular la distancia
   - **Manual**: Ingresa la distancia manualmente
4. **Distancia**: Ingresa los kilómetros (si es modo manual)

### Paso 2: Seleccionar Transporte

Haz clic en una de las 4 tarjetas de transporte:

- 🚴 **Bicicleta**: 0 g CO₂/km (Eco-Friendly)
- 🚗 **Auto**: 120 g CO₂/km (Impacto Medio)
- 🚚 **Camión**: 250 g CO₂/km (Alto Impacto)
- 🚌 **Ómnibus**: 80 g CO₂/km (Impacto Bajo)

### Paso 3: Calcular

Haz clic en **"Calcular Impacto Ambiental"**

### Paso 4: Ver Resultados

Se abrirá un modal con:

- ☁️ **Emisiones de CO₂** totales del viaje
- 🌿 **Créditos de Carbono** necesarios
- 🌳 **Árboles Equivalentes** para compensar
- 💰 **Costo Estimado** de compensación

### Paso 5: Acciones

- **Nueva Consulta**: Realiza otro cálculo
- **Compartir Resultados**: Comparte tus resultados

---

## 🧮 Fórmulas de Cálculo

### Emisiones de CO₂

```javascript
Emisiones (kg) = Distancia (km) × Factor de Emisión (g/km) ÷ 1000
```

### Créditos de Carbono

```javascript
Créditos = Emisiones (toneladas) ÷ 1 tonelada por crédito
Costo = Créditos × $15 USD (precio promedio)
```

### Equivalencia de Árboles

```javascript
Árboles = Emisiones (kg) ÷ 22 kg CO₂/árbol/año
```

---

## 📊 Factores de Emisión Utilizados

| Transporte | g CO₂/km | Fuente                      |
| ---------- | -------- | --------------------------- |
| Bicicleta  | 0        | Cero emisiones              |
| Ómnibus    | 80       | Promedio transporte público |
| Auto       | 120      | Vehículo promedio           |
| Camión     | 250      | Vehículo de carga           |

---

## 🗺️ Rutas Predefinidas

La aplicación incluye distancias predefinidas entre ciudades principales:

### Argentina

- Buenos Aires ↔️ Córdoba: 700 km
- Buenos Aires ↔️ Rosario: 300 km
- Buenos Aires ↔️ Mendoza: 1050 km
- Buenos Aires ↔️ Mar del Plata: 400 km

### México

- Ciudad de México ↔️ Guadalajara: 550 km
- Ciudad de México ↔️ Monterrey: 900 km

### España

- Madrid ↔️ Barcelona: 620 km
- Madrid ↔️ Valencia: 355 km

### Internacional

- Nueva York ↔️ Los Ángeles: 4500 km
- Buenos Aires ↔️ São Paulo: 2100 km

---

## 💾 Almacenamiento Local

La aplicación guarda automáticamente:

- Últimos 10 cálculos realizados
- Estadísticas generales (total de viajes, emisiones, etc.)
- Datos almacenados en `localStorage` del navegador

### Ver Historial (Consola)

```javascript
// En la consola del navegador:
ecoTripApp.getHistory(); // Ver historial
ecoTripApp.getStats(); // Ver estadísticas
ecoTripApp.exportHistory(); // Exportar datos
ecoTripApp.clearHistory(); // Limpiar historial
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con variables CSS
- **JavaScript ES6+**: Programación orientada a objetos
- **LocalStorage API**: Persistencia de datos
- **Web Share API**: Compartir resultados (en navegadores compatibles)

---

## 🎨 Personalización

### Cambiar Factores de Emisión

Edita el archivo `js/config.js`:

```javascript
const EMISSION_FACTORS = {
  bicycle: 0,
  car: 120, // Modificar aquí
  truck: 250,
  bus: 80,
};
```

### Agregar Nuevas Rutas

```javascript
const KNOWN_ROUTES = {
  "CIUDAD1-CIUDAD2": distanciaEnKm,
  // Agregar más rutas aquí
};
```

### Cambiar Precio de Créditos

```javascript
const CARBON_CREDITS = {
  pricePerCreditUSD: 15, // Modificar precio
  // ...
};
```

---

## 🌟 Características Futuras

- [ ] Integración con Google Maps API para cálculo automático de distancias
- [ ] Más medios de transporte (avión, tren, moto)
- [ ] Gráficos de comparación
- [ ] Modo oscuro
- [ ] Múltiples idiomas
- [ ] Exportar resultados a PDF
- [ ] Calculadora para viajes multi-tramo
- [ ] Base de datos de proyectos de compensación
- [ ] Integración con APIs de compra de créditos de carbono

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas mejorar el proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Notas Técnicas

### Navegadores Soportados

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Limitaciones

- El cálculo automático de distancias requiere rutas predefinidas
- Los factores de emisión son promedios y pueden variar
- El precio de créditos de carbono es estimado

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Carbon Calculator Team**

- Versión: 1.0.0
- Fecha: Diciembre 2025

---

## 🌍 Mensaje Ambiental

> "Cada viaje cuenta. Cada decisión importa. Juntos podemos reducir nuestra huella de carbono y cuidar nuestro planeta para las futuras generaciones." 🌱

---

## 📞 Contacto y Soporte

¿Encontraste un bug? ¿Tienes una sugerencia?

- Abre un **Issue** en el repositorio
- Contacta al equipo de desarrollo

---

**¡Gracias por usar EcoTrip Calculator! 🌍💚**

_Calculando juntos un futuro más verde_
