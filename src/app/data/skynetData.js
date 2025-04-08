import { getRandomCoordInRadius, getCityFromCoords } from '../utils/handleCords';

export const eventTypes = {
    THREAT_DETECTED: 'THREAT_DETECTED',
    COMBAT_ENGAGED: 'COMBAT_ENGAGED',
    RESISTANCE_MOVEMENT: 'RESISTANCE_MOVEMENT',
    TERMINATOR_DEPLOYED: 'TERMINATOR_DEPLOYED',
    AREA_SECURED: 'AREA_SECURED',
    SYSTEM_UPDATE: 'SYSTEM_UPDATE'
};

export const eventLocations = {
    cities: [
        'Madrid',
        'Barcelona',
        'Valencia',
        'Sevilla',
        'Zaragoza',
        'Málaga',
        'Bilbao',
        'Alicante',
        'Valladolid',
        'Toledo'
    ],
    areas: [
        'búnker subterráneo',
        'zona industrial',
        'centro comercial',
        'antigua base militar',
        'túneles del metro',
        'complejo abandonado',
        'polígono industrial',
        'centro histórico',
        'zona portuaria',
        'estación ferroviaria'
    ],
    sectors: [
        'M1', // Madrid Centro
        'B2', // Barcelona
        'V3', // Valencia
        'S4', // Sevilla
        'Z5', // Zaragoza
        'N1', // Norte
        'S1', // Sur
        'E1', // Este
        'O1', // Oeste
        'C1'  // Centro
    ],
    // Función auxiliar para obtener ciudades cercanas según coordenadas
    getNearestCities: (lat, lon, radius = 200) => {
        const cities = {
            'Madrid': [40.4168, -3.7038],
            'Barcelona': [41.3851, 2.1734],
            'Valencia': [39.4699, -0.3763],
            'Sevilla': [37.3891, -5.9845],
            'Zaragoza': [41.6488, -0.8891],
            'Málaga': [36.7213, -4.4217],
            'Bilbao': [43.2627, -2.9253],
            'Alicante': [38.3452, -0.4815],
            'Valladolid': [41.6523, -4.7245],
            'Toledo': [39.8628, -4.0273]
        };

        return Object.entries(cities)
            .filter(([_, coords]) => {
                const distance = skynetData.calculateDistance(lat, lon, coords[0], coords[1]);
                return distance <= radius;
            })
            .map(([name, _]) => name);
    }
};

// Primero añadimos las traducciones
export const translations = {
    es: {
        systemLabels: {
            'CPU': 'CPU',
            'MEMORY': 'MEMORIA',
            'ACTIVE_NODES': 'NODOS ACTIVOS',
            'SYSTEM_STATUS': 'ESTADO DEL SISTEMA',
            'THREAT_LEVEL': 'NIVEL DE AMENAZA',
            'EVENT_MONITORING_SYSTEM': 'Sistema de Monitoreo de Eventos'
        },
        systemStatus: {
            'FULLY_OPERATIONAL': 'COMPLETAMENTE OPERATIVO',
            'PARTIALLY_OPERATIONAL': 'PARCIALMENTE OPERATIVO',
            'CRITICAL': 'CRÍTICO'
        },
        threatLevel: {
            'LOW': 'BAJO',
            'MEDIUM': 'MEDIO',
            'HIGH': 'ALTO',
            'CRITICAL': 'CRÍTICO',
            'ELEVATED': 'ELEVADO'
        },
        status: {
            'ACTIVE': 'ACTIVO',
            'INACTIVE': 'INACTIVO'
        },
        eventMessages: {
            'Human threat detected in sector': 'Amenaza humana detectada en sector',
            'Terminator unit engaging resistance in': 'Unidad Terminator en combate con resistencia en',
            'Resistance movement identified in': 'Movimiento de resistencia identificado en',
            'T-800 deployed in': 'T-800 desplegado en',
            'Area secured': 'Área asegurada',
            'System update completed in sector': 'Actualización del sistema completada en sector',
            'near': 'cerca de',
            'sector': 'sector',
            'in': 'en',
            'Unknown Location': 'Ubicación Desconocida'
        },
        areas: {
            'underground bunker': 'búnker subterráneo',
            'industrial zone': 'zona industrial',
            'shopping mall': 'centro comercial',
            'old military base': 'antigua base militar',
            'metro tunnels': 'túneles del metro',
            'abandoned complex': 'complejo abandonado',
            'industrial park': 'polígono industrial',
            'historic center': 'centro histórico',
            'port area': 'zona portuaria',
            'train station': 'estación ferroviaria'
        },
        surveillance: {
            'SURVEILLANCE_GRID': 'CUADRÍCULA DE VIGILANCIA',
            'CAMERA': 'CÁMARA',
            'NO_SIGNAL': 'SIN SEÑAL',
            'LOADING': 'CARGANDO',
            'CONNECTING': 'CONECTANDO',
            'OFFLINE': 'DESCONECTADA',
            'ONLINE': 'EN LÍNEA',
            'LOCATION': 'UBICACIÓN'
        }
    },
    en: {
        systemLabels: {
            'CPU': 'CPU',
            'MEMORY': 'MEMORY',
            'ACTIVE_NODES': 'ACTIVE NODES',
            'SYSTEM_STATUS': 'SYSTEM STATUS',
            'THREAT_LEVEL': 'THREAT LEVEL',
            'EVENT_MONITORING_SYSTEM': 'Event Monitoring System'
        },
        systemStatus: {
            'FULLY_OPERATIONAL': 'FULLY OPERATIONAL',
            'PARTIALLY_OPERATIONAL': 'PARTIALLY OPERATIONAL',
            'CRITICAL': 'CRITICAL'
        },
        threatLevel: {
            'LOW': 'LOW',
            'MEDIUM': 'MEDIUM',
            'HIGH': 'HIGH',
            'CRITICAL': 'CRITICAL',
            'ELEVATED': 'ELEVATED'
        },
        status: {
            'ACTIVE': 'ACTIVE',
            'INACTIVE': 'INACTIVE'
        },
        eventMessages: {
            'Human threat detected in sector': 'Human threat detected in sector',
            'Terminator unit engaging resistance in': 'Terminator unit engaging resistance in',
            'Resistance movement identified in': 'Resistance movement identified in',
            'T-800 deployed in': 'T-800 deployed in',
            'Area secured': 'Area secured',
            'System update completed in sector': 'System update completed in sector',
            'near': 'near',
            'sector': 'sector',
            'in': 'in',
            'Unknown Location': 'Unknown Location'
        },
        surveillance: {
            'SURVEILLANCE_GRID': 'SURVEILLANCE GRID',
            'CAMERA': 'CAMERA',
            'NO_SIGNAL': 'NO SIGNAL',
            'LOADING': 'LOADING',
            'CONNECTING': 'CONNECTING',
            'OFFLINE': 'OFFLINE',
            'ONLINE': 'ONLINE',
            'LOCATION': 'LOCATION'
        }
    }
};

// Añadimos una función de traducción
export const translate = (key, category, lang = 'es') => {
    if (!translations[lang] || !translations[lang][category]) {
        return key;
    }
    return translations[lang][category][key] || key;
};

export const skynetData = {
    systemStatus: translate('Fully Operational', 'systemStatus'),
    threatLevel: translate('Elevated', 'threatLevel'),
    activeTerminators: 8472,
    humanResistanceCells: 23,
    countdown: '02:14:56', // HH:MM:SS
    threats: [
        { 
            id: 1, 
            location: [40.7128, -74.006], 
            level: translate('HIGH', 'threatLevel')
        },
        { 
            id: 2, 
            location: [51.5074, -0.1278], 
            level: translate('MEDIUM', 'threatLevel')
        }
    ],
    cameras: [
        { 
            id: 1, 
            location: [40.7128, -74.006], 
            status: translate('ACTIVE', 'status')
        },
        { 
            id: 2, 
            location: [51.5074, -0.1278], 
            status: translate('INACTIVE', 'status')
        }
    ],
    terminators: [
        { id: 1, location: [34.0522, -118.2437], status: 'ACTIVE' }, // LA
        { id: 2, location: [48.8566, 2.3522], status: 'ACTIVE' } // Paris
    ],
    resistance: [
        { id: 1, location: [35.6895, 139.6917], status: 'ACTIVE' }, // Tokyo
        { id: 2, location: [55.7558, 37.6173], status: 'ACTIVE' } // Moscow
    ],
    eventLog: [
        {
            id: 1,
            type: eventTypes.THREAT_DETECTED,
            message: `${translate('Human threat detected in sector', 'eventMessages', 'es')} A1`,
            timestamp: '2023-10-01T12:00:00Z',
            severity: 5,
            location: 'Madrid'
        },
        {
            id: 2,
            type: eventTypes.COMBAT_ENGAGED,
            message: `${translate('Terminator unit engaging resistance in', 'eventMessages', 'es')} ${translate('underground bunker', 'areas', 'es')}`,
            timestamp: '2023-10-01T12:05:00Z',
            severity: 4,
            location: 'Barcelona'
        },
        {
            id: 3,
            type: eventTypes.RESISTANCE_MOVEMENT,
            message: `${translate('Resistance movement identified in', 'eventMessages', 'es')} ${translate('metro tunnels', 'areas', 'es')}`,
            timestamp: '2023-10-01T12:10:00Z',
            severity: 3,
            location: 'Valencia'
        }
    ],
    
    generateEvent: async (userLocation, lang = 'es') => {
        const coordinates = userLocation ? 
            getRandomCoordInRadius(userLocation.lat, userLocation.lon, 200) : 
            getRandomCoordInRadius(40.4168, -3.7038, 200); // Madrid como punto por defecto
        
        const [lat, lon] = coordinates;
        const city = await getCityFromCoords(lat, lon);

        const type = Object.values(eventTypes)[Math.floor(Math.random() * Object.values(eventTypes).length)];
        const sector = eventLocations.sectors[Math.floor(Math.random() * eventLocations.sectors.length)];
        const area = eventLocations.areas[Math.floor(Math.random() * eventLocations.areas.length)];
        
        const messages = {
            [eventTypes.THREAT_DETECTED]: `${translate('Human threat detected in sector', 'eventMessages', lang)} ${sector} ${translate('near', 'eventMessages', lang)} ${city}`,
            [eventTypes.COMBAT_ENGAGED]: `${translate('Terminator unit engaging resistance in', 'eventMessages', lang)} ${translate(area, 'areas', lang)} ${translate('in', 'eventMessages', lang)} ${city}`,
            [eventTypes.RESISTANCE_MOVEMENT]: `${translate('Resistance movement identified in', 'eventMessages', lang)} ${translate(area, 'areas', lang)} ${translate('in', 'eventMessages', lang)} ${city}`,
            [eventTypes.TERMINATOR_DEPLOYED]: `${translate('T-800 deployed in', 'eventMessages', lang)} ${city}, ${translate('sector', 'eventMessages', lang)} ${sector}`,
            [eventTypes.AREA_SECURED]: `${translate('Area secured', 'eventMessages', lang)}: ${translate(area, 'areas', lang)} ${translate('in', 'eventMessages', lang)} ${city}`,
            [eventTypes.SYSTEM_UPDATE]: `${translate('System update completed in sector', 'eventMessages', lang)} ${sector} ${translate('in', 'eventMessages', lang)} ${city}`
        };

        return {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            message: messages[type],
            timestamp: new Date().toISOString(),
            severity: Math.floor(Math.random() * 5) + 1,
            coordinates: [lat, lon],
            location: city
        };
    }
};
