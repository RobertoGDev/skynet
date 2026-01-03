'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TerminalOutput({ onInitializeSystem }) {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false); // Estado para controlar la visibilidad de la capa superpuesta
  const terminalRef = useRef(null);
  const { data: session } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Simulación de estática de TV al inicio
    setOutput('<span style="opacity: 0.8; color: #ff0000; animation: static 0.1s infinite;">Inicializando interfaz de Skynet...</span>');
    
    // Simular la ejecución del script skynet_system.sh
    const fetchScriptOutput = async () => {
      try {
        setIsLoading(true);
        
        // Aquí simularemos la ejecución del script con una llamada a la API
        const response = await fetch('/api/terminal/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script: 'skynet_system.sh',
            user: session?.user?.name
          }),
        });
        
        if (!response.ok) {
          throw new Error('Error al ejecutar el script');
        }
        
        // Los datos que vendrían del script real
        const reader = response.body.getReader();
        let decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          // Filtrar los caracteres de control ANSI para limpiar pantalla
          const cleanedChunk = chunk.replace(/\u001b\[H\u001b\[2J\u001b\[3J/g, '');
          buffer += cleanedChunk;
          
          // Actualizar la salida completa
          setOutput(buffer);
          
          // Hacer scroll al final del terminal
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
          }
        }
        
      } catch (error) {
        console.error('Error:', error);
        setOutput(prev => prev + `\n<span style="color:#ff0000; text-shadow: 0 0 5px #ff0000;">ERROR: ${error.message}</span>`);
      } finally {
        setIsLoading(false);
        // Mostrar la capa superpuesta después de un breve retraso
        setTimeout(() => {
          setShowOverlay(true);
        }, 1500);
      }
    };
    
    if (session?.user) {
      fetchScriptOutput();
    }
  }, [session]);

  useEffect(() => {
    // Control del scroll cuando se muestra la capa superpuesta
    if (showOverlay && terminalRef.current) {
      // Hacer scroll hacia arriba cuando aparece la capa
      terminalRef.current.scrollTop = 0;
      
      // Bloquear el scroll aplicando un estilo al contenedor
      terminalRef.current.style.overflow = 'hidden';
    } else if (terminalRef.current) {
      // Restaurar el scroll cuando se quita la capa
      terminalRef.current.style.overflow = 'auto';
    }
  }, [showOverlay]);
  
  // Función para preservar los saltos de línea en el HTML
  const formatOutput = (text) => {
    // Reemplazar los saltos de línea con <br> para mantener el formato pero permitir que el texto fluya horizontalmente
    return { __html: text.replace(/\n/g, '<br>') };
  };
  
  return (
    <div className="w-full h-full">
      <style jsx global>{`
        @keyframes scan {
          0% { box-shadow: 0 -100vh 0 rgba(255, 0, 0, 0.2) inset; }
          50% { box-shadow: 0 100vh 0 rgba(255, 0, 0, 0.2) inset; }
          100% { box-shadow: 0 -100vh 0 rgba(255, 0, 0, 0.2) inset; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes static {
          0% { opacity: 0.8; }
          50% { opacity: 0.6; }
          100% { opacity: 0.8; }
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.8); }
          50% { box-shadow: 0 0 20px rgba(255, 0, 0, 1); }
        }
      `}</style>
      
      <div 
        className="font-mono text-[9px] md:text-sm text-red-500 bg-black p-4 h-full overflow-auto whitespace-pre-wrap relative"
        style={{ 
          minHeight: '60vh',
          maxHeight: '80vh',
          fontFamily: "'terminator real nfi', 'modern-vision', monospace",
          animation: 'scan 6s linear infinite',
          background: 'linear-gradient(to bottom, #000000, #080000)',
          borderRadius: '5px',
          boxShadow: '0 0 15px rgba(255, 0, 0, 0.5), inset 0 0 20px rgba(255, 0, 0, 0.2)',
          border: '1px solid rgba(255, 0, 0, 0.5)'
        }}
        ref={terminalRef}
      >
        {/* Efecto de líneas de escaneo */}
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(transparent 50%, rgba(255, 0, 0, 0.05) 50%)',
            backgroundSize: '100% 4px',
            zIndex: 1
          }}
        ></div>
        
        {isLoading && (
          <div className="flex items-center mb-2 z-10 relative">
            <div className="animate-pulse mr-2 text-red-600">▋</div>
            <span className="text-red-600">Inicializando sistema SKYNET...</span>
          </div>
        )}
        
        {/* Renderizar la salida completa como HTML en un solo elemento */}
        <div className="relative z-10" dangerouslySetInnerHTML={formatOutput(output)} />
        
        {!isLoading && (
          <div className="flex items-center mt-2 z-10 relative">
            <span className="text-red-600 mr-2 font-bold">{session?.user?.rank || 'usuario'}</span>
            <span className="text-red-400 mr-1">@skynet-terminal:~$</span>
            <div className="animate-pulse text-red-600">▋</div>
          </div>
        )}

        {/* Capa superpuesta con botón de acceso */}
        {showOverlay && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(2px)'
            }}
          >
            <button
              className="bg-red-800 text-white px-6 py-3 rounded-md font-bold tracking-wider uppercase"
              style={{
                fontFamily: "'terminator real nfi', 'modern-vision', monospace",
                animation: 'pulse 1.5s infinite',
                border: '1px solid rgba(255, 0, 0, 0.8)',
                boxShadow: '0 0 15px rgba(255, 0, 0, 0.8)',
                textShadow: '0 0 5px rgba(255, 0, 0, 0.8)'
              }}
              onClick={onInitializeSystem}
            >
              Acceso al Sistema
            </button>
          </div>
        )}
      </div>
    </div>
  );
}