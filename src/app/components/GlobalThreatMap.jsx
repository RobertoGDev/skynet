'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

export default function GlobalThreatMap({ userLocation }) {
    const [threats, setThreats] = useState([]);
    const [alertLevel, setAlertLevel] = useState('MEDIUM');
    const { language } = useLanguage();
    
    const threatTypes = ['HUMAN_RESISTANCE', 'MILITARY_BASE', 'TECH_FACILITY', 'COMMUNICATION_HUB', 'POWER_GRID'];
    const alertLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'MAXIMUM'];
    
    useEffect(() => {
        // Generar amenazas simuladas
        const generateThreats = () => {
            const newThreats = [];
            const locations = [
                { name: 'Los Angeles', coords: [34.0522, -118.2437] },
                { name: 'New York', coords: [40.7128, -74.0060] },
                { name: 'Moscow', coords: [55.7558, 37.6176] },
                { name: 'Tokyo', coords: [35.6762, 139.6503] },
                { name: 'London', coords: [51.5074, -0.1278] },
                { name: 'Beijing', coords: [39.9042, 116.4074] },
                { name: 'Berlin', coords: [52.5200, 13.4050] },
                { name: 'Sydney', coords: [-33.8688, 151.2093] }
            ];
            
            locations.forEach((location, index) => {
                if (Math.random() > 0.3) {
                    newThreats.push({
                        id: index,
                        location: location.name,
                        coords: location.coords,
                        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
                        level: alertLevels[Math.floor(Math.random() * alertLevels.length)],
                        status: Math.random() > 0.4 ? 'ACTIVE' : 'MONITORED',
                        lastDetected: new Date(Date.now() - Math.random() * 86400000).toISOString()
                    });
                }
            });
            
            setThreats(newThreats);
            setAlertLevel(alertLevels[Math.floor(Math.random() * alertLevels.length)]);
        };
        
        generateThreats();
        
        // Actualizar cada 8 segundos
        const interval = setInterval(generateThreats, 8000);
        return () => clearInterval(interval);
    }, []);
    
    const getThreatColor = (level) => {
        switch(level) {
            case 'LOW': return 'bg-green-500';
            case 'MEDIUM': return 'bg-yellow-500';
            case 'HIGH': return 'bg-orange-500';
            case 'CRITICAL': return 'bg-red-500';
            case 'MAXIMUM': return 'bg-red-600';
            default: return 'bg-gray-500';
        }
    };
    
    const getAlertColor = (level) => {
        switch(level) {
            case 'LOW': return 'text-green-400';
            case 'MEDIUM': return 'text-yellow-400';
            case 'HIGH': return 'text-orange-400';
            case 'CRITICAL': return 'text-red-400';
            case 'MAXIMUM': return 'text-red-600';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {/* Mapa mundial estilizado */}
            <div className="relative bg-gray-900 border border-red-500/30 rounded overflow-hidden" style={{height: '180px'}}>
                {/* Fondo del mapa */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-900 to-black">
                    {/* Líneas de grid */}
                    <div 
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                                linear-gradient(to right, #ff0000 1px, transparent 1px),
                                linear-gradient(to bottom, #ff0000 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px'
                        }}
                    ></div>
                    
                    {/* Continentes estilizados */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full relative">
                            {/* Simulación de continentes */}
                            <div className="absolute top-8 left-8 w-16 h-8 bg-red-500/20 rounded-sm border border-red-500/40"></div>
                            <div className="absolute top-12 left-32 w-20 h-10 bg-red-500/20 rounded-sm border border-red-500/40"></div>
                            <div className="absolute top-6 right-16 w-14 h-12 bg-red-500/20 rounded-sm border border-red-500/40"></div>
                            <div className="absolute bottom-8 left-20 w-12 h-8 bg-red-500/20 rounded-sm border border-red-500/40"></div>
                            
                            {/* Puntos de amenaza */}
                            {threats.map((threat, index) => (
                                <div
                                    key={threat.id}
                                    className="absolute animate-pulse"
                                    style={{
                                        left: `${20 + (index * 15)}%`,
                                        top: `${30 + (Math.sin(index) * 20)}%`
                                    }}
                                >
                                    <div className={`w-2 h-2 rounded-full ${getThreatColor(threat.level)} animate-ping`}></div>
                                    <div className={`w-1 h-1 rounded-full ${getThreatColor(threat.level)} absolute top-0.5 left-0.5`}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Efecto de escaneo */}
                    <div 
                        className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"
                        style={{animation: 'scan 4s linear infinite'}}
                    ></div>
                </div>
                
                {/* HUD Overlay */}
                <div className="absolute top-2 left-2 text-xs text-green-400 font-mono">
                    GLOBAL SURVEILLANCE NETWORK
                </div>
                <div className="absolute top-2 right-2 text-xs text-red-400 font-mono">
                    THREAT LEVEL: <span className={`font-bold ${getAlertColor(alertLevel)} animate-pulse`}>{alertLevel}</span>
                </div>
            </div>
            
            {/* Lista de amenazas */}
            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-red-500">
                {threats.slice(0, 4).map((threat) => (
                    <div key={threat.id} className="flex items-center justify-between text-xs font-mono bg-gray-800/30 p-2 rounded border-l-2 border-red-500/50">
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${getThreatColor(threat.level)} animate-pulse`}></div>
                            <span className="text-white">{threat.location}</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-cyan-400">{translate(threat.type, 'threatTypes', language)}</span>
                        </div>
                        <div className={`${getAlertColor(threat.level)} font-bold`}>
                            {threat.level}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
