'use client';
import { useState, useEffect } from 'react';
import { getRandomCoordInRadius, getCityFromCoords } from '../utils/handleCords';
import { useLanguage } from '../context/LanguageContext';

export default function TerminatorTracker({ userLocation }) {
    const [terminators, setTerminators] = useState([]);
    const { language, t } = useLanguage();

    const terminatorModels = ['T-800', 'T-1000', 'T-X', 'T-3000', 'T-Rev-9'];
    const terminatorImages = ['/terminator-t800.png', '/terminator-t1000.png', '/terminator-tx.png', '/terminator-t3000.png', '/terminator-rev9.png'];

    useEffect(() => {
        const generateTerminators = async () => {
            const newTerminators = [];
            for (let i = 0; i < 5; i++) {
                const coords = getRandomCoordInRadius(userLocation?.lat || 40.4168, userLocation?.lon || -3.7038, 150);
                const [lat, lon] = coords;
                const city = await getCityFromCoords(lat, lon);

                const isActive = Math.random() > 0.3;
                newTerminators.push({
                    id: i + 1,
                    model: terminatorModels[i],
                    position: coords,
                    location: city,
                    status: isActive ? 'ACTIVE' : 'INACTIVE',
                    image: terminatorImages[i] || '/terminator-default.png',
                    lastUpdate: new Date().toISOString(),
                    batteryLevel: Math.floor(Math.random() * 40) + 60,
                    missionStatus: isActive ? (Math.random() > 0.5 ? 'HUNTING' : 'PATROL') : 'STANDBY'
                });
            }
            setTerminators(newTerminators);
        };

        generateTerminators();

        // Actualizar cada 5 segundos
        const interval = setInterval(() => {
            setTerminators((prev) =>
                prev.map((unit) => ({
                    ...unit,
                    batteryLevel: Math.max(10, unit.batteryLevel + (Math.random() > 0.5 ? -1 : 1)),
                    lastUpdate: new Date().toISOString()
                }))
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [userLocation]);

    // Función para obtener la posición del sprite según el nivel de batería
    const getSpritePosition = (batteryLevel) => {
        // Asumiendo que hay 4 frames por fila y 4 filas (16 frames total)
        // Solo usamos los frames con brazos abajo (asumiendo que son las 4 primeras columnas)
        const frameWidth = 64; // Ancho de cada frame en pixels
        const frameHeight = 64; // Alto de cada frame en pixels

        let frameIndex;
        if (batteryLevel > 75) {
            frameIndex = 0; // Frame más saludable
        } else if (batteryLevel > 50) {
            frameIndex = 1; // Frame medio-alto
        } else if (batteryLevel > 25) {
            frameIndex = 2; // Frame medio-bajo
        } else {
            frameIndex = 3; // Frame más dañado
        }

        // Calcular posición en el sprite (fila 0, columnas 0-3)
        const x = frameIndex * frameWidth;
        const y = 0; // Primera fila para poses con brazos abajo

        return {
            backgroundImage: 'url("/images/sprite-terminators.png")',
            backgroundPosition: `-${x}px -${y}px`,
            backgroundSize: `${frameWidth * 4}px auto`, // 4 frames por fila
            width: `${frameWidth}px`,
            height: `${frameHeight}px`,
            imageRendering: 'pixelated'
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE':
                return 'text-green-400';
            case 'INACTIVE':
                return 'text-red-400';
            default:
                return 'text-yellow-400';
        }
    };

    const getMissionColor = (mission) => {
        switch (mission) {
            case 'HUNTING':
                return 'text-red-400';
            case 'PATROL':
                return 'text-blue-400';
            case 'STANDBY':
                return 'text-gray-400';
            default:
                return 'text-yellow-400';
        }
    };

    return (
        <div className="space-y-2">
            {terminators.map((unit) => (
                <div key={unit.id} className="bg-gray-800/50 border border-red-500/30 rounded p-3 relative overflow-hidden">
                    {/* Línea de escaneo */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>

                    <div className="flex items-center space-x-3">
                        {/* Sprite del Terminator */}
                        <div className="flex-shrink-0 relative">
                            <div className="w-16 h-16 bg-red-900/20 rounded border-2 border-red-500/50 overflow-hidden relative" style={getSpritePosition(unit.batteryLevel)}>
                                {/* Overlay de daño según energía */}
                                {unit.batteryLevel < 30 && <div className="absolute inset-0 bg-red-600/30 animate-pulse"></div>}
                                {unit.batteryLevel < 15 && <div className="absolute inset-0 bg-red-700/50 animate-pulse"></div>}

                                {/* Efectos de HUD */}
                                <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-red-400 opacity-80"></div>
                                <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-red-400 opacity-80"></div>
                                <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-red-400 opacity-80"></div>
                                <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-red-400 opacity-80"></div>

                                {/* ID del modelo en overlay */}
                                <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-red-400 text-xs font-mono text-center py-0.5">{unit.model}</div>
                            </div>
                        </div>

                        {/* Info del Terminator */}
                        <div className="flex-grow">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-mono text-white">
                                    <span className="text-red-400">UNIT</span> {unit.model}-{unit.id.toString().padStart(2, '0')}
                                </div>
                                <div className={`text-xs font-bold ${getStatusColor(unit.status)} animate-pulse`}>● {t(unit.status)}</div>
                            </div>

                            <div className="text-xs text-gray-400 mt-1 space-y-1">
                                <div className="flex justify-between">
                                    <span>{t('LOCATION_LABEL')}:</span>
                                    <span className="text-cyan-400">{unit.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('MISSION_LABEL')}:</span>
                                    <span className={getMissionColor(unit.missionStatus)}>{t(unit.missionStatus)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{t('ENERGY_LABEL')}:</span>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-16 h-1 bg-gray-700 rounded overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-1000 ${unit.batteryLevel > 70 ? 'bg-green-500' : unit.batteryLevel > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${unit.batteryLevel}%` }}></div>
                                        </div>
                                        <span className="text-xs text-white">{unit.batteryLevel}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
