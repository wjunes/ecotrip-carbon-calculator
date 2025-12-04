// ========================================
// CONFIGURACIÓN GLOBAL - EcoTrip Calculator
// ========================================

/**
 * Factores de emisión de CO₂ por medio de transporte
 * Expresados en gramos de CO₂ por kilómetro
 */
const EMISSION_FACTORS = {
    bicycle: 0,        // Bicicleta: 0 emisiones
    car: 120,          // Auto promedio: 120 g CO₂/km
    truck: 250,        // Camión: 250 g CO₂/km
    bus: 80            // Ómnibus: 80 g CO₂/km (por pasajero)
};

/**
 * Información detallada de cada medio de transporte
 */
const TRANSPORT_INFO = {
    bicycle: {
        name: 'Bicicleta',
        icon: '🚴',
        emissionFactor: 0,
        description: '0 g CO₂/km',
        category: 'eco-friendly',
        benefits: 'Transporte 100% ecológico y saludable'
    },
    car: {
        name: 'Auto',
        icon: '🚗',
        emissionFactor: 120,
        description: '120 g CO₂/km',
        category: 'medium-impact',
        benefits: 'Conveniente para distancias medias'
    },
    truck: {
        name: 'Camión',
        icon: '🚚',
        emissionFactor: 250,
        description: '250 g CO₂/km',
        category: 'high-impact',
        benefits: 'Para transporte de carga pesada'
    },
    bus: {
        name: 'Ómnibus',
        icon: '🚌',
        emissionFactor: 80,
        description: '80 g CO₂/km',
        category: 'low-impact',
        benefits: 'Opción eficiente para transporte público'
    }
};

/**
 * Configuración para créditos de carbono
 */
const CARBON_CREDITS = {
    // 1 tonelada de CO₂ = 1 crédito de carbono
    tonnesPerCredit: 1,
    
    // Precio promedio por crédito de carbono en USD
    pricePerCreditUSD: 15,
    
    // Conversión a otras monedas (valores aproximados)
    currencies: {
        USD: 15,
        EUR: 14,
        ARS: 15000,
        MXN: 250
    },
    
    // Un árbol absorbe aproximadamente 22 kg de CO₂ por año
    kgCO2PerTreePerYear: 22
};

/**
 * Configuración de la aplicación
 */
const APP_CONFIG = {
    // Moneda por defecto
    defaultCurrency: 'USD',
    
    // Unidades de medida
    distanceUnit: 'km',
    emissionUnit: 'kg',
    
    // Validaciones
    minDistance: 0.1,
    maxDistance: 50000,
    
    // Mensajes de error
    errors: {
        noOrigin: 'Por favor, ingresa el origen del viaje',
        noDestination: 'Por favor, ingresa el destino del viaje',
        noDistance: 'Por favor, ingresa la distancia del viaje',
        invalidDistance: 'La distancia debe ser mayor a 0',
        noTransport: 'Por favor, selecciona un medio de transporte',
        calculationError: 'Error al calcular. Por favor, intenta nuevamente'
    },
    
    // Animaciones
    animationDuration: 300
};

/**
 * Datos de ciudades principales para autocompletado (opcional)
 */
const MAJOR_CITIES = [
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
    'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe',
    'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla',
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla',
    'Nueva York', 'Los Ángeles', 'Chicago', 'Houston'
];

/**
 * Rutas predefinidas con distancias conocidas (para modo automático)
 * Formato: "ORIGEN-DESTINO": distancia en km
 */
const KNOWN_ROUTES = {
    // Argentina
    'BUENOS AIRES-CORDOBA': 700,
    'BUENOS AIRES-ROSARIO': 300,
    'BUENOS AIRES-MENDOZA': 1050,
    'BUENOS AIRES-MAR DEL PLATA': 400,
    'CORDOBA-MENDOZA': 650,
    'CORDOBA-ROSARIO': 400,
    
    // México
    'CIUDAD DE MEXICO-GUADALAJARA': 550,
    'CIUDAD DE MEXICO-MONTERREY': 900,
    'GUADALAJARA-MONTERREY': 750,
    
    // España
    'MADRID-BARCELONA': 620,
    'MADRID-VALENCIA': 355,
    'BARCELONA-VALENCIA': 350,
    
    // Internacional
    'NUEVA YORK-LOS ANGELES': 4500,
    'MADRID-PARIS': 1270,
    'BUENOS AIRES-SAO PAULO': 2100
};

/**
 * Textos de la interfaz (para internacionalización futura)
 */
const UI_TEXTS = {
    es: {
        calculating: 'Calculando...',
        success: 'Cálculo completado',
        error: 'Error',
        newCalculation: 'Nueva consulta realizada',
        shareMessage: '🌍 Mi viaje emitió {co2} kg de CO₂. ¡Calcula el tuyo con EcoTrip Calculator!'
    }
};

// Exportar configuraciones (para uso en otros módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMISSION_FACTORS,
        TRANSPORT_INFO,
        CARBON_CREDITS,
        APP_CONFIG,
        MAJOR_CITIES,
        KNOWN_ROUTES,
        UI_TEXTS
    };
}
