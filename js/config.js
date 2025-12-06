// ========================================
// CONFIGURACIÓN GLOBAL - EcoTrip Calculator
// ========================================

/**
 * Factores de emisión de CO₂ por medio de transporte
 * Expresados en gramos de CO₂ por kilómetro
 */
const EMISSION_FACTORS = {
    electric: 40,      // Auto eléctrico: 40 g CO₂/km (considerando producción de electricidad)
    car: 120,          // Auto promedio: 120 g CO₂/km
    airplane: 255,     // Avión: 255 g CO₂/km (promedio por pasajero en vuelos comerciales)
    bus: 80            // Ómnibus: 80 g CO₂/km (por pasajero)
};

/**
 * Información detallada de cada medio de transporte
 */
const TRANSPORT_INFO = {
    electric: {
        name: 'Auto Eléctrico',
        icon: '⚡',
        emissionFactor: 40,
        description: '40 g CO₂/km',
        category: 'eco-friendly',
        benefits: 'Transporte sustentable con bajas emisiones'
    },
    car: {
        name: 'Auto',
        icon: '🚗',
        emissionFactor: 120,
        description: '120 g CO₂/km',
        category: 'medium-impact',
        benefits: 'Conveniente para distancias medias'
    },
    airplane: {
        name: 'Avión',
        icon: '✈️',
        emissionFactor: 255,
        description: '255 g CO₂/km',
        category: 'high-impact',
        benefits: 'Ideal para largas distancias y viajes internacionales'
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
    // Argentina
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata',
    'San Miguel de Tucumán', 'Mar del Plata', 'Salta', 'Santa Fe',
    'San Juan', 'Resistencia', 'Neuquén', 'Posadas', 'Bahía Blanca',
    'Corrientes', 'San Salvador de Jujuy', 'Paraná', 'Formosa',
    'San Luis', 'La Rioja', 'Catamarca', 'Río Gallegos', 'Ushuaia',
    
    // Uruguay
    'Montevideo', 'Salto', 'Paysandú', 'Maldonado', 'Rivera',
    'Tacuarembó', 'Melo', 'Mercedes', 'Artigas', 'Colonia del Sacramento',
    
    // Chile
    'Santiago', 'Valparaíso', 'Concepción', 'La Serena', 'Antofagasta',
    'Temuco', 'Rancagua', 'Talca', 'Arica', 'Puerto Montt',
    'Iquique', 'Coquimbo', 'Osorno', 'Valdivia', 'Punta Arenas',
    
    // Brasil
    'São Paulo', 'Río de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
    'Belo Horizonte', 'Manaos', 'Curitiba', 'Recife', 'Porto Alegre',
    'Belém', 'Goiânia', 'Guarulhos', 'Campinas', 'São Luís',
    
    // Paraguay
    'Asunción', 'Ciudad del Este', 'San Lorenzo', 'Luque', 'Capiatá',
    'Encarnación', 'Pedro Juan Caballero', 'Coronel Oviedo',
    
    // Internacional (principales destinos)
    'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao',
    'Ciudad de México', 'Guadalajara', 'Monterrey', 'Cancún',
    'Nueva York', 'Los Ángeles', 'Miami', 'Chicago',
    'Londres', 'París', 'Roma', 'Berlín', 'Ámsterdam',
    'Lima', 'Bogotá', 'Quito', 'Caracas', 'La Paz'
];

/**
 * Rutas predefinidas con distancias conocidas (para modo automático)
 * Formato: "ORIGEN-DESTINO": distancia en km
 */
const KNOWN_ROUTES = {
    // ========================================
    // ARGENTINA - Rutas Nacionales
    // ========================================
    'BUENOS AIRES-CORDOBA': 700,
    'BUENOS AIRES-ROSARIO': 300,
    'BUENOS AIRES-MENDOZA': 1050,
    'BUENOS AIRES-MAR DEL PLATA': 400,
    'BUENOS AIRES-LA PLATA': 60,
    'BUENOS AIRES-SAN MIGUEL DE TUCUMAN': 1150,
    'BUENOS AIRES-SALTA': 1600,
    'BUENOS AIRES-SANTA FE': 475,
    'BUENOS AIRES-SAN JUAN': 1110,
    'BUENOS AIRES-RESISTENCIA': 1000,
    'BUENOS AIRES-NEUQUEN': 1170,
    'BUENOS AIRES-POSADAS': 1050,
    'BUENOS AIRES-BAHIA BLANCA': 650,
    'BUENOS AIRES-CORRIENTES': 840,
    'BUENOS AIRES-SAN SALVADOR DE JUJUY': 1650,
    'BUENOS AIRES-PARANA': 485,
    'BUENOS AIRES-FORMOSA': 1180,
    'BUENOS AIRES-SAN LUIS': 800,
    'BUENOS AIRES-LA RIOJA': 1150,
    'BUENOS AIRES-CATAMARCA': 1200,
    'BUENOS AIRES-RIO GALLEGOS': 2600,
    'BUENOS AIRES-USHUAIA': 3100,
    
    'CORDOBA-MENDOZA': 650,
    'CORDOBA-ROSARIO': 400,
    'CORDOBA-SAN MIGUEL DE TUCUMAN': 470,
    'CORDOBA-SALTA': 900,
    'CORDOBA-SAN JUAN': 500,
    'CORDOBA-MAR DEL PLATA': 850,
    'CORDOBA-SANTA FE': 330,
    'CORDOBA-LA RIOJA': 480,
    
    'ROSARIO-SANTA FE': 160,
    'ROSARIO-MAR DEL PLATA': 620,
    'ROSARIO-MENDOZA': 750,
    'ROSARIO-PARANA': 310,
    
    'MENDOZA-SAN JUAN': 170,
    'MENDOZA-SAN LUIS': 270,
    'MENDOZA-NEUQUEN': 570,
    
    'SALTA-SAN MIGUEL DE TUCUMAN': 310,
    'SALTA-SAN SALVADOR DE JUJUY': 120,
    'SALTA-FORMOSA': 620,
    
    // ========================================
    // URUGUAY - Rutas Nacionales
    // ========================================
    'MONTEVIDEO-SALTO': 500,
    'MONTEVIDEO-PAYSANDU': 370,
    'MONTEVIDEO-MALDONADO': 130,
    'MONTEVIDEO-RIVERA': 500,
    'MONTEVIDEO-TACUAREMBO': 390,
    'MONTEVIDEO-MELO': 390,
    'MONTEVIDEO-MERCEDES': 275,
    'MONTEVIDEO-ARTIGAS': 600,
    'MONTEVIDEO-COLONIA DEL SACRAMENTO': 180,
    
    'SALTO-PAYSANDU': 130,
    'SALTO-ARTIGAS': 260,
    'MALDONADO-COLONIA DEL SACRAMENTO': 250,
    
    // ========================================
    // CHILE - Rutas Nacionales
    // ========================================
    'SANTIAGO-VALPARAISO': 120,
    'SANTIAGO-CONCEPCION': 500,
    'SANTIAGO-LA SERENA': 470,
    'SANTIAGO-ANTOFAGASTA': 1360,
    'SANTIAGO-TEMUCO': 680,
    'SANTIAGO-RANCAGUA': 90,
    'SANTIAGO-TALCA': 255,
    'SANTIAGO-ARICA': 2060,
    'SANTIAGO-PUERTO MONTT': 1020,
    'SANTIAGO-IQUIQUE': 1840,
    'SANTIAGO-COQUIMBO': 440,
    'SANTIAGO-OSORNO': 920,
    'SANTIAGO-VALDIVIA': 840,
    'SANTIAGO-PUNTA ARENAS': 3090,
    
    'VALPARAISO-LA SERENA': 350,
    'CONCEPCION-TEMUCO': 280,
    'CONCEPCION-PUERTO MONTT': 570,
    'ANTOFAGASTA-IQUIQUE': 490,
    'ARICA-IQUIQUE': 310,
    
    // ========================================
    // BRASIL - Rutas Nacionales
    // ========================================
    'SAO PAULO-RIO DE JANEIRO': 430,
    'SAO PAULO-BRASILIA': 1015,
    'SAO PAULO-BELO HORIZONTE': 585,
    'SAO PAULO-CURITIBA': 410,
    'SAO PAULO-PORTO ALEGRE': 1110,
    'SAO PAULO-CAMPINAS': 100,
    'SAO PAULO-GUARULHOS': 25,
    
    'RIO DE JANEIRO-BRASILIA': 1150,
    'RIO DE JANEIRO-BELO HORIZONTE': 440,
    'RIO DE JANEIRO-SALVADOR': 1650,
    
    'BRASILIA-BELO HORIZONTE': 740,
    'BRASILIA-GOIANIA': 210,
    'BRASILIA-SALVADOR': 1450,
    
    'SALVADOR-FORTALEZA': 1200,
    'SALVADOR-RECIFE': 840,
    
    'PORTO ALEGRE-CURITIBA': 710,
    'CURITIBA-FLORIANOPOLIS': 300,
    
    'BELEM-MANAUS': 1290,
    'BELEM-SAO LUIS': 550,
    
    // ========================================
    // PARAGUAY - Rutas Nacionales
    // ========================================
    'ASUNCION-CIUDAD DEL ESTE': 325,
    'ASUNCION-SAN LORENZO': 15,
    'ASUNCION-LUQUE': 20,
    'ASUNCION-CAPIATA': 25,
    'ASUNCION-ENCARNACION': 370,
    'ASUNCION-PEDRO JUAN CABALLERO': 550,
    'ASUNCION-CORONEL OVIEDO': 140,
    
    // ========================================
    // RUTAS INTERNACIONALES SUDAMÉRICA
    // ========================================
    'BUENOS AIRES-MONTEVIDEO': 230,
    'BUENOS AIRES-SANTIAGO': 1400,
    'BUENOS AIRES-SAO PAULO': 2100,
    'BUENOS AIRES-RIO DE JANEIRO': 2200,
    'BUENOS AIRES-ASUNCION': 1370,
    'BUENOS AIRES-LIMA': 3150,
    'BUENOS AIRES-BOGOTA': 5150,
    'BUENOS AIRES-CARACAS': 5320,
    'BUENOS AIRES-LA PAZ': 2450,
    
    'SANTIAGO-LIMA': 2550,
    'SANTIAGO-MONTEVIDEO': 1950,
    'SANTIAGO-SAO PAULO': 2900,
    'SANTIAGO-BOGOTA': 4780,
    
    'SAO PAULO-MONTEVIDEO': 1900,
    'SAO PAULO-ASUNCION': 1400,
    'SAO PAULO-LIMA': 3320,
    'SAO PAULO-BOGOTA': 4370,
    
    'MONTEVIDEO-ASUNCION': 1150,
    'ASUNCION-LA PAZ': 1550,
    
    'LIMA-BOGOTA': 1900,
    'LIMA-QUITO': 1500,
    'BOGOTA-QUITO': 750,
    'BOGOTA-CARACAS': 920,
    
    // ========================================
    // RUTAS INTERCONTINENTALES (VUELOS)
    // ========================================
    // Argentina - Europa
    'BUENOS AIRES-MADRID': 10070,
    'BUENOS AIRES-BARCELONA': 10490,
    'BUENOS AIRES-ROMA': 11060,
    'BUENOS AIRES-PARIS': 11020,
    'BUENOS AIRES-LONDRES': 11130,
    'BUENOS AIRES-BERLIN': 11670,
    'BUENOS AIRES-AMSTERDAM': 11280,
    
    // Argentina - Norteamérica
    'BUENOS AIRES-NUEVA YORK': 8530,
    'BUENOS AIRES-LOS ANGELES': 9440,
    'BUENOS AIRES-MIAMI': 7240,
    'BUENOS AIRES-CHICAGO': 8970,
    'BUENOS AIRES-CIUDAD DE MEXICO': 7370,
    'BUENOS AIRES-CANCUN': 7280,
    
    // Brasil - Europa
    'SAO PAULO-MADRID': 8300,
    'SAO PAULO-LISBOA': 7720,
    'SAO PAULO-PARIS': 9170,
    'SAO PAULO-LONDRES': 9440,
    'SAO PAULO-ROMA': 9240,
    'RIO DE JANEIRO-MADRID': 8180,
    'RIO DE JANEIRO-LISBOA': 7600,
    
    // Brasil - Norteamérica
    'SAO PAULO-NUEVA YORK': 7680,
    'SAO PAULO-MIAMI': 6570,
    'SAO PAULO-LOS ANGELES': 10130,
    'RIO DE JANEIRO-NUEVA YORK': 7750,
    'RIO DE JANEIRO-MIAMI': 6640,
    
    // Chile - Europa
    'SANTIAGO-MADRID': 10730,
    'SANTIAGO-PARIS': 11670,
    'SANTIAGO-LONDRES': 11640,
    
    // Chile - Norteamérica
    'SANTIAGO-NUEVA YORK': 8260,
    'SANTIAGO-LOS ANGELES': 8990,
    'SANTIAGO-MIAMI': 7090,
    
    // México - Europa
    'CIUDAD DE MEXICO-MADRID': 9200,
    'CIUDAD DE MEXICO-PARIS': 9230,
    'CIUDAD DE MEXICO-LONDRES': 8930,
    'CANCUN-MADRID': 8520,
    
    // México - Norteamérica
    'CIUDAD DE MEXICO-NUEVA YORK': 3360,
    'CIUDAD DE MEXICO-LOS ANGELES': 2490,
    'CIUDAD DE MEXICO-MIAMI': 2070,
    'CIUDAD DE MEXICO-CHICAGO': 2700,
    'GUADALAJARA-LOS ANGELES': 2280,
    'MONTERREY-NUEVA YORK': 3150,
    'CANCUN-NUEVA YORK': 2570,
    'CANCUN-MIAMI': 900,
    
    // Europa - Norteamérica
    'MADRID-NUEVA YORK': 5770,
    'MADRID-LOS ANGELES': 9350,
    'MADRID-MIAMI': 7030,
    'BARCELONA-NUEVA YORK': 6150,
    'PARIS-NUEVA YORK': 5840,
    'PARIS-LOS ANGELES': 9080,
    'LONDRES-NUEVA YORK': 5570,
    'LONDRES-LOS ANGELES': 8760,
    'ROMA-NUEVA YORK': 6900,
    'BERLIN-NUEVA YORK': 6390,
    
    // Europa - Europa
    'MADRID-PARIS': 1270,
    'MADRID-LONDRES': 1260,
    'MADRID-ROMA': 1360,
    'MADRID-BERLIN': 1870,
    'MADRID-AMSTERDAM': 1470,
    'BARCELONA-PARIS': 830,
    'BARCELONA-ROMA': 860,
    'PARIS-LONDRES': 340,
    'PARIS-ROMA': 1110,
    'PARIS-BERLIN': 880,
    'LONDRES-ROMA': 1440,
    'LONDRES-BERLIN': 930,
    'LONDRES-AMSTERDAM': 360
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
