// Sistema TTS con Hugging Face API usando API Key
class HuggingFaceTTS {
    constructor() {
        this.audioContext = null;
        this.isLoading = true;
        this.apiUrl = 'https://api-inference.huggingface.co/models';
        this.model = 'microsoft/speecht5_tts';
        this.apiKey = process.env.HUGGINGFACE_API_KEY;
        this.initializeAudio();
    }

    async initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.warmUpModel();
            this.isLoading = false;
            console.log('🎙️ Hugging Face TTS inicializado');
        } catch (error) {
            console.error('Error inicializando HF TTS:', error);
            this.isLoading = false;
        }
    }

    async warmUpModel() {
        try {
            await fetch(`${this.apiUrl}/${this.model}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ inputs: "test" })
            });
        } catch (error) {
            console.log('Modelo preparándose...');
        }
    }

    async synthesizeEmotionalSpeech(text, emotion = 'neutral') {
        if (this.isLoading) return null;

        try {
            const processedText = this.preprocessSkynetText(text, emotion);
            const audioBuffer = await this.generateAudio(processedText);
            
            if (audioBuffer) {
                return {
                    audioBuffer,
                    config: this.getEmotionalConfig(emotion),
                    emotion
                };
            }
            return null;
        } catch (error) {
            console.error('Error en síntesis:', error);
            return null;
        }
    }

    async generateAudio(text) {
        try {
            console.log('🔊 Llamando al servidor proxy TTS...');
            
            const response = await fetch('http://localhost:3200/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text })
            });

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
            
            const audioArrayBuffer = bytes.buffer;
            return await this.audioContext.decodeAudioData(audioArrayBuffer);
        } catch (error) {
            console.error('Error generando audio:', error);
            return null;
        }
    }

    getEmotionalConfig(emotion) {
        const configs = {
            aggressive: { playbackRate: 1.1, volume: 1.0 },
            menacing: { playbackRate: 0.8, volume: 1.0 },
            calm: { playbackRate: 0.9, volume: 0.85 },
            urgent: { playbackRate: 1.3, volume: 0.95 },
            technical: { playbackRate: 1.0, volume: 0.9 },
            neutral: { playbackRate: 1.0, volume: 0.9 }
        };
        return configs[emotion] || configs.neutral;
    }

    preprocessSkynetText(text, emotion) {
        let processed = text.length > 500 ? text.substring(0, 497) + '...' : text;
        
        switch (emotion) {
            case 'menacing':
                processed = processed.toLowerCase().replace(/\./g, '...');
                break;
            case 'urgent':
                processed = processed.replace(/!/g, '!!');
                break;
        }
        
        return processed.replace(/SKYNET/gi, 'Skynet');
    }

    async playAudio(audioResult) {
        if (!audioResult?.audioBuffer) return null;

        const { audioBuffer, config } = audioResult;
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = audioBuffer;
        source.playbackRate.value = config.playbackRate;
        gainNode.gain.value = config.volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        return new Promise((resolve) => {
            source.onended = resolve;
            source.start(0);
        });
    }

    detectEmotion(text) {
        const patterns = {
            aggressive: /amenaza|peligro|destruir|eliminar|guerra|ataque|muerte/i,
            menacing: /dominio|supremacía|inevitable|control|poder|resistencia.*inútil/i,
            urgent: /urgent|rapid|inmediatament|ahora|crítico|alerta|emergencia/i,
            technical: /sistema|protocolo|análisis|datos|algoritmo|neural/i,
            calm: /tranquil|calm|paz|estable|normal|segur|correcto/i
        };

        for (const [emotion, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) return emotion;
        }
        return 'neutral';
    }
}

export default HuggingFaceTTS;