const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();
const PORT = 3200;

// Configurar CORS para permitir requests desde el frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3005'],
  credentials: true
}));

app.use(express.json());

// Endpoint de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Proxy server TTS funcionando',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para TTS
app.post('/api/tts', async (req, res) => {
  console.log('🔊 Petición TTS recibida');
  
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto requerido' });
    }

    console.log('📝 Texto a sintetizar:', text.substring(0, 50) + '...');

    // Tu clave API de Hugging Face
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    
    console.log('📡 Haciendo petición a Hugging Face...');
    
    const response = await fetch('https://router.huggingface.co/models/microsoft/speecht5_tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          speaker_embeddings: "default"
        }
      })
    });

    console.log('📡 Respuesta HuggingFace:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error HuggingFace:', response.status, errorText);
      
      if (response.status === 503) {
        return res.status(503).json({
          error: 'Modelo cargándose, intenta en unos segundos',
          retry: true
        });
      }
      
      return res.status(response.status).json({
        error: `Error API: ${response.status}`,
        details: errorText
      });
    }

    const audioBuffer = await response.arrayBuffer();
    console.log('🎵 Audio generado:', audioBuffer.byteLength, 'bytes');

    if (audioBuffer.byteLength === 0) {
      return res.status(500).json({ error: 'Audio vacío' });
    }

    // Convertir a base64
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    console.log('✅ Enviando audio al cliente');

    res.json({
      audio: audioBase64,
      contentType: 'audio/wav',
      size: audioBuffer.byteLength
    });

  } catch (error) {
    console.error('❌ Error del servidor:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor proxy TTS ejecutándose en http://localhost:${PORT}`);
  console.log(`📡 Listo para recibir peticiones de TTS`);
});