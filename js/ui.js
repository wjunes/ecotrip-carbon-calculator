// ========================================
// MÓDULO DE INTERFAZ DE USUARIO
// ========================================

/**
 * Clase para manejar todas las interacciones de la interfaz de usuario
 */
class UIManager {
    constructor() {
        this.selectedTransport = null;
        this.modal = null;
        this.initializeElements();
    }

    /**
     * Inicializa las referencias a elementos del DOM
     */
    initializeElements() {
        // Formulario
        this.originInput = document.getElementById('origin');
        this.destinationInput = document.getElementById('destination');
        this.distanceModeSelect = document.getElementById('distanceMode');
        this.distanceInput = document.getElementById('distance');
        this.distanceGroup = document.getElementById('distanceGroup');

        // Tarjetas de transporte
        this.transportCards = document.querySelectorAll('.transport-card');
        
        // Botón de cálculo
        this.calculateBtn = document.getElementById('calculateBtn');

        // Modal
        this.modal = document.getElementById('resultsModal');
        this.closeBtn = document.querySelector('.close-btn');
        
        // Elementos del modal
        this.co2Value = document.getElementById('co2Value');
        this.creditsValue = document.getElementById('creditsValue');
        this.modalDistance = document.getElementById('modalDistance');
        this.modalTransport = document.getElementById('modalTransport');
        this.treesEquivalent = document.getElementById('treesEquivalent');
        this.creditsCost = document.getElementById('creditsCost');

        // Botones del modal
        this.newCalculationBtn = document.getElementById('newCalculationBtn');
        this.shareBtn = document.getElementById('shareBtn');
    }

    /**
     * Configura todos los event listeners
     */
    setupEventListeners() {
        // Cambio de modo de distancia
        if (this.distanceModeSelect) {
            this.distanceModeSelect.addEventListener('change', (e) => {
                this.handleDistanceModeChange(e.target.value);
            });
        }

        // Selección de tarjetas de transporte
        this.transportCards.forEach(card => {
            card.addEventListener('click', () => {
                this.selectTransport(card);
            });
        });

        // Cerrar modal
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Cerrar modal al hacer click fuera
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }

        // Botón nueva consulta
        if (this.newCalculationBtn) {
            this.newCalculationBtn.addEventListener('click', () => {
                this.resetForm();
            });
        }

        // Botón compartir
        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', () => {
                this.shareResults();
            });
        }

        // Validar inputs en tiempo real
        [this.originInput, this.destinationInput, this.distanceInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.validateForm();
                });
            }
        });

        // Tecla Escape para cerrar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    /**
     * Maneja el cambio de modo de distancia
     * @param {string} mode - 'auto' o 'manual'
     */
    handleDistanceModeChange(mode) {
        if (mode === 'manual') {
            this.distanceInput.disabled = false;
            this.distanceInput.focus();
        } else {
            // Modo automático
            this.distanceInput.disabled = false; // Mantener habilitado por si no se encuentra la ruta
            this.tryAutoCalculateDistance();
        }
    }

    /**
     * Intenta calcular la distancia automáticamente
     */
    tryAutoCalculateDistance() {
        const origin = this.originInput.value.trim();
        const destination = this.destinationInput.value.trim();

        if (origin && destination) {
            const result = routesData.calculateDistance(origin, destination);
            
            if (result.distance !== null) {
                this.distanceInput.value = result.distance;
                this.showNotification(result.message, 'success');
            } else {
                this.showNotification(result.error, 'warning');
            }
        }
    }

    /**
     * Selecciona una tarjeta de transporte
     * @param {HTMLElement} card - Tarjeta seleccionada
     */
    selectTransport(card) {
        // Remover selección previa
        this.transportCards.forEach(c => c.classList.remove('selected'));
        
        // Agregar selección a la nueva tarjeta
        card.classList.add('selected');
        
        // Guardar el tipo de transporte seleccionado
        this.selectedTransport = card.dataset.transport;
        
        // Validar formulario
        this.validateForm();

        // Efecto visual
        card.style.animation = 'none';
        setTimeout(() => {
            card.style.animation = '';
        }, 10);
    }

    /**
     * Valida el formulario y habilita/deshabilita el botón de cálculo
     * @returns {boolean} - true si el formulario es válido
     */
    validateForm() {
        const origin = this.originInput.value.trim();
        const destination = this.destinationInput.value.trim();
        const distance = parseFloat(this.distanceInput.value);
        const hasTransport = this.selectedTransport !== null;

        const isValid = origin && destination && distance > 0 && hasTransport;

        if (this.calculateBtn) {
            this.calculateBtn.disabled = !isValid;
        }

        return isValid;
    }

    /**
     * Obtiene los datos del formulario
     * @returns {Object} - Datos del formulario
     */
    getFormData() {
        return {
            origin: this.originInput.value.trim(),
            destination: this.destinationInput.value.trim(),
            distance: parseFloat(this.distanceInput.value),
            distanceMode: this.distanceModeSelect.value,
            transport: this.selectedTransport
        };
    }

    /**
     * Muestra el modal con los resultados
     * @param {Object} report - Reporte completo del cálculo
     */
    showResults(report) {
        if (!this.modal) return;

        // Actualizar valores en el modal
        this.co2Value.textContent = report.emissions.formattedEmissions;
        this.creditsValue.textContent = report.carbonCredits.formattedCredits;
        this.modalDistance.textContent = `${report.trip.distance} km`;
        this.modalTransport.textContent = `${report.trip.transportIcon} ${report.trip.transportName}`;
        this.treesEquivalent.textContent = report.trees.formattedTrees;
        this.creditsCost.textContent = report.carbonCredits.formattedCost;

        // Aplicar color según nivel de impacto
        const co2Card = document.querySelector('.co2-card');
        if (co2Card && report.impact) {
            co2Card.style.borderLeftColor = report.impact.color;
        }

        // Mostrar modal
        this.openModal();

        // Guardar reporte para compartir
        this.currentReport = report;
    }

    /**
     * Abre el modal
     */
    openModal() {
        if (this.modal) {
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        }
    }

    /**
     * Cierra el modal
     */
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            document.body.style.overflow = ''; // Restaurar scroll
        }
    }

    /**
     * Resetea el formulario
     */
    resetForm() {
        // Limpiar inputs
        this.originInput.value = '';
        this.destinationInput.value = '';
        this.distanceInput.value = '';
        this.distanceModeSelect.value = 'auto';

        // Deseleccionar transporte
        this.transportCards.forEach(card => card.classList.remove('selected'));
        this.selectedTransport = null;

        // Deshabilitar botón de cálculo
        if (this.calculateBtn) {
            this.calculateBtn.disabled = true;
        }

        // Cerrar modal
        this.closeModal();

        // Focus en origen
        this.originInput.focus();
    }

    /**
     * Comparte los resultados
     */
    shareResults() {
        if (!this.currentReport) return;

        const shareText = `🌍 EcoTrip Calculator\n\n` +
            `Viaje: ${this.currentReport.trip.origin} → ${this.currentReport.trip.destination}\n` +
            `Distancia: ${this.currentReport.trip.distance} km\n` +
            `Transporte: ${this.currentReport.trip.transportName}\n\n` +
            `💨 Emisiones: ${this.currentReport.emissions.formattedEmissions}\n` +
            `🌿 Créditos de carbono: ${this.currentReport.carbonCredits.formattedCredits}\n` +
            `🌳 Árboles equivalentes: ${this.currentReport.trees.formattedTrees}\n\n` +
            `${this.currentReport.impact.icon} ${this.currentReport.impact.message}`;

        // Intentar usar la API de compartir nativa
        if (navigator.share) {
            navigator.share({
                title: 'EcoTrip Calculator',
                text: shareText
            }).catch(err => console.log('Error compartiendo:', err));
        } else {
            // Fallback: copiar al portapapeles
            this.copyToClipboard(shareText);
            this.showNotification('¡Resultados copiados al portapapeles!', 'success');
        }
    }

    /**
     * Copia texto al portapapeles
     * @param {string} text - Texto a copiar
     */
    copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    /**
     * Muestra una notificación temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     */
    showNotification(message, type = 'info') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Estilos inline
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            backgroundColor: type === 'success' ? '#10b981' : 
                           type === 'error' ? '#ef4444' :
                           type === 'warning' ? '#f59e0b' : '#3b82f6',
            color: 'white',
            fontWeight: '600',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '10000',
            animation: 'slideInRight 0.3s ease-out',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        // Remover después de 3 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    /**
     * Muestra un loading en el botón de cálculo
     * @param {boolean} show - Mostrar u ocultar loading
     */
    showLoading(show) {
        if (!this.calculateBtn) return;

        if (show) {
            this.calculateBtn.disabled = true;
            this.calculateBtn.dataset.originalText = this.calculateBtn.textContent;
            this.calculateBtn.textContent = 'Calculando...';
            this.calculateBtn.classList.add('pulse');
        } else {
            this.calculateBtn.disabled = false;
            this.calculateBtn.textContent = this.calculateBtn.dataset.originalText || 'Calcular Impacto Ambiental';
            this.calculateBtn.classList.remove('pulse');
        }
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Muestra un mensaje de éxito
     * @param {string} message - Mensaje de éxito
     */
    showSuccess(message) {
        this.showNotification(message, 'success');
    }
}

// NO crear la instancia aquí - se creará en app.js
// const uiManager = new UIManager();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
}
