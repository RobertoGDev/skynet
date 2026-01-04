import { useState, useEffect } from 'react';
import { skynetData } from '../data/skynetData';
import { useLanguage } from '../context/LanguageContext';

export default function EventLog() {
    const [events, setEvents] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const { language, t } = useLanguage();

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

                    const getInitialEvent = async () => {
                        try {
                            const initialEvent = await skynetData.generateEvent(location, t);
                            initialEvent.id = Date.now();
                            setEvents([initialEvent]);
                        } catch (error) {
                            console.error(t('GENERATING_EVENT_ERROR'), error);
                        }
                    };

                    getInitialEvent();

                    interval = setInterval(async () => {
                        try {
                            const newEvent = await skynetData.generateEvent(location, t);
                            newEvent.id = Date.now() + Math.random();

                            setEvents((prevEvents) => {
                                return [newEvent, ...prevEvents].slice(0, 10);
                            });
                        } catch (error) {
                            console.error(t('GENERATING_EVENT_ERROR'), error);
                        }
                    }, Math.random() * 4000 + 3000);
                },
                    (error) => {
                        console.error(t('LOCATION_ERROR'), error);
                        const defaultLocation = { lat: 40.4168, lon: -3.7038 };
                        setUserLocation(defaultLocation);

                        const getInitialEvent = async () => {
                            try {
                                const initialEvent = await skynetData.generateEvent(defaultLocation, t);
                                initialEvent.id = Date.now();
                                setEvents([initialEvent]);
                            } catch (error) {
                                console.error(t('GENERATING_EVENT_ERROR'), error);
                            }
                        };

                        getInitialEvent();

                        interval = setInterval(async () => {
                            try {
                                const newEvent = await skynetData.generateEvent(defaultLocation, t);
                                newEvent.id = Date.now() + Math.random();

                                setEvents((prevEvents) => {
                                    return [newEvent, ...prevEvents].slice(0, 10);
                                });
                            } catch (error) {
                                console.error(t('GENERATING_EVENT_ERROR'), error);
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

    // Función para obtener el frame del terminator según la severidad
    const getTerminatorAvatarFrame = (severity) => {
        const frameWidth = 64;
        const frameHeight = 64;

        let frameIndex;
        if (severity >= 4) {
            frameIndex = 3; // Frame alarmado/dañado para alta severidad
        } else if (severity >= 3) {
            frameIndex = 2; // Frame desgastado
        } else if (severity >= 2) {
            frameIndex = 1; // Frame normal
        } else {
            frameIndex = 0; // Frame tranquilo
        }

        const x = frameIndex * frameWidth;
        const y = 0;

        return {
            backgroundImage: 'url("/images/sprite-terminators.png")',
            backgroundPosition: `-${x}px -${y}px`,
            backgroundSize: `${frameWidth * 4}px auto`,
            width: '20px',
            height: '20px',
            imageRendering: 'pixelated'
        };
    };

    return (
        <div className="h-full overflow-hidden overflow-y-auto font-sans text-sm space-y-2 scrollbar-thin scrollbar-track-gray-900/50 scrollbar-thumb-red-500/70 hover:scrollbar-thumb-red-400 scrollbar-corner-gray-900">
            {events.map((event) => {
                // Validar que event.timestamp sea válido
                const timestamp = event.timestamp ? new Date(event.timestamp) : new Date();
                const isValidDate = timestamp instanceof Date && !isNaN(timestamp);

                const distance = userLocation && event.coordinates ? calculateDistance(userLocation.lat, userLocation.lon, event.coordinates.lat, event.coordinates.lon) : 0;

                return (
                    <div
                        key={event.id || `event-${Date.now()}-${Math.random()}`}
                        className={`p-2 bg-gray-800/30 border-l-2 border-red-500/50 rounded font-mono text-xs ${getSeverityColor(event.severity, distance)} transition-all hover:bg-gray-700/30`}>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                                {/* Avatar Terminator */}
                                <div className="bg-red-900/20 rounded border border-red-500/30 overflow-hidden flex-shrink-0" style={getTerminatorAvatarFrame(event.severity)}>
                                    {/* Mini efectos HUD */}
                                    <div className="relative w-full h-full">
                                        <div className="absolute top-0 left-0 w-0.5 h-0.5 border-l border-t border-red-400 opacity-60"></div>
                                        <div className="absolute top-0 right-0 w-0.5 h-0.5 border-r border-t border-red-400 opacity-60"></div>
                                    </div>
                                </div>
                                <span className="text-green-400">[{isValidDate ? timestamp.toLocaleTimeString() : 'Invalid Time'}]</span>
                            </div>
                            <span className="text-blue-400">[{Number.isFinite(distance) ? Math.round(distance) : 0}km]</span>
                        </div>
                        <div className="text-white ml-6">{event.message}</div>
                    </div>
                );
            })}
        </div>
    );
}
