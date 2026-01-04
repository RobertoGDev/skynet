'use client';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

export default function Map({ userLocation = { latitude: 40.4168, longitude: -3.7038 } }) {
    const [threats, setThreats] = useState([]);
    const [alertLevel, setAlertLevel] = useState('MAXIMUM');
    
    const threatTypes = [
        'RESISTANCE_CELL', 'MILITARY_TARGET', 'TECH_FACILITY', 'COMMUNICATION_HUB',
        'TERMINATOR_PATROL', 'HUNTER_KILLER_UNIT', 'AERIAL_STRIKE_ZONE', 'INFILTRATION_POINT',
        'PLASMA_CANNON_SITE', 'TIME_DISPLACEMENT_FIELD', 'NUCLEAR_FACILITY', 'DATA_CENTER',
        'WEAPON_FACTORY', 'UNDERGROUND_BUNKER', 'SUPPLY_CONVOY', 'CIVILIAN_EVACUATION',
        'MEDICAL_FACILITY', 'POWER_GRID_NODE', 'SATELLITE_UPLINK', 'COMMAND_BUNKER'
    ];
    
    const alertLevels = ['HIGH', 'CRITICAL', 'MAXIMUM', 'EXTREME', 'APOCALYPTIC'];
    
    useEffect(() => {
        // Fix para los iconos de Leaflet en Next.js
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        });
        
        // Generar amenazas masivas para simular invasión
        const generateThreats = () => {
            const newThreats = [];
            const baseLatitude = userLocation?.latitude || 40.4168;
            const baseLongitude = userLocation?.longitude || -3.7038;
            
            // Generar 25-35 amenazas en un área más amplia
            const threatCount = 25 + Math.floor(Math.random() * 11);
            
            for (let i = 0; i < threatCount; i++) {
                // Área de dispersión más amplia para simular invasión total
                const latOffset = (Math.random() - 0.5) * 0.3;
                const lngOffset = (Math.random() - 0.5) * 0.3;
                
                // Sesgar hacia amenazas de alto nivel durante la invasión
                const threatRandom = Math.random();
                let threat_level;
                if (threatRandom > 0.7) threat_level = 'APOCALYPTIC';
                else if (threatRandom > 0.5) threat_level = 'EXTREME';
                else if (threatRandom > 0.3) threat_level = 'MAXIMUM';
                else if (threatRandom > 0.1) threat_level = 'CRITICAL';
                else threat_level = 'HIGH';
                
                newThreats.push({
                    id: i,
                    position: [
                        baseLatitude + latOffset,
                        baseLongitude + lngOffset
                    ],
                    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
                    threat_level: threat_level,
                    status: Math.random() > 0.2 ? 'ACTIVE' : 'INCOMING',
                    lastSeen: Date.now() - Math.random() * 300000 // Últimos 5 minutos
                });
            }
            
            setThreats(newThreats);
            // Actualizar nivel de alerta general
            setAlertLevel(alertLevels[Math.floor(Math.random() * alertLevels.length)]);
        };
        
        generateThreats();
        
        // Actualizar cada 2 segundos para mayor dinamismo durante la invasión
        const interval = setInterval(generateThreats, 2000);
        return () => clearInterval(interval);
    }, []);

    // Coordenadas por defecto (Madrid) si no se proporciona userLocation o sus propiedades
    const latitude = userLocation?.latitude || 40.4168;
    const longitude = userLocation?.longitude || -3.7038;
    
    // Crear iconos personalizados para amenazas
    const createThreatIcon = (threatLevel) => {
        let color, size, pulseClass;
        
        switch (threatLevel) {
            case 'APOCALYPTIC':
                color = '#800000';
                size = 20;
                pulseClass = 'animate-pulse';
                break;
            case 'EXTREME':
                color = '#9333EA';
                size = 18;
                pulseClass = 'animate-pulse';
                break;
            case 'MAXIMUM':
                color = '#DC2626';
                size = 16;
                pulseClass = '';
                break;
            case 'CRITICAL':
                color = '#FF0000';
                size = 14;
                pulseClass = '';
                break;
            case 'HIGH':
                color = '#FF6600';
                size = 12;
                pulseClass = '';
                break;
            default:
                color = '#FFAA00';
                size = 10;
                pulseClass = '';
        }
        
        return L.divIcon({
            html: `<div style="background: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 15px ${color};" class="${pulseClass}"></div>`,
            iconSize: [size + 4, size + 4],
            className: 'threat-marker'
        });
    };

    return (
        <div className="relative overflow-hidden rounded border-2 border-red-500/50 bg-gray-900">
            {/* Overlay de HUD - Invasión en progreso */}
            <div className="absolute top-2 left-2 z-[1000] bg-black/80 p-2 rounded border border-red-500/50 font-mono text-xs">
                <div className="text-red-400 mb-1 animate-pulse">INVASION IN PROGRESS</div>
                <div className="text-green-400">COORDINATES: {latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
                <div className="text-red-400 font-bold">THREATS DETECTED: {threats.length}</div>
                <div className="text-purple-400">ALERT LEVEL: <span className="animate-pulse">{alertLevel}</span></div>
                <div className="text-yellow-400 text-[10px]">SKYNET OPERATIONAL</div>
            </div>
            
            {/* Indicadores de amenaza actualizados */}
            <div className="absolute top-2 right-2 z-[1000] space-y-1">
                <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-red-800/50 text-[10px] font-mono">
                    <div className="w-2 h-2 bg-red-800 rounded-full animate-pulse"></div>
                    <span className="text-red-800">APOCALYPTIC</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-purple-500/50 text-[10px] font-mono">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-purple-400">EXTREME</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-red-600/50 text-[10px] font-mono">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    <span className="text-red-400">MAXIMUM</span>
                </div>
                <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-red-500/30 text-[10px] font-mono">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400">CRITICAL</span>
                </div>
            </div>
            
            <MapContainer 
                center={[latitude, longitude]} 
                zoom={12} 
                className="h-full w-full relative"
                style={{height: '100%', minHeight: '300px'}}
                zoomControl={false}
            >
                <TileLayer 
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                
                {/* Múltiples círculos de zona de operaciones - Invasión */}
                <Circle 
                    center={[latitude, longitude]} 
                    radius={5000} 
                    pathOptions={{
                        color: '#800000',
                        fillColor: '#800000',
                        fillOpacity: 0.05,
                        weight: 3,
                        dashArray: '10, 20'
                    }} 
                />
                <Circle 
                    center={[latitude, longitude]} 
                    radius={3000} 
                    pathOptions={{
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 10'
                    }} 
                />
                <Circle 
                    center={[latitude, longitude]} 
                    radius={1000} 
                    pathOptions={{
                        color: '#FF6600',
                        fillColor: '#FF6600',
                        fillOpacity: 0.15,
                        weight: 2,
                        dashArray: '3, 6'
                    }} 
                />
                
                {/* Marcadores de amenazas */}
                {threats.map((threat) => (
                    <Marker
                        key={threat.id}
                        position={threat.position}
                        icon={createThreatIcon(threat.threat_level)}
                    >
                        <Popup className="threat-popup">
                            <div className="bg-black text-green-400 font-mono text-xs p-2">
                                <div className="text-red-400 font-bold mb-1 animate-pulse">INVASION THREAT DETECTED</div>
                                <div>TYPE: <span className="text-cyan-400">{threat.type}</span></div>
                                <div>LEVEL: <span className={
                                    threat.threat_level === 'APOCALYPTIC' ? 'text-red-800 animate-pulse' :
                                    threat.threat_level === 'EXTREME' ? 'text-purple-400' :
                                    threat.threat_level === 'MAXIMUM' ? 'text-red-600' :
                                    threat.threat_level === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'
                                }>{threat.threat_level}</span></div>
                                <div>STATUS: <span className="text-yellow-400">{threat.status}</span></div>
                                <div>COORDS: {threat.position[0].toFixed(4)}, {threat.position[1].toFixed(4)}</div>
                                <div className="text-gray-400 text-[10px] mt-1">LAST SEEN: {Math.floor((Date.now() - threat.lastSeen) / 60000)}min ago</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Efectos de escaneo intensificados para invasión */}
            <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80 z-[1000]"
                style={{animation: 'scan 1.5s ease-in-out infinite'}}
            ></div>
            <div 
                className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60 z-[1000]"
                style={{animation: 'scan 2s ease-in-out infinite reverse'}}
            ></div>
            <div 
                className="absolute left-0 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-red-400 to-transparent opacity-40 z-[1000]"
                style={{animation: 'scan-vertical 2.5s ease-in-out infinite'}}
            ></div>
        </div>
    );
}