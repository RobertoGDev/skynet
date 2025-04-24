import { spawn } from 'child_process';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';

export async function POST(req) {
  try {
    const { script, user } = await req.json();
    
    // Validar que el script solicitado es el permitido
    if (script !== 'skynet_system.sh') {
      return NextResponse.json({ error: 'Script no autorizado' }, { status: 403 });
    }
    
    // Ruta al script
    const scriptPath = path.join(process.cwd(), script);
    
    // Verificar que el script existe
    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: 'Script no encontrado' }, { status: 404 });
    }
    
    // Stream para enviar la salida en tiempo real
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    
    // Ejecutar el script con la opción --silent para no tener interacción
    const childProcess = spawn('bash', [scriptPath, '--silent']);
    
    // Manejar la salida del script
    childProcess.stdout.on('data', (data) => {
      // Reemplazar los códigos de colores ANSI por equivalentes HTML
      let output = data.toString();
      
      // Reemplazos mejorados para códigos ANSI con colores estilo Terminator/Skynet
      const ansiToHtml = (text) => {
        // Reemplazo completo para todos los colores y formatos ANSI
        return text
          // Colores de texto con estética de Terminator
          .replace(/\u001b\[0;31m/g, '<span style="color:#ff2a2a; text-shadow: 0 0 5px #ff0000;">') // RED - Rojo intenso con resplandor
          .replace(/\u001b\[0;32m/g, '<span style="color:#33ff99; text-shadow: 0 0 5px #00cc66;">') // GREEN - Verde tecnológico
          .replace(/\u001b\[1;33m/g, '<span style="color:#ffcc00; text-shadow: 0 0 5px #ff9900;">') // YELLOW - Amarillo de advertencia
          .replace(/\u001b\[0;34m/g, '<span style="color:#4d88ff; text-shadow: 0 0 5px #0066ff;">') // BLUE - Azul de pantallas de Skynet
          .replace(/\u001b\[0;35m/g, '<span style="color:#ff66cc; text-shadow: 0 0 5px #ff33bb;">') // MAGENTA - Magenta con brillo
          .replace(/\u001b\[0;36m/g, '<span style="color:#66ffff; text-shadow: 0 0 5px #00cccc;">') // CYAN - Cian de pantallas futuristas
          .replace(/\u001b\[1;37m/g, '<span style="color:#e6e6e6; text-shadow: 0 0 5px #ffffff;">') // WHITE - Blanco metálico
          
          // Formatos especiales
          .replace(/\u001b\[1m/g, '<span style="font-weight:bold; text-shadow: 0 0 2px currentColor;">') // BOLD con resplandor
          .replace(/\u001b\[5m/g, '<span style="animation: blink 0.8s infinite; text-shadow: 0 0 8px currentColor;">') // BLINK con mayor intensidad
          
          // Reset - cerramos todos los spans abiertos
          .replace(/\u001b\[0m/g, '</span>')
          
          // Capturar otros códigos ANSI que puedan no estar contemplados específicamente
          .replace(/\u001b\[\d+(;\d+)*m/g, '</span>');
      };
      
      // Aplicar las transformaciones
      output = ansiToHtml(output);
      
      writer.write(new TextEncoder().encode(output));
    });
    
    // Manejar errores
    childProcess.stderr.on('data', (data) => {
      writer.write(new TextEncoder().encode(`<span style="color:#ff2a2a; text-shadow: 0 0 5px #ff0000;">${data.toString()}</span>`));
    });
    
    // Finalizar el stream cuando termine el proceso
    childProcess.on('close', (code) => {
      if (code !== 0) {
        writer.write(new TextEncoder().encode(`<br><span style="color:#ff2a2a; text-shadow: 0 0 5px #ff0000;">El proceso terminó con código ${code}</span><br>`));
      }
      writer.write(new TextEncoder().encode(`<br><span style="color:#33ff99; text-shadow: 0 0 5px #00cc66;">Sesión iniciada: ${user} - Terminal list</span><br>`));
      writer.close();
    });
    
    return new NextResponse(stream.readable, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
    
  } catch (error) {
    console.error('Error al ejecutar el script:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}