'use client';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

export default function Map({ userLocation = { latitude: 40.4168, longitude: -3.7038 } }) {
    const [threats, setThreats] = useState([]);
    
    useEffect(() => {
        // Fix para los iconos de Leaflet en Next.js
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
        });
        
        // Generar amenazas aleatorias una sola vez
        const generateThreats = () => {
            const newThreats = [];
            const baseLatitude = userLocation?.latitude || 40.4168;
            const baseLongitude = userLocation?.longitude || -3.7038;
            
            for (let i = 0; i < 5; i++) {
                newThreats.push({
                    id: i,
                    position: [
                        baseLatitude + (Math.random() - 0.5) * 0.1,
                        baseLongitude + (Math.random() - 0.5) * 0.1
                    ],
                    type: ['RESISTANCE_CELL', 'MILITARY_TARGET', 'TECH_FACILITY'][Math.floor(Math.random() * 3)],
                    threat_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
                });
            }
            setThreats(newThreats);
        };
        
        generateThreats();
    }, []);

    // Coordenadas por defecto (Madrid) si no se proporciona userLocation o sus propiedades
    const latitude = userLocation?.latitude || 40.4168;
    const longitude = userLocation?.longitude || -3.7038;
    
    // Crear iconos personalizados para amenazas
    const createThreatIcon = (threatLevel) => {
        const color = threatLevel === 'HIGH' ? '#ff0000' : threatLevel === 'MEDIUM' ? '#ffaa00' : '#00ff00';
        return L.divIcon({
            html: `<div style="background: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 10px ${color};"></div>`,
            iconSize: [16, 16],
            className: 'threat-marker'
        });
    };

    return (
        <div className="relative overflow-hidden rounded border-2 border-red-500/50 bg-gray-900">
            {/* Overlay de HUD */}
            <div className="absolute top-2 left-2 z-[1000] bg-black/80 p-2 rounded border border-red-500/50 font-mono text-xs">
                <div className="text-red-400 mb-1">TACTICAL OPERATIONS MAP</div>
                <div className="text-green-400">COORDINATES: {latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
                <div className="text-yellow-400">THREATS DETECTED: {threats.length}</div>
            </div>
            
            {/* Indicadores de amenaza */}
            <div className="absolute top-2 right-2 z-[1000] space-y-1">
                <div className="flex items-center space-x-2 bg-black/80 p-1 rounded border border-red-500/30 text-xs font-mono">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-400">HIGH</span>
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
                
                {/* Círculo de zona de operaciones */}
                <Circle 
                    center={[latitude, longitude]} 
                    radius={2000} 
                    pathOptions={{
                        color: 'red',
                        fillColor: 'red',
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: '5, 10'
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
                                <div className="text-red-400 font-bold mb-1">THREAT DETECTED</div>
                                <div>TYPE: {threat.type}</div>
                                <div>LEVEL: <span className={threat.threat_level === 'HIGH' ? 'text-red-400' : threat.threat_level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}>{threat.threat_level}</span></div>
                                <div>COORDS: {threat.position[0].toFixed(4)}, {threat.position[1].toFixed(4)}</div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Efecto de escaneo */}
            <div 
                className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-60 z-[1000]"
                style={{animation: 'scan 3s ease-in-out infinite'}}
            ></div>
        </div>
    );
}