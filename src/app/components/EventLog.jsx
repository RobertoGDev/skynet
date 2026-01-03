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
        // Validar que todos los parámetros sean números válidos
        if (!lat1 || !lon1 || !lat2 || !lon2 || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
            return 0;
        }

        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        let interval;

        // Obtener ubicación del usuario
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setUserLocation(location);

                    // Genera evento inicial solo cuando tenemos la ubicación
                    const getInitialEvent = async () => {
                        try {
                            const initialEvent = await skynetData.generateEvent(location, language);
                            initialEvent.id = Date.now();
                            setEvents([initialEvent]);
                        } catch (error) {
                            console.error('Error generando evento inicial:', error);
                        }
                    };

                    getInitialEvent();

                    // Inicia el intervalo solo cuando tenemos la ubicación
                    interval = setInterval(async () => {
                        try {
                            const newEvent = await skynetData.generateEvent(location, language);
                            newEvent.id = Date.now() + Math.random();

                            setEvents((prevEvents) => {
                                return [newEvent, ...prevEvents].slice(0, 10);
                            });
                        } catch (error) {
                            console.error('Error generando nuevo evento:', error);
                        }
                    }, Math.random() * 4000 + 3000);
                },
                (error) => {
                    console.error('Error obteniendo ubicación:', error);
                    const defaultLocation = { lat: 40.4168, lon: -3.7038 }; // Madrid
                    setUserLocation(defaultLocation);

                    // Usar ubicación por defecto si hay error
                    const getInitialEvent = async () => {
                        try {
                            const initialEvent = await skynetData.generateEvent(defaultLocation, language);
                            initialEvent.id = Date.now();
                            setEvents([initialEvent]);
                        } catch (error) {
                            console.error('Error generando evento inicial:', error);
                        }
                    };

                    getInitialEvent();

                    interval = setInterval(async () => {
                        try {
                            const newEvent = await skynetData.generateEvent(defaultLocation, language);
                            newEvent.id = Date.now() + Math.random();

                            setEvents((prevEvents) => {
                                return [newEvent, ...prevEvents].slice(0, 10);
                            });
                        } catch (error) {
                            console.error('Error generando nuevo evento:', error);
                        }
                    }, Math.random() * 4000 + 3000);
                }
            );
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [language]); // Solo depende del idioma

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
        <div className="h-full overflow-hidden">
            <div className="h-full overflow-y-auto font-sans text-sm space-y-2 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-red-500">
                {events.map((event) => {
                    // Validar que event.timestamp sea válido
                    const timestamp = event.timestamp ? new Date(event.timestamp) : new Date();
                    const isValidDate = timestamp instanceof Date && !isNaN(timestamp);

                    const distance = userLocation && event.coordinates ? calculateDistance(userLocation.lat, userLocation.lon, event.coordinates.lat, event.coordinates.lon) : 0;

                    return (
                        <div key={event.id || `event-${Date.now()}-${Math.random()}`} className={`p-2 bg-gray-800/30 border-l-2 border-red-500/50 rounded font-mono text-xs ${getSeverityColor(event.severity, distance)} transition-all hover:bg-gray-700/30`}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-green-400">[{isValidDate ? timestamp.toLocaleTimeString() : 'Invalid Time'}]</span>
                                <span className="text-blue-400">[{Number.isFinite(distance) ? Math.round(distance) : 0}km]</span>
                            </div>
                            <div className="text-white">{event.message}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
