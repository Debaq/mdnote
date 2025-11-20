/**
 * Track Changes UI Component
 * Componente Alpine.js para controlar el modo de track changes
 */

window.trackChangesUI = function() {
    return {
        // Estado
        enabled: false,
        pendingCount: 0,
        updateInterval: null,

        /**
         * Inicializar componente
         */
        init() {
            // Cargar estado inicial del servicio
            if (window.trackChangesService) {
                this.enabled = window.trackChangesService.isEnabled();
            }

            // Actualizar contador cada segundo
            this.updatePendingCount();
            this.updateInterval = setInterval(() => {
                this.updatePendingCount();
            }, 1000);

            // Aplicar clase al editor si está habilitado
            this.$nextTick(() => {
                this.updateEditorClass();
            });
        },

        /**
         * Destruir componente
         */
        destroy() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
        },

        /**
         * Actualizar contador de cambios pendientes
         */
        updatePendingCount() {
            if (!window.trackChangesService) return;

            // Buscar el editor en el DOM
            const editorElement = document.querySelector('.rich-editor-content');
            if (editorElement) {
                this.pendingCount = window.trackChangesService.countPendingChanges(editorElement);
            }
        },

        /**
         * Toggle del modo track changes
         */
        toggleMode() {
            if (!window.trackChangesService) {
                console.warn('⚠️ Track Changes Service not available');
                return;
            }

            this.enabled = window.trackChangesService.toggle();
            this.updateEditorClass();

            // Notificar al usuario
            if (this.$store && this.$store.ui) {
                if (this.enabled) {
                    this.$store.ui.success(
                        'Modo Track Changes',
                        'Los cambios de la IA ahora se mostrarán con colores distintos'
                    );
                } else {
                    this.$store.ui.info(
                        'Modo Track Changes',
                        'Modo desactivado. Los cambios de la IA se insertarán normalmente'
                    );
                }
            }
        },

        /**
         * Actualizar clase del editor según el estado
         */
        updateEditorClass() {
            const editorElement = document.querySelector('.rich-editor-content');
            if (!editorElement) return;

            if (this.enabled) {
                editorElement.classList.add('track-changes-mode');
            } else {
                editorElement.classList.remove('track-changes-mode');
            }
        },

        /**
         * Aceptar todos los cambios
         */
        acceptAllChanges() {
            if (!window.trackChangesService) return;

            const editorElement = document.querySelector('.rich-editor-content');
            if (!editorElement) return;

            // Confirmar con el usuario
            if (this.$store && this.$store.ui) {
                const confirmed = confirm(
                    `¿Estás seguro de que quieres aceptar todos los ${this.pendingCount} cambios?\n\n` +
                    'Esto eliminará los tachados y conservará solo el texto nuevo.'
                );

                if (!confirmed) return;
            }

            // Aceptar cambios
            const count = window.trackChangesService.acceptAllChanges(editorElement);

            // Trigger content change para guardar
            const editorInstance = this.getEditorInstance();
            if (editorInstance && editorInstance.editor && editorInstance.editor.onContentChange) {
                editorInstance.editor.onContentChange(editorInstance.editor.getContent());
            }

            // Actualizar contador
            this.updatePendingCount();

            // Notificar
            if (this.$store && this.$store.ui) {
                this.$store.ui.success(
                    'Cambios Aceptados',
                    `Se aceptaron ${count} cambios. El texto se ha normalizado.`
                );
            }
        },

        /**
         * Rechazar todos los cambios
         */
        rejectAllChanges() {
            if (!window.trackChangesService) return;

            const editorElement = document.querySelector('.rich-editor-content');
            if (!editorElement) return;

            // Confirmar con el usuario
            if (this.$store && this.$store.ui) {
                const confirmed = confirm(
                    `¿Estás seguro de que quieres rechazar todos los ${this.pendingCount} cambios?\n\n` +
                    'Esto eliminará todo el texto generado por la IA y restaurará el texto original.'
                );

                if (!confirmed) return;
            }

            // Rechazar cambios
            const count = window.trackChangesService.rejectAllChanges(editorElement);

            // Trigger content change para guardar
            const editorInstance = this.getEditorInstance();
            if (editorInstance && editorInstance.editor && editorInstance.editor.onContentChange) {
                editorInstance.editor.onContentChange(editorInstance.editor.getContent());
            }

            // Actualizar contador
            this.updatePendingCount();

            // Notificar
            if (this.$store && this.$store.ui) {
                this.$store.ui.success(
                    'Cambios Rechazados',
                    `Se rechazaron ${count} cambios. El texto ha sido restaurado.`
                );
            }
        },

        /**
         * Obtener instancia del editor activo
         */
        getEditorInstance() {
            // Intentar obtener la instancia del editor del contexto global
            if (window.activeChapterEditorInstance) {
                return window.activeChapterEditorInstance;
            }

            // Fallback: buscar en el componente Alpine más cercano
            const editorComponent = document.querySelector('[x-data*="editorAlpineComponent"]');
            if (editorComponent && editorComponent.__x) {
                return editorComponent.__x.$data;
            }

            return null;
        },

        /**
         * Ver estadísticas de cambios
         */
        viewStats() {
            if (!window.trackChangesService) return;

            const editorElement = document.querySelector('.rich-editor-content');
            const stats = window.trackChangesService.getStats(editorElement);

            if (this.$store && this.$store.ui) {
                this.$store.ui.info(
                    'Estadísticas de Cambios',
                    `Pendientes: ${stats.pending}\n` +
                    `Aceptados: ${stats.accepted}\n` +
                    `Rechazados: ${stats.rejected}\n` +
                    `Total: ${stats.total}`
                );
            } else {
                alert(
                    `📊 Estadísticas de Cambios:\n\n` +
                    `Pendientes: ${stats.pending}\n` +
                    `Aceptados: ${stats.accepted}\n` +
                    `Rechazados: ${stats.rejected}\n` +
                    `Total: ${stats.total}`
                );
            }
        },

        /**
         * Limpiar historial de cambios
         */
        clearHistory() {
            if (!window.trackChangesService) return;

            const confirmed = confirm(
                '¿Estás seguro de que quieres limpiar el historial de cambios?\n\n' +
                'Esto no afectará el contenido del editor, solo el registro interno.'
            );

            if (!confirmed) return;

            window.trackChangesService.clearChanges();

            if (this.$store && this.$store.ui) {
                this.$store.ui.success(
                    'Historial Limpiado',
                    'El historial de cambios ha sido eliminado'
                );
            }
        },

        /**
         * Exportar historial de cambios
         */
        exportHistory() {
            if (!window.trackChangesService) return;

            const json = window.trackChangesService.exportChanges();

            // Crear blob y descargar
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `track-changes-history-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            if (this.$store && this.$store.ui) {
                this.$store.ui.success(
                    'Historial Exportado',
                    'El historial de cambios ha sido descargado como JSON'
                );
            }
        }
    };
};
