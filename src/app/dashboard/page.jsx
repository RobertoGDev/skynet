'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';
import AudioToggleButton from '../components/AudioToggleButton';
import LanguageSelector from '../components/LanguageSelector';

// Importación de todos los componentes disponibles
import TerminalOutput from '../components/TerminalOutput';
import SystemStatus from '../components/SystemStatus';
import TerminatorTracker from '../components/TerminatorTracker';
import CountdownClock from '../components/CountdownClock';
import EventLog from '../components/EventLog';
import GlobalThreatMap from '../components/GlobalThreatMap';
import SurveillanceGrid from '../components/SurveillanceGrid';
import Map from '../components/Map';
import SkynetAIChat from '../components/SkynetAIChat';

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
        <div className="min-h-screen flex flex-col font-sans" style={{ fontFamily: "'Modern Vision', monospace" }}>
            {/* Header estilo Skynet */}
            <header className="bg-gradient-to-r from-red-900/30 to-red-600/20 border-b-2 border-red-500 p-3" style={{ background: 'linear-gradient(90deg, rgba(255,0,0,0.8), rgba(255,0,0,0.3))' }}>
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center">
                        <div className="text-xl font-bold text-red-400 mr-6 font-heading tracking-wider">CYBERDYNE SYSTEMS</div>
                        <div className="text-3xl font-bold text-red-500 mr-4 font-heading tracking-wider glow-red">{t('SKYNET')}</div>
                        <div className="text-sm hidden md:block text-red-300">
                            <span className="text-gray-300">{t('TERMINAL')} </span>
                            <span className="text-red-400">T-800/101</span>
                        </div>
                    </div>

                    <div className="flex items-center text-sm">
                        <div className="mr-4 text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{t('USER_ID')}</div>
                            <div className="text-red-400 font-mono">{session.user.name}</div>
                        </div>
                        <div className="mr-4 text-center">
                            <div className="text-xs text-gray-400 uppercase tracking-wide">{t('CLEARANCE')}</div>
                            <div className="text-green-400 font-mono">{session.user.rank}</div>
                        </div>
                        <AudioToggleButton />
                        <LanguageSelector />
                        <button
                            onClick={resetTerminalSequence}
                            className="bg-blue-800/80 hover:bg-blue-700 text-white py-1 px-3 rounded border border-blue-600 text-xs uppercase tracking-wide mr-2 transition-all"
                            title="Reiniciar secuencia de terminal">
                            TERMINAL
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-800/80 hover:bg-red-700 text-white py-1 px-4 rounded border border-red-600 text-xs uppercase tracking-wide glow-red transition-all">
                            {t('LOGOUT')}
                        </button>
                    </div>
                </div>
            </header>

            {/* Contenido principal */}
            <main className="flex-grow container mx-auto p-4 relative">
                {/* Efecto de líneas de circuito de fondo */}
                <div
                    className="fixed inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: `
                           linear-gradient(90deg, transparent 0%, rgba(255,0,0,0.1) 50%, transparent 100%),
                           linear-gradient(0deg, transparent 0%, rgba(0,255,255,0.1) 50%, transparent 100%)
                       `,
                        backgroundSize: '200px 200px'
                    }}></div>

                {!systemsInitialized ? (
                    <div className="mb-8">
                        <div className="mb-4">
                            <TerminalOutput onInitializeSystem={initializeMainSystems} />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Primera fila - Chat IA prominente */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 relative z-10" style={{ height: '60vh' }}>
                            {/* Panel Sistema de Estado - Top Left */}
                            <div className="panel flex flex-col">
                                <div className="panel-header">{t('SYSTEM_STATUS')}</div>
                                <div className="p-4 flex-1 min-h-0">
                                    <SystemStatus />
                                </div>
                            </div>

                            {/* Panel SKYNET AI Chat - Top Center & Right (2 columnas) */}
                            <div className="panel glow-red lg:col-span-2 flex flex-col">
                                <div className="panel-header">{t('SKYNET_AI_INTERFACE')}</div>
                                <div className="p-2 flex-1 min-h-0">
                                    <SkynetAIChat />
                                </div>
                            </div>
                        </div>

                        {/* Segunda fila - Paneles restantes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {/* Panel Rastreador de Terminators - Row 2 Left */}
                            <div className="panel glow-red">
                                <div className="panel-header">{t('TERMINATOR_TRACKER')}</div>
                                <div className="p-4">
                                    <TerminatorTracker />
                                </div>
                            </div>

                            {/* Panel Mapa de Amenazas - Row 2 Center */}
                            <div className="panel glow-blue">
                                <div className="panel-header">{t('THREAT_MAP')}</div>
                                <div className="p-4">
                                    <GlobalThreatMap />
                                </div>
                            </div>

                            {/* Panel Cuenta Regresiva - Row 2 Right */}
                            <div className="panel glow-red">
                                <div className="panel-header">{t('JUDGMENT_DAY_COUNTDOWN')}</div>
                                <div className="p-4">
                                    <CountdownClock />
                                </div>
                            </div>
                        </div>

                        {/* Tercera fila - Paneles anchos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 relative z-10 mb-6">
                            {/* Panel Registro de Eventos - Row 3 Left */}
                            <div className="panel">
                                <div className="panel-header">{t('EVENT_LOG')}</div>
                                <div className="p-4">
                                    <EventLog />
                                </div>
                            </div>

                            {/* Panel Vigilancia - Row 3 Right */}
                            <div className="panel glow-green">
                                <div className="panel-header">{t('SURVEILLANCE_SYSTEM')}</div>
                                <div className="p-4">
                                    <SurveillanceGrid />
                                </div>
                            </div>
                        </div>

                        {/* Cuarta fila - Mapa completo */}
                        <div className="grid grid-cols-1 gap-4 relative z-10">
                            {/* Panel Mapa de Operaciones - Full Width Bottom */}
                            <div className="panel">
                                <div className="panel-header">{t('OPERATIONS_MAP')}</div>
                                <div className="p-4">
                                    <div className="h-80 overflow-hidden rounded">
                                        <Map />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Terminator decorativo de cuerpo entero */}
                <div className="fixed bottom-0 right-0 z-30 pointer-events-none">
                    <div className="relative w-48 h-96 opacity-30 hover:opacity-50 transition-opacity duration-500">
                        {/* Sprite del Terminator completo */}
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: 'url("/images/sprite-terminators.png")',
                                backgroundPosition: '0px 0px', // Primer frame completo
                                backgroundSize: 'auto 100%',
                                backgroundRepeat: 'no-repeat',
                                imageRendering: 'pixelated',
                                filter: 'brightness(1.2) contrast(1.3) sepia(0.3) hue-rotate(340deg)'
                            }}>
                            {/* Efecto de escaneo vertical */}
                            <div
                                className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80"
                                style={{
                                    animation: 'scan-vertical 4s ease-in-out infinite',
                                    boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)'
                                }}></div>

                            {/* Efectos HUD en las esquinas */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-red-500 opacity-60"></div>
                            <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-red-500 opacity-60"></div>
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-red-500 opacity-60"></div>
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-red-500 opacity-60"></div>

                            {/* HUD Info */}
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                <div className="bg-black/80 text-red-400 text-xs font-mono px-2 py-1 rounded mx-auto inline-block">T-800 GUARDIAN</div>
                            </div>

                            {/* Punto de targeting */}
                            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="w-6 h-6 border-2 border-red-500 rounded-full opacity-60 animate-ping"></div>
                                <div className="absolute inset-0 w-6 h-6 border border-red-500 rounded-full opacity-80"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer estilo Skynet */}
                <div className="text-center text-xs text-red-500/60 mt-8 font-mono tracking-wider">{t('COPYRIGHT_FOOTER')} - CLASSIFIED SYSTEM</div>
            </main>
        </div>
    );
}