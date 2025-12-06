// ========================================
// MÓDULO DE RUTAS Y DISTANCIAS
// ========================================

/**
 * Clase para manejar el cálculo y gestión de distancias entre ubicaciones
 * Ahora integrado con DistanceAPIService para datos JSON
 */
class RoutesData {
    constructor(apiService = null) {
        this.routes = KNOWN_ROUTES || {};
        this.apiService = apiService; // Servicio de API para consultar JSON
    }

    /**
     * Establece el servicio API
     */
    setAPIService(apiService) {
        this.apiService = apiService;
        console.log('✅ API Service conectado a RoutesData');
    }

    /**
     * Normaliza un nombre de ciudad para comparación
     * @param {string} cityName - Nombre de la ciudad
     * @returns {string} - Nombre normalizado
     */
    normalizeCityName(cityName) {
        return cityName
            .trim()
            .toUpperCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Elimina acentos
    }

    /**
     * Genera la clave de ruta para búsqueda
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {string} - Clave de ruta
     */
    generateRouteKey(origin, destination) {
        const normalizedOrigin = this.normalizeCityName(origin);
        const normalizedDestination = this.normalizeCityName(destination);
        return `${normalizedOrigin}-${normalizedDestination}`;
    }

    /**
     * Busca la distancia entre dos ubicaciones
     * Primero intenta con rutas conocidas (KNOWN_ROUTES), luego con API Service
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {number|null} - Distancia en km o null si no se encuentra
     */
    findDistance(origin, destination) {
        // 1. Buscar PRIMERO en rutas conocidas (KNOWN_ROUTES) - incluye rutas internacionales
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

        // 2. Si no se encuentra, intentar con API Service (datos JSON locales)
        if (this.apiService) {
            const distance = this.apiService.getDistance(origin, destination);
            if (distance !== null) {
                console.log(`📍 Distancia encontrada en API Service: ${distance} km`);
                return distance;
            }
        }

        return null;
    }

    /**
     * Calcula distancia automáticamente o retorna null si no se puede
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {Object} - { distance: number|null, method: string, routeInfo?: object }
     */
    calculateDistance(origin, destination) {
        if (!origin || !destination) {
            console.warn('⚠️ RoutesData.calculateDistance: Origen o destino vacío');
            return { distance: null, method: 'none', error: 'Origen y destino requeridos' };
        }

        console.log(`🔍 RoutesData.calculateDistance: ${origin} → ${destination}`);

        // 1. Buscar PRIMERO en rutas conocidas (KNOWN_ROUTES) - incluye rutas internacionales
        console.log('🔎 Buscando en KNOWN_ROUTES...');
        const knownDistance = this.findDistance(origin, destination);
        
        if (knownDistance !== null) {
            console.log(`✅ Distancia encontrada en KNOWN_ROUTES: ${knownDistance} km`);
            return { 
                distance: knownDistance, 
                method: 'known_route',
                message: `Distancia encontrada: ${knownDistance} km`
            };
        }

        // 2. Intentar con API Service (tiene info adicional de rutas locales)
        if (this.apiService) {
            console.log('🔎 Buscando en API Service...');
            const routeInfo = this.apiService.getRouteInfo(origin, destination);
            console.log('📊 Resultado de API:', routeInfo);
            
            if (routeInfo) {
                console.log(`✅ Ruta encontrada en API: ${routeInfo.distance} km`);
                return {
                    distance: routeInfo.distance,
                    method: 'api_route',
                    message: `Distancia encontrada: ${routeInfo.distance} km`,
                    routeInfo: routeInfo
                };
            } else {
                console.log('⚠️ Ruta no encontrada en API');
            }
        }

        // 3. Si no se encuentra, calcula una estimación aproximada
        // (En una versión real, aquí se integraría con Google Maps API o similar)
        const estimatedDistance = this.estimateDistance(origin, destination);
        
        if (estimatedDistance !== null) {
            return { 
                distance: estimatedDistance, 
                method: 'estimated',
                message: 'Distancia estimada aproximadamente'
            };
        }

        return { 
            distance: null, 
            method: 'none',
            error: 'No se pudo calcular la distancia. Por favor, ingrésala manualmente.'
        };
    }

    /**
     * Estima distancia basándose en heurísticas simples
     * (Versión simplificada - en producción usar API de mapas)
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {number|null} - Distancia estimada o null
     */
    estimateDistance(origin, destination) {
        // Por ahora, retorna null para forzar entrada manual
        // En una implementación real, aquí iría la llamada a una API de mapas
        
        // Ejemplo de integración futura con Google Maps Distance Matrix API:
        /*
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?
                origins=${encodeURIComponent(origin)}&
                destinations=${encodeURIComponent(destination)}&
                key=YOUR_API_KEY`);
            const data = await response.json();
            return data.rows[0].elements[0].distance.value / 1000; // Convertir a km
        } catch (error) {
            console.error('Error calculando distancia:', error);
            return null;
        }
        */
        
        return null;
    }

    /**
     * Agrega una nueva ruta al sistema
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @param {number} distance - Distancia en km
     */
    addRoute(origin, destination, distance) {
        const routeKey = this.generateRouteKey(origin, destination);
        this.routes[routeKey] = distance;
        
        // También agregar la ruta inversa
        const reverseKey = this.generateRouteKey(destination, origin);
        this.routes[reverseKey] = distance;
        
        console.log(`✅ Ruta agregada: ${origin} ↔️ ${destination} = ${distance} km`);
    }

    /**
     * Obtiene sugerencias de ciudades basadas en texto ingresado
     * Usa API Service si está disponible, sino usa lista hardcodeada
     * @param {string} input - Texto de búsqueda
     * @returns {Array} - Array de sugerencias (objetos de ciudad completos)
     */
    getCitySuggestions(input) {
        if (!input || input.length < 2) {
            return [];
        }

        // Usar API Service si está disponible
        if (this.apiService) {
            const suggestions = this.apiService.getSuggestions(input, 10);
            // Devolver objetos completos para el UI
            return suggestions;
        }

        // Fallback a lista hardcodeada
        const normalizedInput = this.normalizeCityName(input);
        
        return MAJOR_CITIES.filter(city => 
            this.normalizeCityName(city).includes(normalizedInput)
        ).slice(0, 5); // Máximo 5 sugerencias
    }

    /**
     * Valida si una distancia es válida
     * @param {number} distance - Distancia a validar
     * @returns {boolean} - true si es válida
     */
    isValidDistance(distance) {
        const min = APP_CONFIG.minDistance || 0.1;
        const max = APP_CONFIG.maxDistance || 50000;
        
        return distance !== null && 
               distance !== undefined && 
               !isNaN(distance) && 
               distance >= min && 
               distance <= max;
    }

    /**
     * Obtiene información sobre una ruta
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @param {number} distance - Distancia
     * @returns {Object} - Información de la ruta
     */
    getRouteInfo(origin, destination, distance) {
        return {
            origin: origin.trim(),
            destination: destination.trim(),
            distance: parseFloat(distance),
            formattedDistance: `${parseFloat(distance).toFixed(1)} km`,
            isValid: this.isValidDistance(distance),
            estimatedTime: this.estimateTravelTime(distance) // Tiempo estimado de viaje
        };
    }

    /**
     * Estima el tiempo de viaje basado en distancia y velocidad promedio
     * @param {number} distance - Distancia en km
     * @param {number} avgSpeed - Velocidad promedio (km/h)
     * @returns {Object} - Tiempo estimado
     */
    estimateTravelTime(distance, avgSpeed = 80) {
        const hours = distance / avgSpeed;
        const totalMinutes = hours * 60;
        const h = Math.floor(totalMinutes / 60);
        const m = Math.round(totalMinutes % 60);
        
        return {
            hours: h,
            minutes: m,
            formatted: `${h}h ${m}min`,
            totalHours: hours.toFixed(2)
        };
    }
}

// NO crear la instancia aquí - se creará en app.js
// const routesData = new RoutesData();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RoutesData;
}
