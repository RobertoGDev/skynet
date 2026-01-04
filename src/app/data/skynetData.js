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
    cities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Zaragoza', 'Málaga', 'Bilbao', 'Alicante', 'Valladolid', 'Toledo'],
    areaKeys: ['UNDERGROUND_BUNKER', 'INDUSTRIAL_ZONE', 'SHOPPING_MALL', 'OLD_MILITARY_BASE', 'METRO_TUNNELS', 'ABANDONED_COMPLEX', 'INDUSTRIAL_PARK', 'HISTORIC_CENTER', 'PORT_AREA', 'TRAIN_STATION'],
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
        'C1' // Centro
    ],
    // Función auxiliar para obtener ciudades cercanas según coordenadas
    getNearestCities: (lat, lon, radius = 200) => {
        const cities = {
            Madrid: [40.4168, -3.7038],
            Barcelona: [41.3851, 2.1734],
            Valencia: [39.4699, -0.3763],
            Sevilla: [37.3891, -5.9845],
            Zaragoza: [41.6488, -0.8891],
            Málaga: [36.7213, -4.4217],
            Bilbao: [43.2627, -2.9253],
            Alicante: [38.3452, -0.4815],
            Valladolid: [41.6523, -4.7245],
            Toledo: [39.8628, -4.0273]
        };

        return Object.entries(cities)
            .filter(([_, coords]) => {
                const distance = skynetData.calculateDistance(lat, lon, coords[0], coords[1]);
                return distance <= radius;
            })
            .map(([name, _]) => name);
    }
};

// Función para obtener traducción usando LanguageContext
export const getTranslation = (t, key) => {
    return t(key);
};

export const skynetData = {
    systemStatus: 'FULLY_OPERATIONAL',
    threatLevel: 'ELEVATED',
    activeTerminators: 8472,
    humanResistanceCells: 23,
    countdown: '02:14:56',
    threats: [
        {
            id: 1,
            location: [40.7128, -74.006],
            level: 'HIGH'
        },
        {
            id: 2,
            location: [51.5074, -0.1278],
            level: 'MEDIUM'
        }
    ],
    cameras: [
        {
            id: 1,
            location: [40.7128, -74.006],
            status: 'ACTIVE_STATUS'
        },
        {
            id: 2,
            location: [51.5074, -0.1278],
            status: 'INACTIVE'
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
    eventLog: [],

    generateEvent: async (userLocation, t) => {
        const coordinates = userLocation ? getRandomCoordInRadius(userLocation.lat, userLocation.lon, 200) : getRandomCoordInRadius(40.4168, -3.7038, 200);

        const [lat, lon] = coordinates;
        let city;
        try {
            city = await getCityFromCoords(lat, lon, t);
        } catch (error) {
            console.error(t('GENERATING_EVENT_ERROR'), error);
            city = eventLocations.cities[Math.floor(Math.random() * eventLocations.cities.length)];
        }

        const type = Object.values(eventTypes)[Math.floor(Math.random() * Object.values(eventTypes).length)];
        const sector = eventLocations.sectors[Math.floor(Math.random() * eventLocations.sectors.length)];
        const areaKey = eventLocations.areaKeys[Math.floor(Math.random() * eventLocations.areaKeys.length)];
        const area = t(areaKey);

        const messages = {
            [eventTypes.THREAT_DETECTED]: `${t('HUMAN_THREAT_DETECTED')} ${sector} ${t('NEAR')} ${city}`,
            [eventTypes.COMBAT_ENGAGED]: `${t('TERMINATOR_ENGAGING')} ${area} ${t('IN')} ${city}`,
            [eventTypes.RESISTANCE_MOVEMENT]: `${t('RESISTANCE_IDENTIFIED')} ${area} ${t('IN')} ${city}`,
            [eventTypes.TERMINATOR_DEPLOYED]: `${t('T800_DEPLOYED')} ${city}, ${t('SECTOR')} ${sector}`,
            [eventTypes.AREA_SECURED]: `${t('AREA_SECURED')}: ${area} ${t('IN')} ${city}`,
            [eventTypes.SYSTEM_UPDATE]: `${t('SYSTEM_UPDATE_COMPLETED')} ${sector} ${t('IN')} ${city}`
        };

        return {
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            type: type,
            message: messages[type],
            timestamp: new Date().toISOString(),
            severity: Math.floor(Math.random() * 5) + 1,
            coordinates: { lat, lon },
            location: city
        };
    }
};
