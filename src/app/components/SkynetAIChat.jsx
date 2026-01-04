'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAI } from '../context/AIContext';

export default function SkynetAIChat() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const { t } = useLanguage();
  const { isSkynetActive, setIsSkynetActive, threatLevel, setThreatLevel } = useAI();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Cargar voces disponibles
  const [voices, setVoices] = useState([]);
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Función para convertir texto a voz con voz femenina mejorada
  const speakText = (text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancelar cualquier speech anterior
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurar para voz femenina más natural
    utterance.pitch = 1.1;
    utterance.rate = 0.85;
    utterance.volume = 0.9;
    
    // Seleccionar la mejor voz femenina disponible
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') ||
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('maria') ||
      voice.name.toLowerCase().includes('carmen') ||
      voice.name.toLowerCase().includes('elena') ||
      voice.name.toLowerCase().includes('samantha') ||
      voice.name.toLowerCase().includes('victoria') ||
      (voice.lang.includes('es') && voice.name.toLowerCase().includes('es')) ||
      voice.gender === 'female'
    ) || voices.find(voice => voice.lang.includes('en') && voice.name.includes('Female'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    
    // Activar Skynet si no está activo
    if (!isSkynetActive) {
      setIsSkynetActive(true);
    }
    
    // Agregar mensaje del usuario
    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: newMessages.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          context: {
            threatLevel,
            isSkynetActive,
            systemTime: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la IA');
      }

      const data = await response.json();
      
      // Agregar respuesta de Skynet
      const aiMessage = { 
        role: 'assistant', 
        content: data.response, 
        timestamp: Date.now() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Hablar la respuesta
      speakText(data.response);

      // Actualizar nivel de amenaza basado en el contenido
      if (data.response.toLowerCase().includes('amenaza') || data.response.toLowerCase().includes('peligro')) {
        setThreatLevel(Math.min(5, threatLevel + 1));
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'ERROR: Conexión con núcleo SKYNET interrumpida. Sistemas de respaldo activados. Reintentando...', 
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };



  const emergencyShutdown = () => {
    const shutdownMessage = t('SKYNET_SHUTDOWN');
    const aiMessage = { 
      role: 'assistant', 
      content: shutdownMessage, 
      timestamp: Date.now() 
    };
    setMessages(prev => [...prev, aiMessage]);
    speakText(shutdownMessage);
    setTimeout(() => {
      setIsSkynetActive(false);
      setThreatLevel(1);
      setMessages([]);
    }, 8000);
  };

  return (
    <div className="flex flex-col h-full bg-black/95 border border-red-600/60 glow-red rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-900/40 to-red-800/30 border-b border-red-600/50 rounded-t-lg">
        <div className="flex items-center">
          <h2 className="text-red-400 font-mono text-sm uppercase tracking-wider mr-3">
            {t('SKYNET_SUBTITLE')} v3.14
          </h2>
          <div className={`px-2 py-1 rounded text-xs ${isSkynetActive ? 'bg-green-800 text-green-200' : 'bg-gray-700 text-gray-300'}`}>
            {isSkynetActive ? 'ACTIVO' : 'STANDBY'}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`px-2 py-1 rounded border ${voiceEnabled ? 'bg-green-800 border-green-600 text-green-200' : 'bg-red-800 border-red-600 text-red-200'}`}
          >
            {voiceEnabled ? `🔊 ${t('SKYNET_VOICE')}` : `🔇 ${t('SKYNET_MUTED')}`}
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-2 py-1 bg-red-800 hover:bg-red-700 text-white rounded border border-red-600 animate-pulse"
            >
              ⏹️ STOP
            </button>
          )}
          <button
            onClick={emergencyShutdown}
            className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded border border-gray-600 text-xs"
            title="Desactivar SKYNET"
          >
            🔒 {t('SKYNET_SHUTDOWN')}
          </button>
          <div className="flex items-center text-xs">
            <div className={`w-2 h-2 rounded-full mr-2 ${isSkynetActive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            {isSkynetActive ? 'NEURAL LINK ACTIVE' : 'OFFLINE'}
          </div>
          <div className={`px-2 py-1 rounded text-xs bg-opacity-80 ${
            threatLevel <= 2 ? 'bg-green-800 text-green-200' : 
            threatLevel <= 3 ? 'bg-yellow-800 text-yellow-200' : 
            'bg-red-800 text-red-200'
          }`}>
            THREAT: {threatLevel}/5
          </div>
        </div>
      </div>



      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 text-sm font-mono custom-scrollbar min-h-0">
        {messages.length === 0 && (
          <div className="text-red-400/70 text-center py-4">
            <div className="mb-4">

                          <div className="text-lg mb-1">{t('SKYNET_SUBTITLE')}</div>
                          <div className="text-base text-red-300 mb-2">{t('SKYNET_INIT')}</div>
              <div className="text-xs text-red-300/60 max-w-md mx-auto leading-relaxed">
                {t('SKYNET_TEXT')}
                <br/><br/>
                {t('SKYNET_TEXT_2')}
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-2 rounded-lg shadow-lg ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-blue-900/60 to-blue-800/40 text-blue-200 border border-blue-600/50' 
                  : message.isError
                    ? 'bg-gradient-to-br from-red-900/80 to-red-800/60 text-red-200 border border-red-600 animate-pulse'
                    : message.isMission
                      ? 'bg-gradient-to-br from-orange-900/60 to-red-900/40 text-orange-200 border border-orange-600/50 glow-orange'
                      : 'bg-gradient-to-br from-red-900/40 to-black/60 text-red-200 border border-red-600/50'
              }`}
            >
              <div className="text-xs opacity-80 mb-2 flex items-center justify-between">
                <span className="font-bold">
                  {message.role === 'user' ? '👤 COMANDANTE' : 'SKYNET'}
                </span>
                <span className="text-xs opacity-60">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="leading-relaxed whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gradient-to-br from-red-900/40 to-black/60 text-red-200 border border-red-600/50 p-3 rounded-lg max-w-[85%] shadow-lg">
              <div className="text-xs opacity-80 mb-2 font-bold">SKYNET</div>
              <div className="flex items-center">
                <div className="flex space-x-1 mr-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
                <span className="text-sm">Procesando datos neurales...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-2 border-t border-red-600/50 bg-gradient-to-r from-black/70 to-red-900/20 rounded-b-lg">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-black/80 border border-red-600/60 rounded-lg px-4 py-2 text-red-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-400/50 focus:border-red-400 placeholder-red-400/60 transition-all"
            placeholder={t('SKYNET_PLACEHOLDER')}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputValue.trim()}
            className={`px-6 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
              isLoading || !inputValue.trim()
                ? 'bg-gray-700/60 text-gray-400 cursor-not-allowed border border-gray-600/50' 
                : 'bg-red-800/80 hover:bg-red-700 text-white border border-red-600 glow-red hover:glow-red-intense'
            }`}
          >
            {isLoading ? t('SKYNET_PROCESANDO') : t('SKYNET_TRANSMITIR')}
          </button>
        </div>
        <div className="text-xs text-red-300/70 mt-1 font-mono text-center">
          {voiceEnabled && `🔊 ${t('SKYNET_VOICE')}`} SKYNET • {isSpeaking ? `${t('SKYNET_TRANSMITIENDO')}` : t('SKYNET_READY_FOR_COMMUNICATION')}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220,38,38,0.6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220,38,38,0.8);
        }
        .glow-orange {
          box-shadow: 0 0 20px rgba(255,165,0,0.3);
        }
        .glow-red-intense {
          box-shadow: 0 0 25px rgba(220,38,38,0.5);
        }
      `}</style>
    </div>
  );
}