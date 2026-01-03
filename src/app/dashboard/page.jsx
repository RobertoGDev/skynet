'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

// Importación de todos los componentes disponibles
import TerminalOutput from '../components/TerminalOutput';
import SystemStatus from '../components/SystemStatus';
import TerminatorTracker from '../components/TerminatorTracker';
import CountdownClock from '../components/CountdownClock';
import EventLog from '../components/EventLog';
import GlobalThreatMap from '../components/GlobalThreatMap';
import SurveillanceGrid from '../components/SurveillanceGrid';
import Map from '../components/Map';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [systemsInitialized, setSystemsInitialized] = useState(false);
  
  // Verificar si el usuario ya ha visto la terminal antes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenTerminal = localStorage.getItem('skynet-terminal-seen');
      if (hasSeenTerminal === 'true') {
        // Si ya ha visto la terminal, inicializar sistemas directamente
        setSystemsInitialized(true);
      }
    }
  }, []);
  
  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);
  
  // Manejo de cierre de sesión
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };
  
  // Función para inicializar los sistemas principales
  const initializeMainSystems = () => {
    setSystemsInitialized(true);
    // Marcar que el usuario ya ha visto la terminal
    if (typeof window !== 'undefined') {
      localStorage.setItem('skynet-terminal-seen', 'true');
    }
  };
  
  // Función para reiniciar la secuencia de terminal
  const resetTerminalSequence = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skynet-terminal-seen');
      setSystemsInitialized(false);
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-green-500 flex flex-col items-center justify-center">
        <div className="animate-pulse text-xl">{t('LOADING_TERMINAL')}</div>
      </div>
    );
  }
  
  if (!session) {
    return null; // No renderizar nada mientras se redirige
  }
  
  return (
      <div className="min-h-screen flex flex-col font-sans" style={{fontFamily: "'Modern Vision', monospace"}}>
          {/* Header estilo Skynet */}
          <header className="bg-gradient-to-r from-red-900/30 to-red-600/20 border-b-2 border-red-500 p-3" 
                  style={{background: 'linear-gradient(90deg, rgba(255,0,0,0.8), rgba(255,0,0,0.3))'}}>
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center">
                      <div className="text-xl font-bold text-red-400 mr-6 font-heading tracking-wider">
                          CYBERDYNE SYSTEMS
                      </div>
                      <div className="text-3xl font-bold text-red-500 mr-4 font-heading tracking-wider glow-red">
                          {t('SKYNET')}
                      </div>
                      <div className="text-sm hidden md:block text-red-300">
                          <span className="text-gray-300">{t('TERMINAL')} </span>
                          <span className="text-red-400">T-800/101</span>
                      </div>
                  </div>

                  <div className="flex items-center text-sm">
                      <div className="mr-4 text-center">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">User ID</div>
                          <div className="text-red-400 font-mono">{session.user.name}</div>
                      </div>
                      <div className="mr-4 text-center">
                          <div className="text-xs text-gray-400 uppercase tracking-wide">Clearance</div>
                          <div className="text-green-400 font-mono">{session.user.rank}</div>
                      </div>
                      <button 
                          onClick={resetTerminalSequence}
                          className="bg-blue-800/80 hover:bg-blue-700 text-white py-1 px-3 rounded border border-blue-600 text-xs uppercase tracking-wide mr-2 transition-all"
                          title="Reiniciar secuencia de terminal"
                      >
                          TERMINAL
                      </button>
                      <button 
                          onClick={handleLogout} 
                          className="bg-red-800/80 hover:bg-red-700 text-white py-1 px-4 rounded border border-red-600 text-xs uppercase tracking-wide glow-red transition-all"
                      >
                          {t('LOGOUT')}
                      </button>
                  </div>
              </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-grow container mx-auto p-4 relative">
              {/* Efecto de líneas de circuito de fondo */}
              <div className="fixed inset-0 opacity-20 pointer-events-none" 
                   style={{
                       backgroundImage: `
                           linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.1) 50%, transparent 100%),
                           linear-gradient(0deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)
                       `,
                       backgroundSize: '200px 200px'
                   }}>
              </div>

              {!systemsInitialized ? (
                  <div className="mb-8">
                      <div className="mb-4">
                          <TerminalOutput onInitializeSystem={initializeMainSystems} />
                      </div>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                      {/* Panel Sistema de Estado - Top Left */}
                      <div className="panel">
                          <div className="panel-header">
                              {t('SYSTEM_STATUS')}
                          </div>
                          <div className="p-4">
                              <SystemStatus />
                          </div>
                      </div>

                      {/* Panel Rastreador de Terminators - Top Center */}
                      <div className="panel glow-red">
                          <div className="panel-header">
                              {t('TERMINATOR_TRACKER')}
                          </div>
                          <div className="p-4">
                              <TerminatorTracker />
                          </div>
                      </div>

                      {/* Panel Mapa de Amenazas - Top Right */}
                      <div className="panel glow-blue">
                          <div className="panel-header">
                              {t('THREAT_MAP')}
                          </div>
                          <div className="p-4">
                              <GlobalThreatMap />
                          </div>
                      </div>

                      {/* Panel Registro de Eventos - Middle Left */}
                      <div className="panel">
                          <div className="panel-header">
                              {t('EVENT_LOG')}
                          </div>
                          <div className="p-4">
                              <EventLog />
                          </div>
                      </div>

                      {/* Panel Vigilancia - Middle Center */}
                      <div className="panel glow-green">
                          <div className="panel-header">
                              {t('SURVEILLANCE_SYSTEM')}
                          </div>
                          <div className="p-4">
                              <SurveillanceGrid />
                          </div>
                      </div>

                      {/* Panel Cuenta Regresiva - Middle Right */}
                      <div className="panel glow-red">
                          <div className="panel-header">
                              {t('JUDGMENT_DAY_COUNTDOWN')}
                          </div>
                          <div className="p-4">
                              <CountdownClock />
                          </div>
                      </div>

                      {/* Panel Mapa de Operaciones - Full Width Bottom */}
                      <div className="panel col-span-1 md:col-span-2 lg:col-span-3">
                          <div className="panel-header">
                              {t('OPERATIONS_MAP')}
                          </div>
                          <div className="p-4">
                              <div className="h-80 overflow-hidden rounded">
                                  <Map />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Footer estilo Skynet */}
              <div className="text-center text-xs text-red-500/60 mt-8 font-mono tracking-wider">
                  {t('COPYRIGHT_FOOTER')} - CLASSIFIED SYSTEM
              </div>
          </main>
      </div>
  );
}