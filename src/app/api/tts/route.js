import { NextResponse } from 'next/server';

// API route para generar TTS con Hugging Face (proxy backend)
export async function POST(request) {
  console.log('🔊 API TTS llamada recibida');
  
  try {
    const { text } = await request.json();
    
    if (!text) {
      console.error('❌ Texto no proporcionado');
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    console.log('📝 Texto a sintetizar:', text.substring(0, 50) + '...');

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      console.error('❌ Clave API de Hugging Face no encontrada en variables de entorno');
      return NextResponse.json({ error: 'Configuración del servidor incompleta' }, { status: 500 });
    }

    console.log('🔑 API Key encontrada:', apiKey.substring(0, 10) + '...');

    // Llamada a la API de Hugging Face
    console.log('📡 Haciendo petición a Hugging Face API...');
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/speecht5_tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Skynet-TTS/1.0'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          speaker_embeddings: "default"
        }
      })
    });

    console.log('📡 Respuesta de Hugging Face:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error de API Hugging Face:', response.status, errorText);
      
      if (response.status === 503) {
        return NextResponse.json({ 
          error: 'Modelo cargándose, intenta de nuevo en unos segundos',
          details: errorText,
          retry: true
        }, { status: 503 });
      }
      
      return NextResponse.json({ 
        error: `Error de API Hugging Face: ${response.status}`,
        details: errorText 
      }, { status: response.status });
    }

    // Obtener el audio como buffer
    const audioBuffer = await response.arrayBuffer();
    console.log('🎵 Audio generado, tamaño:', audioBuffer.byteLength, 'bytes');
    
    if (audioBuffer.byteLength === 0) {
      console.error('❌ Buffer de audio vacío');
      return NextResponse.json({ error: 'Buffer de audio vacío' }, { status: 500 });
    }
    
    // Convertir a base64 para enviar al cliente
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');
    console.log('✅ Audio convertido a base64, longitud:', audioBase64.length);
    
    return NextResponse.json({ 
      audio: audioBase64,
      contentType: 'audio/wav',
      size: audioBuffer.byteLength
    });

  } catch (error) {
    console.error('❌ Error en API TTS:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}

// También permitir GET para testing
export async function GET() {
  return NextResponse.json({ 
    message: 'API TTS funcionando',
    timestamp: new Date().toISOString(),
    model: 'microsoft/speecht5_tts'
  });
}