'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function SystemStatus() {
    const [status, setStatus] = useState({
        cpuLoad: 0,
        memoryUsage: 0,
        activeNodes: 0,
        systemStatus: 'INITIALIZING',
        threatLevel: 'ELEVATED'
    });
    const { language, t } = useLanguage();

    const getRandomThreatLevel = () => {
        const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'ELEVATED'];
        return levels[Math.floor(Math.random() * levels.length)];
    };

    useEffect(() => {
        const updateStatus = () => {
            setStatus((prevStatus) => ({
                ...prevStatus,
                cpuLoad: Math.floor(Math.random() * 30) + 70, // 70-100%
                memoryUsage: Math.floor(Math.random() * 20) + 80, // 80-100%
                activeNodes: Math.floor(Math.random() * 1000) + 9000, // 9000-10000
                threatLevel: getRandomThreatLevel()
            }));
        };

        // Actualizar estado inicial
        updateStatus();

        // Después de 3 segundos, cambiar de INITIALIZING a FULLY_OPERATIONAL
        const initTimer = setTimeout(() => {
            setStatus((prevStatus) => ({
                ...prevStatus,
                systemStatus: 'FULLY_OPERATIONAL'
            }));
        }, 3000);

        // Actualizar cada 2 segundos
        const interval = setInterval(updateStatus, 2000);

        return () => {
            clearInterval(interval);
            clearTimeout(initTimer);
        };
    }, []);

    const getStatusColor = (value) => {
        if (value >= 90) return 'text-red-400';
        if (value >= 80) return 'text-yellow-400';
        return 'text-green-400';
    };

    const getSystemStatusColor = (value) => {
        if (value === 'CRITICAL') return 'text-red-400';
        if (value === 'PARTIALLY_OPERATIONAL') return 'text-yellow-400';
        if (value === 'INITIALIZING') return 'text-blue-400';
        return 'text-green-400';
    };

    // Función para obtener el frame del terminator según el estado del sistema
    const getTerminatorFrame = () => {
        const frameWidth = 64;
        const frameHeight = 64;

        let frameIndex;
        if (status.systemStatus === 'FULLY_OPERATIONAL' && status.cpuLoad < 80) {
            frameIndex = 0; // Frame saludable
        } else if (status.systemStatus === 'INITIALIZING' || status.cpuLoad < 90) {
            frameIndex = 1; // Frame normal
        } else if (status.threatLevel === 'CRITICAL' || status.cpuLoad >= 95) {
            frameIndex = 3; // Frame dañado
        } else {
            frameIndex = 2; // Frame desgastado
        }

        const x = frameIndex * frameWidth;
        const y = 0;

        return {
            backgroundImage: 'url("/images/sprite-terminators.png")',
            backgroundPosition: `-${x}px -${y}px`,
            backgroundSize: `${frameWidth * 4}px auto`,
            width: '32px',
            height: '32px',
            imageRendering: 'pixelated'
        };
    };

    return (
        <div className="space-y-4">
            {/* Video bucle en la parte superior */}
            <div className="relative w-full bg-black rounded border border-red-500/30 overflow-hidden">
                <video className="w-full h-full object-cover opacity-80" autoPlay loop muted playsInline>
                    <source src="/videos/bucle.mp4" type="video/mp4" />
                    Tu navegador no soporta video HTML5.
                </video>
                {/* Overlay con efecto Skynet */}
                <div className="absolute inset-0 bg-red-500/10 mix-blend-multiply"></div>
                <div className="absolute inset-0 border border-red-500/50 animate-pulse"></div>
            </div>

            {/* Barras estilo Terminator - CPU y Memoria */}
            <div className="space-y-6">
                {/* Barra de CPU */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-red-400 uppercase tracking-widest font-bold font-mono">● {t('CPU_CORE')}</span>
                        <span className={`text-lg font-bold font-mono ${getStatusColor(status.cpuLoad)} text-shadow`}>{status.cpuLoad}%</span>
                    </div>

                    <div
                        className="relative h-6 bg-black border-2 border-red-600 overflow-hidden"
                        style={{
                            boxShadow: '0 0 10px #ff0000, inset 0 0 10px #330000',
                            background: 'linear-gradient(90deg, #1a0000 0%, #330000 50%, #1a0000 100%)'
                        }}>
                        {/* Patrón de fondo tipo circuito */}
                        <div className="absolute inset-0 opacity-30">
                            <div
                                className="w-full h-full bg-repeat"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, transparent 0%, #ff000020 2%, transparent 4%), linear-gradient(0deg, transparent 0%, #ff000010 50%, transparent 100%)',
                                    backgroundSize: '20px 100%, 100% 4px'
                                }}></div>
                        </div>

                        {/* Barra principal con efecto industrial */}
                        <div
                            className="h-full bg-gradient-to-r from-red-800 via-red-600 to-red-400 transition-all duration-500 relative"
                            style={{
                                width: `${status.cpuLoad}%`,
                                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
                                borderRight: status.cpuLoad < 100 ? '2px solid #ff0000' : 'none'
                            }}>
                            {/* Efecto de scan horizontal */}
                            <div
                                className="absolute top-0 left-0 w-full h-full opacity-60"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, #ff6666 2px, transparent 4px)',
                                    backgroundSize: '40px 100%',
                                    animation: 'scan 2s linear infinite'
                                }}></div>

                            {/* Líneas de ventilación */}
                            {[20, 40, 60, 80].map((pos) => (
                                <div key={pos} className="absolute top-0 h-full w-0.5 bg-black/40" style={{ left: `${pos}%` }}></div>
                            ))}
                        </div>

                        {/* Marcadores de nivel crítico */}
                        <div className="absolute top-0 h-full w-0.5 bg-red-400" style={{ left: '90%' }}></div>
                        <div className="absolute top-0 h-full w-0.5 bg-red-600" style={{ left: '95%' }}></div>
                    </div>
                </div>

                {/* Barra de Memoria */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-cyan-400 uppercase tracking-widest font-bold font-mono">● {t('MEMORY_BANK')}</span>
                        <span className={`text-lg font-bold font-mono ${getStatusColor(status.memoryUsage)} text-shadow`}>{status.memoryUsage}%</span>
                    </div>

                    <div
                        className="relative h-6 bg-black border-2 border-cyan-500 overflow-hidden"
                        style={{
                            boxShadow: '0 0 10px #00ffff, inset 0 0 10px #003333',
                            background: 'linear-gradient(90deg, #001a1a 0%, #003333 50%, #001a1a 100%)'
                        }}>
                        {/* Patrón de fondo tipo circuito */}
                        <div className="absolute inset-0 opacity-30">
                            <div
                                className="w-full h-full bg-repeat"
                                style={{
                                    backgroundImage: 'linear-gradient(90deg, transparent 0%, #00ffff20 2%, transparent 4%), linear-gradient(0deg, transparent 0%, #00ffff10 50%, transparent 100%)',
                                    backgroundSize: '20px 100%, 100% 4px'
                                }}></div>
                        </div>

                        {/* Barra principal con efecto industrial */}
                        <div
                            className="h-full bg-gradient-to-r from-cyan-800 via-cyan-600 to-cyan-400 transition-all duration-500 relative"
                            style={{
                                width: `${status.memoryUsage}%`,
                                boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -2px 4px rgba(0, 0, 0, 0.5)',
                                borderRight: status.memoryUsage < 100 ? '2px solid #00ffff' : 'none'
                            }}>
                            {/* Efecto de scan horizontal */}
                            <div
                                className="absolute top-0 left-0 w-full h-full opacity-60"
                                style={{
                                    background: 'linear-gradient(90deg, transparent 0%, #66ffff 2px, transparent 4px)',
                                    backgroundSize: '40px 100%',
                                    animation: 'scan 2s linear infinite 0.5s'
                                }}></div>

                            {/* Líneas de ventilación */}
                            {[20, 40, 60, 80].map((pos) => (
                                <div key={pos} className="absolute top-0 h-full w-0.5 bg-black/40" style={{ left: `${pos}%` }}></div>
                            ))}
                        </div>

                        {/* Marcadores de nivel crítico */}
                        <div className="absolute top-0 h-full w-0.5 bg-cyan-400" style={{ left: '90%' }}></div>
                        <div className="absolute top-0 h-full w-0.5 bg-cyan-600" style={{ left: '95%' }}></div>
                    </div>
                </div>
            </div>

            {/* Información del sistema */}
            <div className="space-y-3 font-mono">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">{t('ACTIVE_NODES_LABEL')}:</span>
                    <span className="text-cyan-400 font-bold">{status.activeNodes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">{t('SYSTEM_STATUS_LABEL')}:</span>
                    <span className={`text-sm font-bold ${getSystemStatusColor(status.systemStatus)} animate-pulse`}>{t(status.systemStatus)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">{t('THREAT_LEVEL_LABEL')}:</span>
                    <span className={`text-sm font-bold text-red-400 animate-pulse`}>{t(status.threatLevel)}</span>
                </div>
            </div>

            {/* Indicadores visuales */}
            <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                </div>

                {/* Terminator decorativo que reacciona al estado */}
                <div className="flex items-center space-x-2">
                    <div className="text-xs text-gray-400 font-mono">UNIT-01</div>
                    <div className="relative">
                        <div className="bg-red-900/20 rounded border border-red-500/50 overflow-hidden relative" style={getTerminatorFrame()}>
                            {/* Overlay de estado crítico */}
                            {(status.threatLevel === 'CRITICAL' || status.cpuLoad >= 95) && <div className="absolute inset-0 bg-red-600/40 animate-pulse"></div>}

                            {/* Efectos HUD miniaturizados */}
                            <div className="absolute top-0 left-0 w-1 h-1 border-l border-t border-red-400 opacity-80"></div>
                            <div className="absolute top-0 right-0 w-1 h-1 border-r border-t border-red-400 opacity-80"></div>
                            <div className="absolute bottom-0 left-0 w-1 h-1 border-l border-b border-red-400 opacity-80"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-r border-b border-red-400 opacity-80"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}