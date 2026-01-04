'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';
import L from 'leaflet';

// Importar el mapa dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
    ssr: false
});
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), {
    ssr: false
});
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), {
    ssr: false
});
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), {
    ssr: false
});

function GlobalThreatMap({ userLocation }) {
    const [threats, setThreats] = useState([]);
    const [alertLevel, setAlertLevel] = useState('MEDIUM');
    const [isMapReady, setIsMapReady] = useState(false);
    const { language } = useLanguage();

    const threatTypes = ['HUMAN_RESISTANCE', 'MILITARY_BASE', 'TECH_FACILITY', 'COMMUNICATION_HUB', 'POWER_GRID'];
    const alertLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'MAXIMUM'];

    useEffect(() => {
        // Importar CSS de Leaflet dinámicamente
        import('leaflet/dist/leaflet.css');

        // Fix para los iconos de Leaflet en Next.js
        if (typeof window !== 'undefined') {
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
            });
        }

        setIsMapReady(true);
    }, []);

    useEffect(() => {
        // Generar amenazas simuladas
        const generateThreats = () => {
            const newThreats = [];
            const locations = [
                { name: 'Los Angeles', coords: [34.0522, -118.2437] },
                { name: 'New York', coords: [40.7128, -74.006] },
                { name: 'Moscow', coords: [55.7558, 37.6176] },
                { name: 'Tokyo', coords: [35.6762, 139.6503] },
                { name: 'London', coords: [51.5074, -0.1278] },
                { name: 'Beijing', coords: [39.9042, 116.4074] },
                { name: 'Berlin', coords: [52.52, 13.405] },
                { name: 'Sydney', coords: [-33.8688, 151.2093] },
                { name: 'Cairo', coords: [30.0444, 31.2357] },
                { name: 'Mumbai', coords: [19.076, 72.8777] },
                { name: 'São Paulo', coords: [-23.5558, -46.6396] },
                { name: 'Mexico City', coords: [19.4326, -99.1332] }
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
        switch (level) {
            case 'LOW':
                return 'bg-green-500';
            case 'MEDIUM':
                return 'bg-yellow-500';
            case 'HIGH':
                return 'bg-orange-500';
            case 'CRITICAL':
                return 'bg-red-500';
            case 'MAXIMUM':
                return 'bg-red-600';
            default:
                return 'bg-gray-500';
        }
    };

    const getAlertColor = (level) => {
        switch (level) {
            case 'LOW':
                return 'text-green-400';
            case 'MEDIUM':
                return 'text-yellow-400';
            case 'HIGH':
                return 'text-orange-400';
            case 'CRITICAL':
                return 'text-red-400';
            case 'MAXIMUM':
                return 'text-red-600';
            default:
                return 'text-gray-400';
        }
    };

    // Crear iconos personalizados para amenazas
    const createThreatIcon = (threatLevel) => {
        if (typeof window === 'undefined' || !L) return null;

        const color = threatLevel === 'CRITICAL' || threatLevel === 'MAXIMUM' ? '#ff0000' : threatLevel === 'HIGH' ? '#ff6600' : threatLevel === 'MEDIUM' ? '#ffaa00' : '#00ff00';

        return new L.DivIcon({
            html: `<div style="background: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px ${color};"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
            popupAnchor: [0, -8],
            className: 'custom-threat-marker'
        });
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Mapa mundial real */}
            <div className="flex-shrink-0 relative overflow-hidden rounded border-2 border-red-500/50 bg-gray-900" style={{ height: '180px' }}>
                {isMapReady ? (
                    <MapContainer center={[20, 0]} zoom={1} className="h-full w-full relative" style={{ height: '100%', minHeight: '180px' }} zoomControl={false} attributionControl={false}>
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />
                        {threats.map((threat) => {
                            const icon = createThreatIcon(threat.level);
                            return (
                                <Marker key={threat.id} position={threat.coords} icon={icon || undefined}>
                                    <Popup className="threat-popup">
                                        <div className="bg-black text-green-400 font-mono text-xs p-2">
                                            <div className="text-red-400 font-bold mb-1">THREAT DETECTED</div>
                                            <div>LOCATION: {threat.location}</div>
                                            <div>TYPE: {translate(threat.type, 'threatTypes', language)}</div>
                                            <div>
                                                LEVEL: <span className={getAlertColor(threat.level).replace('text-', 'text-')}>{threat.level}</span>
                                            </div>
                                            <div>STATUS: {threat.status}</div>
                                            <div>
                                                COORDS: {threat.coords[0].toFixed(4)}, {threat.coords[1].toFixed(4)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center border border-red-500/30">
                        <div className="text-cyan-400 font-mono text-sm animate-pulse">CARGANDO MAPA GLOBAL...</div>
                    </div>
                )}

                {/* Overlay de HUD */}
                <div className="absolute top-2 left-2 z-[1000] bg-black/80 p-2 rounded border border-red-500/50 font-mono text-xs">
                    <div className="text-red-400 mb-1">GLOBAL SURVEILLANCE NETWORK</div>
                    <div className="text-green-400">THREATS DETECTED: {threats.length}</div>
                    <div className="text-yellow-400">
                        ALERT LEVEL: <span className={`font-bold ${getAlertColor(alertLevel)} animate-pulse`}>{alertLevel}</span>
                    </div>
                </div>

                {/* Indicadores de amenaza */}
                <div className="absolute top-2 right-2 z-[1000] space-y-1">
                    <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-red-500/30 text-xs font-mono">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-red-400">CRITICAL</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-orange-500/30 text-xs font-mono">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-orange-400">HIGH</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-yellow-500/30 text-xs font-mono">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-yellow-400">MEDIUM</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-green-500/30 text-xs font-mono">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400">LOW</span>
                    </div>
                </div>

                {/* Efecto de escaneo */}
                <div
                    className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 z-[1000]"
                    style={{ animation: 'scan 3s ease-in-out infinite' }}></div>
            </div>

            {/* Panel inferior dividido: 1/3 Terminator + 2/3 Lista de amenazas */}
            <div className="flex-shrink-0 h-full flex gap-4">
                {/* Columna del Terminator (1/3) */}
                <div className="relative w-1/3 aspect-[9/27] overflow-hidden bg-gray-800/20 rounded border border-red-500/30 p-2 min-h-full max-h-[363px] h-full">
                    {/* Terminator 1 */}
                    <img
                        src="/images/sprite-terminators.png"
                        alt="Terminator"
                        className="relative max-w-none h-auto"
                        style={{
                            left: '-46%',
                            top: '-6%',
                            width: '1270%',
                            filter: 'brightness(1.2) contrast(1.3) sepia(0.3) hue-rotate(340deg)'
                        }}
                    />
                </div>

                {/* Lista de amenazas (2/3) - Ocupa todo el alto */}
                <div className="w-2/3 h-full overflow-y-auto scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-red-500 space-y-1 pr-1">
                    {threats.map((threat) => (
                        <div
                            key={threat.id}
                            className="flex items-center justify-between text-xs font-mono bg-gray-800/30 p-2 rounded border-l-2 border-red-500/50 hover:bg-gray-700/30 transition-colors">
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getThreatColor(threat.level)} animate-pulse`}></div>
                                <span className="text-white">{threat.location}</span>
                                <span className="text-gray-400">|</span>
                                <span className="text-cyan-400">{translate(threat.type, 'threatTypes', language)}</span>
                            </div>
                            <div className={`${getAlertColor(threat.level)} font-bold`}>{threat.level}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default GlobalThreatMap;
