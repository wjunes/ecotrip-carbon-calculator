// ========================================
// APLICACIÓN PRINCIPAL - EcoTrip Calculator
// ========================================

/**
 * Clase principal de la aplicación
 */
class EcoTripApp {
    constructor() {
        this.ui = null;
        this.calculator = null;
        this.routesData = null;
        this.initialized = false;
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        if (this.initialized) {
            console.warn('⚠️ La aplicación ya está inicializada');
            return;
        }

        try {
            console.log('🌍 Iniciando EcoTrip Calculator...');

            // Verificar que los módulos estén disponibles
            this.checkDependencies();

            // Inicializar módulos - CREAR las instancias aquí
            this.ui = new UIManager();
            this.calculator = new CarbonCalculator();
            this.routesData = new RoutesData();

            // Configurar event listeners
            this.setupEventListeners();

            // Marcar como inicializada
            this.initialized = true;

            console.log('✅ EcoTrip Calculator inicializado correctamente');
            
            // Mostrar mensaje de bienvenida
            this.showWelcomeMessage();

        } catch (error) {
            console.error('❌ Error inicializando la aplicación:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Verifica que todas las dependencias estén disponibles
     */
    checkDependencies() {
        const dependencies = [
            { name: 'UIManager (clase)', obj: typeof UIManager !== 'undefined' },
            { name: 'CarbonCalculator (clase)', obj: typeof CarbonCalculator !== 'undefined' },
            { name: 'RoutesData (clase)', obj: typeof RoutesData !== 'undefined' },
            { name: 'EMISSION_FACTORS', obj: typeof EMISSION_FACTORS !== 'undefined' },
            { name: 'TRANSPORT_INFO', obj: typeof TRANSPORT_INFO !== 'undefined' }
        ];

        const missing = dependencies.filter(dep => !dep.obj);

        if (missing.length > 0) {
            throw new Error(`Dependencias faltantes: ${missing.map(d => d.name).join(', ')}`);
        }
    }

    /**
     * Configura todos los event listeners de la aplicación
     */
    setupEventListeners() {
        // Event listeners del UI Manager
        this.ui.setupEventListeners();

        // Event listener para el botón de cálculo
        const calculateBtn = document.getElementById('calculateBtn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.handleCalculate();
            });
        }

        // Event listener para Enter en los inputs
        const inputs = [
            document.getElementById('origin'),
            document.getElementById('destination'),
            document.getElementById('distance')
        ];

        inputs.forEach(input => {
            if (input) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !calculateBtn.disabled) {
                        this.handleCalculate();
                    }
                });
            }
        });

        console.log('✅ Event listeners configurados');
    }

    /**
     * Maneja el cálculo de impacto ambiental
     */
    async handleCalculate() {
        try {
            console.log('🔄 Iniciando cálculo...');

            // Obtener datos del formulario
            const formData = this.ui.getFormData();
            console.log('📋 Datos del formulario:', formData);

            // Validar datos
            const validation = this.validateFormData(formData);
            if (!validation.isValid) {
                this.ui.showError(validation.error);
                return;
            }

            // Mostrar loading
            this.ui.showLoading(true);

            // Simular delay para mejor UX (opcional)
            await this.delay(500);

            // Generar reporte completo
            const report = this.calculator.generateFullReport(
                formData.distance,
                formData.transport,
                formData.origin,
                formData.destination
            );

            console.log('📊 Reporte generado:', report);

            // Ocultar loading
            this.ui.showLoading(false);

            // Mostrar resultados
            this.ui.showResults(report);

            // Guardar en historial (opcional)
            this.saveToHistory(report);

            // Mensaje de éxito
            console.log('✅ Cálculo completado exitosamente');

        } catch (error) {
            console.error('❌ Error en el cálculo:', error);
            this.ui.showLoading(false);
            this.ui.showError(error.message || APP_CONFIG.errors.calculationError);
        }
    }

    /**
     * Valida los datos del formulario
     * @param {Object} formData - Datos del formulario
     * @returns {Object} - Resultado de validación
     */
    validateFormData(formData) {
        // Validar origen
        if (!formData.origin) {
            return { 
                isValid: false, 
                error: APP_CONFIG.errors.noOrigin 
            };
        }

        // Validar destino
        if (!formData.destination) {
            return { 
                isValid: false, 
                error: APP_CONFIG.errors.noDestination 
            };
        }

        // Validar distancia
        if (!formData.distance || isNaN(formData.distance)) {
            return { 
                isValid: false, 
                error: APP_CONFIG.errors.noDistance 
            };
        }

        if (formData.distance <= 0) {
            return { 
                isValid: false, 
                error: APP_CONFIG.errors.invalidDistance 
            };
        }

        // Validar que la distancia esté en rango permitido
        if (!this.routesData.isValidDistance(formData.distance)) {
            return {
                isValid: false,
                error: `La distancia debe estar entre ${APP_CONFIG.minDistance} y ${APP_CONFIG.maxDistance} km`
            };
        }

        // Validar transporte
        if (!formData.transport) {
            return { 
                isValid: false, 
                error: APP_CONFIG.errors.noTransport 
            };
        }

        // Validar que el tipo de transporte existe
        if (!EMISSION_FACTORS[formData.transport]) {
            return {
                isValid: false,
                error: 'Tipo de transporte no válido'
            };
        }

        return { isValid: true };
    }

    /**
     * Guarda el cálculo en el historial local
     * @param {Object} report - Reporte del cálculo
     */
    saveToHistory(report) {
        try {
            // Obtener historial existente
            let history = JSON.parse(localStorage.getItem('ecotrip_history') || '[]');

            // Agregar nuevo registro
            history.unshift({
                id: Date.now(),
                date: new Date().toISOString(),
                origin: report.trip.origin,
                destination: report.trip.destination,
                distance: report.trip.distance,
                transport: report.trip.transport,
                emissions: report.emissions.totalEmissionsKg,
                credits: report.carbonCredits.credits
            });

            // Mantener solo los últimos 10 registros
            history = history.slice(0, 10);

            // Guardar en localStorage
            localStorage.setItem('ecotrip_history', JSON.stringify(history));

            console.log('💾 Cálculo guardado en historial');
        } catch (error) {
            console.warn('⚠️ No se pudo guardar en historial:', error);
        }
    }

    /**
     * Obtiene el historial de cálculos
     * @returns {Array} - Historial de cálculos
     */
    getHistory() {
        try {
            return JSON.parse(localStorage.getItem('ecotrip_history') || '[]');
        } catch (error) {
            console.warn('⚠️ Error obteniendo historial:', error);
            return [];
        }
    }

    /**
     * Limpia el historial
     */
    clearHistory() {
        try {
            localStorage.removeItem('ecotrip_history');
            console.log('🗑️ Historial limpiado');
        } catch (error) {
            console.warn('⚠️ Error limpiando historial:', error);
        }
    }

    /**
     * Muestra el mensaje de bienvenida
     */
    showWelcomeMessage() {
        console.log(`
╔═══════════════════════════════════════════╗
║     🌍 EcoTrip Calculator v1.0 🌍        ║
║                                           ║
║  Calcula tu impacto ambiental en         ║
║  cada viaje y descubre cómo reducir      ║
║  tu huella de carbono.                   ║
║                                           ║
║  ✅ Listo para usar                       ║
╚═══════════════════════════════════════════╝
        `);
    }

    /**
     * Maneja errores de inicialización
     * @param {Error} error - Error ocurrido
     */
    handleInitError(error) {
        const errorMsg = `
Error inicializando EcoTrip Calculator:
${error.message}

Por favor, verifica que todos los archivos JavaScript
estén cargados correctamente.
        `;
        
        console.error(errorMsg);
        alert('Error al cargar la aplicación. Por favor, recarga la página.');
    }

    /**
     * Utilidad: Delay/Promise
     * @param {number} ms - Milisegundos a esperar
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Obtiene estadísticas generales
     * @returns {Object} - Estadísticas
     */
    getStats() {
        const history = this.getHistory();
        
        if (history.length === 0) {
            return {
                totalTrips: 0,
                totalDistance: 0,
                totalEmissions: 0,
                totalCredits: 0,
                averageEmissions: 0
            };
        }

        const totalTrips = history.length;
        const totalDistance = history.reduce((sum, trip) => sum + trip.distance, 0);
        const totalEmissions = history.reduce((sum, trip) => sum + trip.emissions, 0);
        const totalCredits = history.reduce((sum, trip) => sum + trip.credits, 0);
        const averageEmissions = totalEmissions / totalTrips;

        return {
            totalTrips,
            totalDistance: totalDistance.toFixed(1),
            totalEmissions: totalEmissions.toFixed(2),
            totalCredits: totalCredits.toFixed(2),
            averageEmissions: averageEmissions.toFixed(2)
        };
    }

    /**
     * Exporta los datos del historial
     * @returns {string} - Datos en formato JSON
     */
    exportHistory() {
        const history = this.getHistory();
        const stats = this.getStats();
        
        const exportData = {
            exportDate: new Date().toISOString(),
            stats: stats,
            history: history
        };

        return JSON.stringify(exportData, null, 2);
    }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

// Crear instancia global de la aplicación
const ecoTripApp = new EcoTripApp();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        ecoTripApp.init();
    });
} else {
    // El DOM ya está listo
    ecoTripApp.init();
}

// Hacer la app accesible globalmente para debugging
window.ecoTripApp = ecoTripApp;

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EcoTripApp;
}
