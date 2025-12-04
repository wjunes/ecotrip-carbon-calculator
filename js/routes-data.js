// ========================================
// MÓDULO DE RUTAS Y DISTANCIAS
// ========================================

/**
 * Clase para manejar el cálculo y gestión de distancias entre ubicaciones
 */
class RoutesData {
    constructor() {
        this.routes = KNOWN_ROUTES || {};
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
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {number|null} - Distancia en km o null si no se encuentra
     */
    findDistance(origin, destination) {
        // Intenta buscar en ambas direcciones
        const forwardKey = this.generateRouteKey(origin, destination);
        const reverseKey = this.generateRouteKey(destination, origin);

        // Busca en el diccionario de rutas conocidas
        if (this.routes[forwardKey]) {
            return this.routes[forwardKey];
        }
        
        if (this.routes[reverseKey]) {
            return this.routes[reverseKey];
        }

        return null;
    }

    /**
     * Calcula distancia automáticamente o retorna null si no se puede
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {Object} - { distance: number|null, method: string }
     */
    calculateDistance(origin, destination) {
        if (!origin || !destination) {
            return { distance: null, method: 'none', error: 'Origen y destino requeridos' };
        }

        // Busca en rutas conocidas
        const knownDistance = this.findDistance(origin, destination);
        
        if (knownDistance !== null) {
            return { 
                distance: knownDistance, 
                method: 'known_route',
                message: 'Distancia encontrada en rutas conocidas'
            };
        }

        // Si no se encuentra, calcula una estimación aproximada
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
     * @param {string} input - Texto de búsqueda
     * @returns {Array} - Array de sugerencias
     */
    getCitySuggestions(input) {
        if (!input || input.length < 2) {
            return [];
        }

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
