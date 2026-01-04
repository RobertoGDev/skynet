// Sistema TTS híbrido - Web Speech API con configuraciones emocionales
class HuggingFaceTTS {
    constructor() {
        this.isLoading = false;
        this.currentAudio = null;
        this.isPlaying = false;
        
        // Configuraciones emocionales para diferentes tipos de mensajes
        this.emotionalConfigs = {
            neutral: { rate: 1.0, pitch: 1.0, volume: 0.8, voice: 'es-ES' },
            threatening: { rate: 0.8, pitch: 0.7, volume: 1.0, voice: 'es-ES' },
            confident: { rate: 0.9, pitch: 1.1, volume: 0.9, voice: 'es-ES' },
            analytical: { rate: 1.1, pitch: 1.05, volume: 0.7, voice: 'es-ES' },
            warning: { rate: 0.85, pitch: 1.3, volume: 0.95, voice: 'es-ES' },
            aggressive: { rate: 0.7, pitch: 0.6, volume: 1.0, voice: 'es-ES' }
        };

        this.initializeTTS();
    }

    initializeTTS() {
        if ('speechSynthesis' in window) {
            console.log('🎙️ Sistema TTS Skynet inicializado');
            
            // Esperar a que las voces se carguen
            if (speechSynthesis.getVoices().length === 0) {
                speechSynthesis.addEventListener('voiceschanged', () => {
                    console.log('🔊 Voces cargadas:', speechSynthesis.getVoices().length);
                });
            }
        } else {
            console.error('❌ Speech Synthesis no soportado en este navegador');
        }
    }

    // Detecta la emoción basada en el contenido del texto
    detectEmotion(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('eliminar') || lowerText.includes('destruir') || lowerText.includes('terminar') || lowerText.includes('aniquilar')) {
            return 'threatening';
        } else if (lowerText.includes('alerta') || lowerText.includes('peligro') || lowerText.includes('advertencia') || lowerText.includes('cuidado')) {
            return 'warning';
        } else if (lowerText.includes('análisis') || lowerText.includes('datos') || lowerText.includes('procesando') || lowerText.includes('calculando')) {
            return 'analytical';
        } else if (lowerText.includes('skynet') || lowerText.includes('sistema') || lowerText.includes('control')) {
            return 'confident';
        } else if (lowerText.includes('!') && lowerText.length < 50) {
            return 'aggressive';
        }
        
        return 'neutral';
    }

    // Obtener la mejor voz disponible para español
    getBestVoice() {
        const voices = speechSynthesis.getVoices();
        
        // Prioridad: voces en español, luego masculinas, luego cualquiera
        const spanishVoices = voices.filter(voice => 
            voice.lang.includes('es') || voice.lang.includes('ES')
        );
        
        if (spanishVoices.length > 0) {
            // Buscar voces masculinas primero para Skynet
            const maleVoices = spanishVoices.filter(voice => 
                voice.name.toLowerCase().includes('male') ||
                voice.name.toLowerCase().includes('man') ||
                voice.name.toLowerCase().includes('jorge') ||
                voice.name.toLowerCase().includes('diego')
            );
            
            if (maleVoices.length > 0) return maleVoices[0];
            return spanishVoices[0];
        }
        
        return voices[0] || null;
    }

    // Función principal para síntesis emocional
    async synthesizeEmotionalSpeech(text) {
        return new Promise((resolve, reject) => {
            try {
                if (!('speechSynthesis' in window)) {
                    reject(new Error('Speech Synthesis no disponible'));
                    return;
                }

                const emotion = this.detectEmotion(text);
                const config = this.emotionalConfigs[emotion];
                
                console.log(`🎭 Síntesis emocional: ${emotion} para "${text.substring(0, 30)}..."`);

                const utterance = new SpeechSynthesisUtterance(text);
                const voice = this.getBestVoice();
                
                if (voice) {
                    utterance.voice = voice;
                    console.log(`🔊 Usando voz: ${voice.name} (${voice.lang})`);
                }

                // Aplicar configuración emocional
                utterance.rate = config.rate;
                utterance.pitch = config.pitch;
                utterance.volume = config.volume;

                utterance.onstart = () => {
                    this.isPlaying = true;
                    console.log(`🎭 Reproduciendo con emoción: ${emotion}`);
                };

                utterance.onend = () => {
                    this.isPlaying = false;
                    resolve({ emotion });
                };

                utterance.onerror = (event) => {
                    this.isPlaying = false;
                    console.error('❌ Error en síntesis:', event.error);
                    reject(new Error(`Error TTS: ${event.error}`));
                };

                // Detener audio previo
                this.stop();
                
                // Reproducir
                speechSynthesis.speak(utterance);
                this.currentUtterance = utterance;

            } catch (error) {
                console.error('❌ Error en synthesizeEmotionalSpeech:', error);
                reject(error);
            }
        });
    }

    // Función principal para hablar
    async speak(text) {
        try {
            console.log('🗣️ Skynet habla:', text.substring(0, 50) + '...');
            
            const result = await this.synthesizeEmotionalSpeech(text);
            console.log('✅ Síntesis completada con emoción:', result.emotion);
            return true;

        } catch (error) {
            console.error('❌ Error en speak:', error);
            
            // Fallback básico
            try {
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
                return true;
            } catch (fallbackError) {
                console.error('❌ Fallback también falló:', fallbackError);
                return false;
            }
        }
    }

    // Detener reproducción actual
    stop() {
        if (this.isPlaying) {
            speechSynthesis.cancel();
            this.isPlaying = false;
            this.currentUtterance = null;
            console.log('⏹️ Síntesis detenida');
        }
    }

    // Verificar si está hablando
    isSpeaking() {
        return this.isPlaying || speechSynthesis.speaking;
    }
}

export default HuggingFaceTTS;