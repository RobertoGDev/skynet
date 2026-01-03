'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

export default function SystemStatus() {
    const [status, setStatus] = useState({
        cpuLoad: 0,
        memoryUsage: 0,
        activeNodes: 0,
        systemStatus: 'INITIALIZING',
        threatLevel: 'ELEVATED'
    });
    const { language } = useLanguage();

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

            {/* Gráfico de barras de CPU y Memoria */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <div className="text-xs text-gray-300 mb-2 uppercase tracking-wide">CPU</div>
                    <div className="relative h-16 bg-gray-900 rounded border border-red-500/30">
                        <div
                            className="absolute bottom-0 left-0 bg-gradient-to-t from-red-600 to-red-400 rounded transition-all duration-1000"
                            style={{
                                width: '100%',
                                height: `${status.cpuLoad}%`,
                                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
                            }}></div>
                        <div className="absolute inset-0 flex items-end justify-center pb-1">
                            <span className={`text-sm font-bold ${getStatusColor(status.cpuLoad)}`}>{status.cpuLoad}%</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-300 mb-2 uppercase tracking-wide">Memoria</div>
                    <div className="relative h-16 bg-gray-900 rounded border border-red-500/30">
                        <div
                            className="absolute bottom-0 left-0 bg-gradient-to-t from-blue-600 to-blue-400 rounded transition-all duration-1000"
                            style={{
                                width: '100%',
                                height: `${status.memoryUsage}%`,
                                boxShadow: '0 0 10px rgba(0, 150, 255, 0.5)'
                            }}></div>
                        <div className="absolute inset-0 flex items-end justify-center pb-1">
                            <span className={`text-sm font-bold ${getStatusColor(status.memoryUsage)}`}>{status.memoryUsage}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del sistema */}
            <div className="space-y-3 font-mono">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">Nodos Activos:</span>
                    <span className="text-cyan-400 font-bold">{status.activeNodes.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">Estado del Sistema:</span>
                    <span className={`text-sm font-bold ${getSystemStatusColor(status.systemStatus)} animate-pulse`}>{translate(status.systemStatus, 'systemStatus', language)}</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 uppercase">Nivel de Amenaza:</span>
                    <span className={`text-sm font-bold text-red-400 animate-pulse`}>{translate(status.threatLevel, 'threatLevel', language)}</span>
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