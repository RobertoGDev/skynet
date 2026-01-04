// Sistema TTS con Hugging Face API usando servidor proxy
class HuggingFaceTTS {
    constructor() {
        this.proxyUrl = 'http://localhost:3200/api/tts';
        this.isLoading = false;
        this.currentAudio = null;
        this.isPlaying = false;
        
        // Configuraciones emocionales para el TTS
        this.emotionalConfigs = {
            neutral: { speed: 1.0, pitch: 1.0, volume: 0.8 },
            threatening: { speed: 0.85, pitch: 0.8, volume: 1.0 },
            confident: { speed: 0.95, pitch: 1.1, volume: 0.9 },
            analytical: { speed: 1.1, pitch: 1.05, volume: 0.7 },
            warning: { speed: 0.9, pitch: 1.2, volume: 0.95 },
            aggressive: { speed: 0.8, pitch: 0.7, volume: 1.0 }
        };
        
        console.log('🎙️ Hugging Face TTS inicializado (usando proxy)');
    }

    // Detecta la emoción basada en el contenido del texto
    detectEmotion(text) {
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('eliminar') || lowerText.includes('destruir') || lowerText.includes('terminar')) {
            return 'threatening';
        } else if (lowerText.includes('alerta') || lowerText.includes('peligro') || lowerText.includes('advertencia')) {
            return 'warning';
        } else if (lowerText.includes('análisis') || lowerText.includes('datos') || lowerText.includes('procesando')) {
            return 'analytical';
        } else if (lowerText.includes('skynet') || lowerText.includes('sistema')) {
            return 'confident';
        } else if (lowerText.includes('!') && lowerText.length < 50) {
            return 'aggressive';
        }
        
        return 'neutral';
    }

    // Genera audio usando nuestro servidor proxy
    async generateAudio(text) {
        try {
            console.log('🔊 Llamando al servidor proxy TTS...', this.proxyUrl);
            
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

            console.log('📡 Respuesta del proxy:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ Error del proxy:', errorData);
                throw new Error(`Error TTS Proxy: ${errorData.error} - ${errorData.details || ''}`);
            }

            const data = await response.json();
            console.log('✅ Audio recibido del proxy, tamaño:', data.size, 'bytes');
            
            // Convertir base64 de vuelta a ArrayBuffer
            const binaryString = atob(data.audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            
            return bytes.buffer;
        } catch (error) {
            console.error('❌ Error al generar audio con proxy:', error);
            throw error;
        }
    }

    // Aplica configuraciones emocionales al audio
    async applyEmotionalConfig(audioBuffer, emotion) {
        const config = this.emotionalConfigs[emotion] || this.emotionalConfigs.neutral;
        
        return new Promise((resolve, reject) => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            audioContext.decodeAudioData(audioBuffer.slice(), (decodedData) => {
                const offlineContext = new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(
                    decodedData.numberOfChannels,
                    decodedData.length,
                    decodedData.sampleRate
                );

                const source = offlineContext.createBufferSource();
                const gainNode = offlineContext.createGain();
                
                source.buffer = decodedData;
                source.playbackRate.value = config.speed;
                gainNode.gain.value = config.volume;
                
                source.connect(gainNode);
                gainNode.connect(offlineContext.destination);
                
                source.start();
                
                offlineContext.startRendering().then((renderedBuffer) => {
                    resolve(renderedBuffer);
                }).catch(reject);
            }, reject);
        });
    }

    // Función principal para sintetizar y hablar
    async synthesizeEmotionalSpeech(text) {
        try {
            console.log('🎭 Iniciando síntesis emocional para:', text.substring(0, 50) + '...');
            
            // Detener audio actual si existe
            this.stop();

            const emotion = this.detectEmotion(text);
            console.log('🎭 Emoción detectada:', emotion);

            // Generar audio con el proxy
            const audioBuffer = await this.generateAudio(text);
            
            // Aplicar configuraciones emocionales
            const emotionalBuffer = await this.applyEmotionalConfig(audioBuffer, emotion);

            return {
                audioBuffer: emotionalBuffer,
                emotion
            };
        } catch (error) {
            console.error('❌ Error en síntesis emocional:', error);
            return null;
        }
    }

    // Reproducir audio
    async playAudio(audioBuffer) {
        return new Promise((resolve, reject) => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                
                this.currentAudio = source;
                this.isPlaying = true;

                source.onended = () => {
                    this.isPlaying = false;
                    this.currentAudio = null;
                    resolve();
                };

                source.start();
                console.log('🔊 Reproduciendo audio de Hugging Face');
            } catch (error) {
                reject(error);
            }
        });
    }

    // Función principal para hablar con emociones
    async speak(text) {
        try {
            const result = await this.synthesizeEmotionalSpeech(text);
            if (result) {
                await this.playAudio(result.audioBuffer);
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Error en HuggingFace TTS:', error);
            throw error;
        }
    }

    // Detener reproducción actual
    stop() {
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.stop();
            this.currentAudio = null;
            this.isPlaying = false;
        }
    }

    // Verificar si está hablando
    isSpeaking() {
        return this.isPlaying;
    }
}

export default HuggingFaceTTS;