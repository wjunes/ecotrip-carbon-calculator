/**
 * DistanceAPIService - Servicio para consultar la pseudo-API de distancias
 * 
 * Este servicio carga datos desde archivos JSON locales y proporciona
 * funcionalidades para:
 * - Buscar ciudades por nombre
 * - Obtener distancias entre ciudades
 * - Autocompletado de ciudades
 * - Sugerencias de rutas
 */

class DistanceAPIService {
    constructor() {
        this.cities = null;
        this.routes = null;
        this.citiesLoaded = false;
        this.routesLoaded = false;
        this.cityIndex = new Map(); // Índice para búsqueda rápida
        this.routeIndex = new Map(); // Índice de rutas
    }

    /**
     * Inicializa el servicio cargando los datos JSON
     */
    async initialize() {
        try {
            await Promise.all([
                this.loadCities(),
                this.loadRoutes()
            ]);
            
            this.buildIndexes();
            console.log('✅ DistanceAPIService inicializado correctamente');
            console.log(`📊 ${this.getCityCount()} ciudades cargadas`);
            console.log(`🛣️  ${this.getRouteCount()} rutas disponibles`);
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando DistanceAPIService:', error);
            return false;
        }
    }

    /**
     * Carga el archivo de ciudades
     */
    async loadCities() {
        try {
            const response = await fetch('data/cities.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.cities = await response.json();
            this.citiesLoaded = true;
        } catch (error) {
            console.error('Error cargando cities.json:', error);
            throw error;
        }
    }

    /**
     * Carga el archivo de rutas
     */
    async loadRoutes() {
        try {
            const response = await fetch('data/routes.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.routes = await response.json();
            this.routesLoaded = true;
        } catch (error) {
            console.error('Error cargando routes.json:', error);
            throw error;
        }
    }

    /**
     * Construye índices para búsqueda rápida
     */
    buildIndexes() {
        // Índice de ciudades
        this.cityIndex.clear();
        
        for (const [countryCode, countryData] of Object.entries(this.cities.countries)) {
            for (const city of countryData.cities) {
                // Índice por ID
                this.cityIndex.set(city.id, city);
                
                // Índice por nombre (normalizado)
                const normalizedName = this.normalizeName(city.name);
                this.cityIndex.set(normalizedName, city);
                
                // Índice por aliases
                if (city.aliases && city.aliases.length > 0) {
                    for (const alias of city.aliases) {
                        const normalizedAlias = this.normalizeName(alias);
                        this.cityIndex.set(normalizedAlias, city);
                    }
                }
            }
        }

        // Índice de rutas
        this.routeIndex.clear();
        
        for (const route of this.routes.routes) {
            const key1 = `${route.origin}-${route.destination}`;
            const key2 = `${route.destination}-${route.origin}`; // Bidireccional
            
            this.routeIndex.set(key1, route);
            this.routeIndex.set(key2, { ...route, reversed: true });
        }
    }

    /**
     * Normaliza un nombre para comparación
     */
    normalizeName(name) {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
            .trim();
    }

    /**
     * Busca una ciudad por nombre
     */
    findCity(cityName) {
        if (!this.citiesLoaded) {
            console.warn('Ciudades aún no cargadas');
            return null;
        }

        const normalized = this.normalizeName(cityName);
        return this.cityIndex.get(normalized) || null;
    }

    /**
     * Busca una ruta entre dos ciudades
     */
    findRoute(origin, destination) {
        if (!this.routesLoaded) {
            console.warn('⚠️ Rutas aún no cargadas');
            return null;
        }

        console.log(`🔍 findRoute: Buscando ruta entre "${origin}" y "${destination}"`);

        const originCity = typeof origin === 'string' ? this.findCity(origin) : origin;
        const destinationCity = typeof destination === 'string' ? this.findCity(destination) : destination;

        console.log('📍 Ciudad origen encontrada:', originCity);
        console.log('📍 Ciudad destino encontrada:', destinationCity);

        if (!originCity || !destinationCity) {
            console.warn('⚠️ No se encontró una o ambas ciudades');
            return null;
        }

        const routeKey = `${originCity.id}-${destinationCity.id}`;
        console.log(`🔑 Clave de ruta: ${routeKey}`);
        
        const route = this.routeIndex.get(routeKey);
        console.log('🛣️  Ruta encontrada:', route);
        
        return route || null;
    }

    /**
     * Obtiene la distancia entre dos ciudades
     */
    getDistance(origin, destination) {
        const route = this.findRoute(origin, destination);
        return route ? route.distance : null;
    }

    /**
     * Obtiene información completa de una ruta
     */
    getRouteInfo(origin, destination) {
        const route = this.findRoute(origin, destination);
        
        if (!route) {
            return null;
        }

        const originCity = this.cityIndex.get(route.origin);
        const destinationCity = this.cityIndex.get(route.destination);

        return {
            distance: route.distance,
            duration: route.durationHours,
            type: route.type,
            countries: route.countries,
            origin: {
                name: originCity.name,
                state: originCity.state,
                country: this.getCountryName(route.origin)
            },
            destination: {
                name: destinationCity.name,
                state: destinationCity.state,
                country: this.getCountryName(route.destination)
            },
            reversed: route.reversed || false
        };
    }

    /**
     * Obtiene el nombre del país de una ciudad
     */
    getCountryName(cityId) {
        const countryCode = cityId.split('_')[0];
        const countryMap = {
            'ar': 'Argentina',
            'br': 'Brasil',
            'uy': 'Uruguay'
        };
        return countryMap[countryCode] || 'Desconocido';
    }

    /**
     * Obtiene sugerencias de ciudades para autocompletado
     */
    getSuggestions(query, limit = 10) {
        if (!this.citiesLoaded || !query || query.length < 2) {
            return [];
        }

        const normalized = this.normalizeName(query);
        const suggestions = [];

        for (const [countryCode, countryData] of Object.entries(this.cities.countries)) {
            for (const city of countryData.cities) {
                const cityNormalized = this.normalizeName(city.name);
                
                // Búsqueda por inicio de nombre
                if (cityNormalized.startsWith(normalized)) {
                    suggestions.push({
                        id: city.id,
                        name: city.name,
                        state: city.state,
                        country: countryData.name,
                        countryCode: countryData.code,
                        display: `${city.name}, ${city.state} (${countryData.code})`,
                        priority: 1 // Mayor prioridad para coincidencias al inicio
                    });
                }
                // Búsqueda por contenido
                else if (cityNormalized.includes(normalized)) {
                    suggestions.push({
                        id: city.id,
                        name: city.name,
                        state: city.state,
                        country: countryData.name,
                        countryCode: countryData.code,
                        display: `${city.name}, ${city.state} (${countryData.code})`,
                        priority: 2
                    });
                }
                // Búsqueda por aliases
                else if (city.aliases && city.aliases.length > 0) {
                    for (const alias of city.aliases) {
                        const aliasNormalized = this.normalizeName(alias);
                        if (aliasNormalized.includes(normalized)) {
                            suggestions.push({
                                id: city.id,
                                name: city.name,
                                state: city.state,
                                country: countryData.name,
                                countryCode: countryData.code,
                                display: `${city.name}, ${city.state} (${countryData.code})`,
                                alias: alias,
                                priority: 3
                            });
                            break;
                        }
                    }
                }
            }
        }

        // Ordenar por prioridad y limitar resultados
        return suggestions
            .sort((a, b) => a.priority - b.priority)
            .slice(0, limit);
    }

    /**
     * Obtiene todas las rutas disponibles desde una ciudad
     */
    getRoutesFromCity(cityName) {
        const city = this.findCity(cityName);
        if (!city) {
            return [];
        }

        const routes = [];
        
        for (const route of this.routes.routes) {
            if (route.origin === city.id) {
                const destinationCity = this.cityIndex.get(route.destination);
                routes.push({
                    destination: destinationCity.name,
                    distance: route.distance,
                    duration: route.durationHours,
                    type: route.type
                });
            } else if (route.destination === city.id) {
                const originCity = this.cityIndex.get(route.origin);
                routes.push({
                    destination: originCity.name,
                    distance: route.distance,
                    duration: route.durationHours,
                    type: route.type
                });
            }
        }

        return routes;
    }

    /**
     * Obtiene el número total de ciudades
     */
    getCityCount() {
        if (!this.citiesLoaded) return 0;
        
        let count = 0;
        for (const countryData of Object.values(this.cities.countries)) {
            count += countryData.cities.length;
        }
        return count;
    }

    /**
     * Obtiene el número total de rutas
     */
    getRouteCount() {
        return this.routesLoaded ? this.routes.routes.length : 0;
    }

    /**
     * Obtiene todas las ciudades de un país
     */
    getCitiesByCountry(countryCode) {
        if (!this.citiesLoaded) return [];
        
        const country = this.cities.countries[countryCode.toLowerCase()];
        return country ? country.cities : [];
    }

    /**
     * Valida si dos ciudades tienen ruta disponible
     */
    hasRoute(origin, destination) {
        return this.findRoute(origin, destination) !== null;
    }

    /**
     * Obtiene estadísticas del servicio
     */
    getStats() {
        if (!this.citiesLoaded || !this.routesLoaded) {
            return null;
        }

        return {
            totalCities: this.getCityCount(),
            totalRoutes: this.getRouteCount(),
            countries: {
                argentina: this.getCitiesByCountry('ar').length,
                brazil: this.getCitiesByCountry('br').length,
                uruguay: this.getCitiesByCountry('uy').length
            },
            lastUpdated: {
                cities: this.cities.metadata.lastUpdated,
                routes: this.routes.metadata.lastUpdated
            }
        };
    }
}

// Exportar como variable global
window.DistanceAPIService = DistanceAPIService;
