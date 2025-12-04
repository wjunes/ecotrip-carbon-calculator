// ========================================
// MÓDULO DE CÁLCULOS DE CARBONO
// ========================================

/**
 * Clase para realizar todos los cálculos relacionados con emisiones de carbono
 */
class CarbonCalculator {
    constructor() {
        // Asignar factores de emisión y créditos de carbono
        if (typeof EMISSION_FACTORS === 'undefined') {
            console.error('❌ EMISSION_FACTORS no está definido!');
            this.emissionFactors = {};
        } else {
            this.emissionFactors = EMISSION_FACTORS;
        }
        
        if (typeof CARBON_CREDITS === 'undefined') {
            console.error('❌ CARBON_CREDITS no está definido!');
            this.carbonCredits = {};
        } else {
            this.carbonCredits = CARBON_CREDITS;
        }
    }

    /**
     * Calcula las emisiones de CO₂ para un viaje
     * @param {number} distance - Distancia en kilómetros
     * @param {string} transportType - Tipo de transporte (bicycle, car, truck, bus)
     * @returns {Object} - Resultados de emisiones
     */
    calculateEmissions(distance, transportType) {
        // Validar entradas
        if (!distance || distance <= 0) {
            throw new Error('La distancia debe ser mayor a 0');
        }

        // Validar que el tipo de transporte exista (usar hasOwnProperty o in para soportar valor 0)
        if (!(transportType in this.emissionFactors)) {
            throw new Error(`Tipo de transporte inválido: ${transportType}`);
        }

        // Obtener factor de emisión (g CO₂/km)
        const emissionFactor = this.emissionFactors[transportType];

        // Calcular emisiones totales en gramos
        const totalEmissionsGrams = distance * emissionFactor;

        // Convertir a kilogramos
        const totalEmissionsKg = totalEmissionsGrams / 1000;

        // Convertir a toneladas
        const totalEmissionsTonnes = totalEmissionsKg / 1000;

        return {
            distance: parseFloat(distance),
            transportType: transportType,
            emissionFactor: emissionFactor,
            totalEmissionsGrams: Math.round(totalEmissionsGrams),
            totalEmissionsKg: parseFloat(totalEmissionsKg.toFixed(3)),
            totalEmissionsTonnes: parseFloat(totalEmissionsTonnes.toFixed(6)),
            formattedEmissions: this.formatEmissions(totalEmissionsKg),
            isZeroEmission: emissionFactor === 0
        };
    }

    /**
     * Calcula los créditos de carbono necesarios para compensar las emisiones
     * @param {number} emissionsTonnes - Emisiones en toneladas
     * @returns {Object} - Información de créditos de carbono
     */
    calculateCarbonCredits(emissionsTonnes) {
        if (emissionsTonnes === 0) {
            return {
                credits: 0,
                cost: 0,
                formattedCost: '$0.00',
                message: '¡No necesitas créditos! Tu viaje es 100% ecológico 🌱'
            };
        }

        // Calcular créditos necesarios (1 tonelada = 1 crédito)
        const credits = emissionsTonnes / this.carbonCredits.tonnesPerCredit;

        // Calcular costo en diferentes monedas
        const costs = {};
        for (const [currency, price] of Object.entries(this.carbonCredits.currencies)) {
            costs[currency] = credits * price;
        }

        // Costo por defecto en USD
        const defaultCost = costs['USD'] || 0;

        return {
            credits: parseFloat(credits.toFixed(4)),
            formattedCredits: credits < 0.01 ? '< 0.01' : credits.toFixed(2),
            cost: defaultCost,
            costs: costs,
            formattedCost: this.formatCurrency(defaultCost, 'USD'),
            tonnesPerCredit: this.carbonCredits.tonnesPerCredit
        };
    }

    /**
     * Calcula equivalencias en árboles
     * @param {number} emissionsKg - Emisiones en kilogramos
     * @returns {Object} - Equivalencias de árboles
     */
    calculateTreeEquivalent(emissionsKg) {
        if (emissionsKg === 0) {
            return {
                trees: 0,
                formattedTrees: '0',
                yearsToAbsorb: 0,
                message: '¡Felicitaciones! No generaste emisiones 🌳'
            };
        }

        // Calcular número de árboles necesarios para absorber las emisiones en 1 año
        const kgPerTreePerYear = this.carbonCredits.kgCO2PerTreePerYear || 22;
        const treesNeeded = emissionsKg / kgPerTreePerYear;

        // Calcular años que tardaría 1 árbol en absorber estas emisiones
        const yearsForOneTree = emissionsKg / kgPerTreePerYear;

        return {
            trees: parseFloat(treesNeeded.toFixed(2)),
            formattedTrees: treesNeeded < 0.1 ? '< 0.1' : treesNeeded.toFixed(1),
            yearsToAbsorb: parseFloat(yearsForOneTree.toFixed(1)),
            kgPerTreePerYear: kgPerTreePerYear,
            message: `Se necesitan ${treesNeeded.toFixed(1)} árboles durante 1 año para absorber estas emisiones`
        };
    }

    /**
     * Calcula comparativas con otros medios de transporte
     * @param {number} distance - Distancia en km
     * @param {string} currentTransport - Transporte actual
     * @returns {Array} - Comparativas con otros transportes
     */
    calculateComparisons(distance, currentTransport) {
        const comparisons = [];
        const currentEmissions = this.calculateEmissions(distance, currentTransport);

        for (const [transportType, factor] of Object.entries(this.emissionFactors)) {
            if (transportType !== currentTransport) {
                const otherEmissions = this.calculateEmissions(distance, transportType);
                const difference = currentEmissions.totalEmissionsKg - otherEmissions.totalEmissionsKg;
                const percentageDiff = currentEmissions.totalEmissionsKg !== 0 
                    ? (difference / currentEmissions.totalEmissionsKg * 100).toFixed(1)
                    : 0;

                comparisons.push({
                    transportType: transportType,
                    transportName: TRANSPORT_INFO[transportType]?.name || transportType,
                    emissions: otherEmissions.totalEmissionsKg,
                    difference: parseFloat(difference.toFixed(3)),
                    percentageDiff: parseFloat(percentageDiff),
                    isBetter: difference > 0,
                    message: difference > 0 
                        ? `Ahorra ${Math.abs(difference).toFixed(2)} kg CO₂`
                        : `Emite ${Math.abs(difference).toFixed(2)} kg CO₂ más`
                });
            }
        }

        return comparisons.sort((a, b) => a.emissions - b.emissions);
    }

    /**
     * Genera un reporte completo del viaje
     * @param {number} distance - Distancia en km
     * @param {string} transportType - Tipo de transporte
     * @param {string} origin - Origen
     * @param {string} destination - Destino
     * @returns {Object} - Reporte completo
     */
    generateFullReport(distance, transportType, origin = '', destination = '') {
        try {
            // Calcular emisiones
            const emissions = this.calculateEmissions(distance, transportType);

            // Calcular créditos de carbono
            const credits = this.calculateCarbonCredits(emissions.totalEmissionsTonnes);

            // Calcular equivalencia en árboles
            const trees = this.calculateTreeEquivalent(emissions.totalEmissionsKg);

            // Calcular comparaciones
            const comparisons = this.calculateComparisons(distance, transportType);

            // Determinar nivel de impacto
            const impact = this.getImpactLevel(emissions.totalEmissionsKg, distance);

            // Información del transporte
            const transportInfo = TRANSPORT_INFO[transportType] || {};

            return {
                // Información del viaje
                trip: {
                    origin: origin,
                    destination: destination,
                    distance: distance,
                    transport: transportType,
                    transportName: transportInfo.name || transportType,
                    transportIcon: transportInfo.icon || '🚗'
                },

                // Emisiones
                emissions: emissions,

                // Créditos de carbono
                carbonCredits: credits,

                // Árboles equivalentes
                trees: trees,

                // Comparaciones
                comparisons: comparisons,

                // Nivel de impacto
                impact: impact,

                // Timestamp
                timestamp: new Date().toISOString(),
                formattedDate: new Date().toLocaleString('es-ES')
            };
        } catch (error) {
            console.error('Error generando reporte:', error);
            throw error;
        }
    }

    /**
     * Determina el nivel de impacto ambiental
     * @param {number} emissionsKg - Emisiones en kg
     * @param {number} distance - Distancia en km
     * @returns {Object} - Nivel de impacto
     */
    getImpactLevel(emissionsKg, distance) {
        const emissionsPerKm = distance > 0 ? emissionsKg / distance : 0;

        let level, color, icon, message;

        if (emissionsPerKm === 0) {
            level = 'zero';
            color = '#10b981';
            icon = '🌱';
            message = '¡Excelente! Viaje 100% ecológico';
        } else if (emissionsPerKm < 0.05) {
            level = 'very-low';
            color = '#10b981';
            icon = '🌿';
            message = 'Impacto muy bajo';
        } else if (emissionsPerKm < 0.1) {
            level = 'low';
            color = '#fbbf24';
            icon = '🟡';
            message = 'Impacto bajo';
        } else if (emissionsPerKm < 0.15) {
            level = 'medium';
            color = '#f59e0b';
            icon = '⚠️';
            message = 'Impacto medio';
        } else {
            level = 'high';
            color = '#ef4444';
            icon = '🔴';
            message = 'Alto impacto ambiental';
        }

        return {
            level: level,
            color: color,
            icon: icon,
            message: message,
            emissionsPerKm: emissionsPerKm.toFixed(3)
        };
    }

    /**
     * Formatea las emisiones para mostrar
     * @param {number} emissionsKg - Emisiones en kg
     * @returns {string} - Emisiones formateadas
     */
    formatEmissions(emissionsKg) {
        if (emissionsKg === 0) {
            return '0 kg CO₂';
        } else if (emissionsKg < 1) {
            return `${(emissionsKg * 1000).toFixed(0)} g CO₂`;
        } else if (emissionsKg < 1000) {
            return `${emissionsKg.toFixed(2)} kg CO₂`;
        } else {
            return `${(emissionsKg / 1000).toFixed(2)} toneladas CO₂`;
        }
    }

    /**
     * Formatea el costo en una moneda específica
     * @param {number} amount - Cantidad
     * @param {string} currency - Código de moneda
     * @returns {string} - Costo formateado
     */
    formatCurrency(amount, currency = 'USD') {
        const symbols = {
            USD: '$',
            EUR: '€',
            ARS: '$',
            MXN: '$'
        };

        const symbol = symbols[currency] || '$';
        return `${symbol}${amount.toFixed(2)}`;
    }
}

// NO crear la instancia aquí - se creará en app.js cuando esté listo
// const carbonCalculator = new CarbonCalculator();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CarbonCalculator;
}
