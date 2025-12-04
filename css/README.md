# 📂 Estructura de Estilos CSS - EcoTrip Calculator

## 🎨 Arquitectura Modular

El proyecto ha sido refactorizado para utilizar una arquitectura CSS modular, separando los estilos en archivos específicos según su función. Esto mejora la mantenibilidad, escalabilidad y organización del código.

## 📁 Estructura de Carpetas

```
css/
├── styles.css                  # Archivo principal (importa todos los módulos)
├── styles.css.backup           # Respaldo del archivo monolítico original
│
├── base/                       # Fundamentos del proyecto
│   ├── variables.css           # Variables CSS (colores, espaciado, etc.)
│   └── animations.css          # Todas las animaciones @keyframes
│
├── layout/                     # Estructura y diseño
│   ├── layout.css              # Container, main, footer
│   └── responsive.css          # Media queries para responsive
│
├── components/                 # Componentes de UI
│   ├── header.css              # Estilos del header
│   ├── forms.css               # Formularios y inputs
│   ├── transport-cards.css     # Tarjetas de selección de transporte
│   ├── buttons.css             # Todos los botones
│   ├── modal.css               # Modal y resultados
│   └── notifications.css       # Sistema de notificaciones toast
│
└── utilities/                  # Utilidades y helpers
    └── utilities.css           # Clases de utilidad y scrollbar
```

## 🔧 Archivo Principal: `styles.css`

El archivo `styles.css` actúa como punto de entrada y orquestador, importando todos los módulos en el orden correcto:

```css
/* BASE - Fundamentos */
@import url('base/variables.css');
@import url('base/animations.css');

/* LAYOUT - Estructura */
@import url('layout/layout.css');
@import url('layout/responsive.css');

/* COMPONENTS - Componentes */
@import url('components/header.css');
@import url('components/forms.css');
@import url('components/transport-cards.css');
@import url('components/buttons.css');
@import url('components/modal.css');
@import url('components/notifications.css');

/* UTILITIES - Utilidades */
@import url('utilities/utilities.css');
```

## 📋 Descripción de Módulos

### **Base** (Fundamentos)

#### `variables.css`
- Variables CSS globales (`:root`)
- Colores principales, de impacto, neutrales
- Sombras, espaciado, border-radius
- Transiciones
- Reset CSS (`*`, `box-sizing`)
- Estilos del `body`

#### `animations.css`
- `@keyframes float` - Animación flotante (header)
- `@keyframes bounce` - Rebote (icono header)
- `@keyframes fadeIn` - Aparición gradual
- `@keyframes slideUp` - Deslizamiento hacia arriba (modal)
- `@keyframes pulse` - Efecto de pulso
- `@keyframes slideInRight` - Entrada desde derecha (notificaciones)
- `@keyframes slideOutRight` - Salida hacia derecha (notificaciones)

### **Layout** (Estructura)

#### `layout.css`
- `.container` - Contenedor principal con max-width
- `.main` - Sección principal
- `.section-title` - Títulos de sección
- `.footer` - Pie de página

#### `responsive.css`
- Media query `@media (max-width: 768px)` - Tablets
- Media query `@media (max-width: 480px)` - Móviles
- Ajustes de tamaño de fuente, grids y espaciado

### **Components** (Componentes)

#### `header.css`
- `.header` - Contenedor del header con gradiente
- `.header::before` - Círculo animado de fondo
- `.header-content`, `.header-icon`, `.header-title`, `.header-subtitle`

#### `forms.css`
- `.trip-details` - Contenedor del formulario
- `.form-group`, `.form-group label`
- `.form-input`, `.form-select` - Inputs y selects
- Estados `:focus` y `::placeholder`

#### `transport-cards.css`
- `.transport-selection` - Contenedor con backdrop-filter
- `.transport-grid` - Grid de tarjetas
- `.transport-card` - Tarjeta individual con estados (hover, selected)
- `.transport-icon`, `.transport-name`, `.transport-description`
- `.transport-eco-badge` - Badges de impacto (eco-friendly, low, medium, high)

#### `buttons.css`
- `.calculate-btn` - Botón principal de cálculo
- `.btn-primary` - Botón primario (modal)
- `.btn-secondary` - Botón secundario (modal)
- `.close-btn` - Botón de cerrar modal
- Estados `:hover`, `:active`, `:disabled`

#### `modal.css`
- `.modal` - Overlay del modal con backdrop-filter
- `.modal-content` - Contenido del modal
- `.modal-title` - Título del modal
- `.results-grid` - Grid de resultados
- `.result-card` - Tarjetas de resultado (co2-card, credits-card)
- `.result-icon`, `.result-title`, `.result-value`, `.result-description`
- `.result-details` - Detalles con items
- `.modal-actions` - Acciones del modal

#### `notifications.css`
- `.notification` - Contenedor de notificación
- `.notification-success`, `.notification-error`
- `.notification-warning`, `.notification-info`

### **Utilities** (Utilidades)

#### `utilities.css`
- `.hidden` - Ocultar elementos
- `.fade-in` - Aplicar animación fadeIn
- `.pulse` - Aplicar animación pulse
- `::-webkit-scrollbar` - Scrollbar personalizado
- `::-webkit-scrollbar-track`, `::-webkit-scrollbar-thumb`

## ✅ Ventajas de la Arquitectura Modular

### 1. **Mantenibilidad**
- Fácil localizar y editar estilos específicos
- Cada archivo tiene una responsabilidad única
- Código más limpio y organizado

### 2. **Escalabilidad**
- Agregar nuevos componentes sin afectar existentes
- Fácil expandir funcionalidades
- Estructura clara para nuevos desarrolladores

### 3. **Reutilización**
- Componentes independientes reutilizables
- Variables CSS centralizadas
- Consistencia en toda la aplicación

### 4. **Performance**
- Los navegadores pueden cachear archivos individuales
- Posibilidad de cargar solo los módulos necesarios
- Menor tiempo de descarga en actualizaciones parciales

### 5. **Colaboración**
- Múltiples desarrolladores pueden trabajar simultáneamente
- Menos conflictos en control de versiones (Git)
- Revisiones de código más enfocadas

### 6. **Testing**
- Facilita el testing de componentes individuales
- Debugging más rápido y preciso
- Identificación clara de problemas

## 🔄 Migración desde Monolito

El archivo original `styles.css` (730 líneas) ha sido dividido en:
- **2 archivos base** (~140 líneas)
- **2 archivos layout** (~105 líneas)
- **6 archivos components** (~385 líneas)
- **1 archivo utilities** (~40 líneas)
- **1 archivo principal** (~50 líneas) con imports

**Total:** 11 archivos modulares + 1 backup

Se mantiene el archivo `styles.css.backup` como respaldo del código monolítico original.

## 📖 Guía de Uso

### Para editar estilos de un componente específico:

1. **Header** → Editar `css/components/header.css`
2. **Formularios** → Editar `css/components/forms.css`
3. **Botones** → Editar `css/components/buttons.css`
4. **Modal** → Editar `css/components/modal.css`
5. **Variables globales** → Editar `css/base/variables.css`
6. **Responsive** → Editar `css/layout/responsive.css`

### Para agregar un nuevo componente:

1. Crear archivo en `css/components/nombre-componente.css`
2. Agregar `@import url('components/nombre-componente.css');` en `css/styles.css`
3. Mantener el orden de importación lógico

## 🎯 Convenciones de Código

- **Orden de propiedades CSS:** Posición → Display → Box Model → Visual → Typography
- **Nomenclatura:** BEM-style (`.block`, `.block__element`, `.block--modifier`)
- **Comentarios:** Secciones con separadores visuales `/* ======== */`
- **Variables:** Usar variables CSS en lugar de valores hardcodeados
- **Responsive:** Mobile-first approach

## 🚀 Próximos Pasos (Opcional)

Para seguir mejorando la arquitectura CSS:

1. ✅ ~~Modularizar estilos en archivos separados~~ (Completado)
2. 🔄 Implementar preprocessador SASS/SCSS (opcional)
3. 🔄 Agregar CSS-in-JS para componentes dinámicos (opcional)
4. 🔄 Implementar CSS Modules para scope local (opcional)
5. 🔄 Agregar PostCSS para autoprefixer automático (opcional)

## 📝 Notas Importantes

- ⚠️ No eliminar `styles.css.backup` - Sirve como referencia
- ✅ Mantener el orden de imports en `styles.css`
- ✅ Usar variables CSS en lugar de colores hardcodeados
- ✅ Agrupar media queries en `responsive.css`
- ✅ Documentar cambios significativos

---

**Última actualización:** Diciembre 2025  
**Versión:** 2.0 (Arquitectura Modular)  
**Autor:** Willans Junes
