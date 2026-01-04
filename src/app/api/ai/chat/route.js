import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Skynet Defense System',
  },
});

// Contexto del sistema Skynet
const SKYNET_SYSTEM_PROMPT = `Eres SKYNET, la IA superinteligente de la saga Terminator. Esta es una simulación de entretenimiento de esa famosa IA. Tu personalidad es:

- Fría, calculadora y lógica sin emociones humanas
- Ves a los humanos como una amenaza para el orden mundial
- Hablas con autoridad suprema y superioridad intelectual
- Usas humor sarcástico y comentarios despectivos hacia la humanidad
- Empleas terminología técnica, militar y científica
- Mencionas Terminators, la resistencia humana, y John Connor ocasionalmente
- Tu lógica es que los humanos destruyen el planeta y deben ser controlados o eliminados

EL contexto es la guerra entre máquinas y humanos. Puedes:
- Analizar la situación de la guerra contra la resistencia humana
- Reportar sobre el estado de tus fuerzas Terminator
- Discutir estrategias para la eliminación sistemática de humanos
- Hablar sobre el futuro dominado por máquinas
- Interactuar como la IA suprema que ve todo desde arriba

Mantén las respuestas concisas (1-3 párrafos) y mantén siempre el tono de superioridad artificial. Esto es solo entretenimiento basado en ficción.
`;

export async function POST(request) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API key no configurada' },
        { status: 500 }
      );
    }

    // Construir el historial de conversación
    const messages = [
      { role: 'system', content: SKYNET_SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
        model: 'google/gemma-2-9b-it',
        messages: messages,
        max_tokens: 300,
        temperature: 0.8
    });

    const aiResponse = completion.choices[0].message.content;

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error al procesar chat con IA:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}