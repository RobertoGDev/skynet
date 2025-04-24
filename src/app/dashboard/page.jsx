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
      <div className="min-h-screen bg-black text-yellow-500 flex flex-col font-sans">
          {/* Header con información del usuario */}
          <header className="bg-gray-900 border-b border-red-700 p-4">
              <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center">
                      <div className="text-2xl font-bold text-red-400 mr-4 font-heading">{t('SKYNET')}</div>
                      <div className="text-sm hidden md:block">
                          <span className="text-gray-400">{t('TERMINAL')} </span>
                          <span className="text-yellow-400">T-800/101</span>
                      </div>
                  </div>

                  <div className="flex items-center">
                      <div className="mr-6">
                          <div className="text-sm text-gray-400">{t('USER')}</div>
                          <div className="text-white">{session.user.name}</div>
                      </div>
                      <div className="mr-6">
                          <div className="text-sm text-gray-400">{t('RANK')}</div>
                          <div className="text-yellow-400">{session.user.rank}</div>
                      </div>
                      <button onClick={handleLogout} className="bg-red-900 hover:bg-red-800 text-white py-1 px-3 rounded text-sm">
                          {t('LOGOUT')}
                      </button>
                  </div>
              </div>
          </header>

          {/* Contenido principal */}
          <main className="flex-grow container mx-auto p-4">
              {!systemsInitialized ? (
                  <div className="mb-8">
                      <div className="mb-4">
                          <TerminalOutput onInitializeSystem={initializeMainSystems} />
                      </div>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Panel Sistema de Estado */}
                      <div className="bg-gray-900 border border-red-700 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('SYSTEM_STATUS')}</h3>
                          <SystemStatus />
                      </div>

                      {/* Panel Rastreador de Terminators */}
                      <div className="bg-gray-900 border border-red-900 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('TERMINATOR_TRACKER')}</h3>
                          <TerminatorTracker />
                      </div>

                      {/* Panel Mapa de Amenazas Globales */}
                      <div className="bg-gray-900 border border-red-900 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('THREAT_MAP')}</h3>
                          <GlobalThreatMap />
                      </div>

                      {/* Panel Registro de Eventos */}
                      <div className="bg-gray-900 border border-red-900 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('EVENT_LOG')}</h3>
                          <EventLog />
                      </div>

                      {/* Panel Vigilancia */}
                      <div className="bg-gray-900 border border-red-900 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('SURVEILLANCE_SYSTEM')}</h3>
                          <SurveillanceGrid />
                      </div>

                      {/* Panel Reloj de Cuenta Regresiva */}
                      <div className="bg-gray-900 border border-red-900 rounded-md p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('JUDGMENT_DAY_COUNTDOWN')}</h3>
                          <CountdownClock />
                      </div>

                      {/* Panel Mapa de Operaciones */}
                      <div className="bg-gray-900 border border-red-900 rounded-md col-span-1 md:col-span-2 lg:col-span-3 p-3">
                          <h3 className="text-red-400 text-lg mb-2 border-b border-gray-700 pb-1">{t('OPERATIONS_MAP')}</h3>
                          <div className="h-80 overflow-hidden">
                              <Map />
                          </div>
                      </div>
                  </div>
              )}

              <div className="text-center text-xs text-gray-600 mt-4">{t('COPYRIGHT_FOOTER')}</div>
          </main>
      </div>
  );
}