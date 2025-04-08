'use client';
import { MapContainer, TileLayer, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

export default function Map({ userLocation }) {
    useEffect(() => {
        // Fix para los iconos de Leaflet en Next.js
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'leaflet/images/marker-icon-2x.png',
            iconUrl: 'leaflet/images/marker-icon.png',
            shadowUrl: 'leaflet/images/marker-shadow.png',
        });
    }, []);

    return (
        <div className="h-[400px] border-2 border-red-500">
            <MapContainer 
                center={[userLocation.latitude || 40.4168, userLocation.longitude || -3.7038]} 
                zoom={13} 
                className="h-full"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Circle
                    center={[userLocation.latitude || 40.4168, userLocation.longitude || -3.7038]}
                    radius={1000}
                    color="red"
                />
            </MapContainer>
        </div>
    );
}