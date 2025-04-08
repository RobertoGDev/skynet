"use client";
import { useState, useEffect } from 'react';
import { skynetData } from '../data/skynetData';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

export default function EventLog() {
    const [events, setEvents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const { language } = useLanguage();

    // Función para calcular distancia entre dos puntos (Haversine)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radio de la Tierra en km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    useEffect(() => {
        // Obtener ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setUserLocation(location);
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                    setUserLocation({ lat: 40.4168, lon: -3.7038 }); // Madrid
                }
            );
        }

        // Genera evento inicial cerca de la ubicación del usuario
        const initialEvent = skynetData.generateEvent(userLocation, language);
        initialEvent.id = Date.now(); // Aseguramos ID único
        setEvents([initialEvent]);

        // Genera nuevos eventos cada 3-7 segundos
        const interval = setInterval(() => {
            setEvents(prevEvents => {
                const newEvent = skynetData.generateEvent(userLocation, language);
                newEvent.id = Date.now() + Math.random(); // ID único usando timestamp + random
                const newEvents = [newEvent, ...prevEvents].slice(0, 10);
                return newEvents;
            });
        }, Math.random() * 4000 + 3000);

        return () => clearInterval(interval);
    }, [userLocation, language]);

    const getSeverityColor = (severity, distance) => {
        // Ajusta el color según la severidad y la distancia
        const baseColors = {
            1: 'text-gray-400',
            2: 'text-yellow-500',
            3: 'text-orange-500',
            4: 'text-red-500',
            5: 'text-red-700'
        };
        
        // Si está a más de 100km, reduce la intensidad del color
        if (distance > 100) {
            return 'text-gray-500';
        }
        
        return baseColors[severity] || 'text-white';
    };

    return (
        <div className="border-2 border-red-500 p-4 h-[400px] overflow-hidden">
            <h2 className="text-xl mb-2">
                {translate('EVENT_MONITORING_SYSTEM', 'systemLabels', language)}
            </h2>
            <div className="h-full overflow-y-auto font-mono text-sm">
                {events.map(event => {
                    const distance = userLocation ? 
                        calculateDistance(
                            userLocation.lat, 
                            userLocation.lon, 
                            event.coordinates?.lat, 
                            event.coordinates?.lon
                        ) : 0;

                    return (
                        <div 
                            key={event.id || `event-${Date.now()}-${Math.random()}`}
                            className={`mb-2 ${getSeverityColor(event.severity, distance)} transition-opacity`}
                        >
                            <span className="text-green-500">
                                [{new Date(event.timestamp).toLocaleTimeString()}]
                            </span>{' '}
                            <span className="text-blue-400">
                                [{Math.round(distance)}km]
                            </span>{' '}
                            {event.message}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
