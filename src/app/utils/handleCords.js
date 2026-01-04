const EARTH_RADIUS = 6371;

const SPANISH_CITIES = [
    { name: 'Madrid', coords: [40.4168, -3.7038] },
    { name: 'Barcelona', coords: [41.3851, 2.1734] },
    { name: 'Valencia', coords: [39.4699, -0.3763] },
    { name: 'Sevilla', coords: [37.3891, -5.9845] },
    { name: 'Zaragoza', coords: [41.6488, -0.8891] },
    { name: 'Málaga', coords: [36.7213, -4.4217] },
    { name: 'Murcia', coords: [37.9922, -1.1307] },
    { name: 'Palma', coords: [39.5696, 2.6502] },
    { name: 'Bilbao', coords: [43.2627, -2.9253] },
    { name: 'Alicante', coords: [38.3452, -0.4815] },
    { name: 'Córdoba', coords: [37.8882, -4.7794] },
    { name: 'Valladolid', coords: [41.6523, -4.7245] },
    { name: 'Vigo', coords: [42.2328, -8.7226] },
    { name: 'Gijón', coords: [43.5322, -5.6611] },
    { name: 'Granada', coords: [37.1773, -3.5986] }
];

export const getRandomCoordInRadius = (centerLat, centerLon, radiusKm) => {
    // Genera un punto aleatorio en un círculo
    const r = radiusKm * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;

    // Convierte coordenadas polares a cartesianas
    const dx = r * Math.cos(theta);
    const dy = r * Math.sin(theta);

    // Convierte distancia a grados
    const newLat = centerLat + (dy / EARTH_RADIUS) * (180 / Math.PI);
    const newLon = centerLon + ((dx / EARTH_RADIUS) * (180 / Math.PI)) / Math.cos((centerLat * Math.PI) / 180);

    return [newLat, newLon];
};

// Función para calcular distancia entre dos puntos (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS * c;
};

export const getCityFromCoords = async (lat, lon, t = null) => {
    try {
        const closest = SPANISH_CITIES.reduce((prev, curr) => {
            const prevDist = calculateDistance(lat, lon, prev.coords[0], prev.coords[1]);
            const currDist = calculateDistance(lat, lon, curr.coords[0], curr.coords[1]);
            return prevDist < currDist ? prev : curr;
        });

        const distance = calculateDistance(lat, lon, closest.coords[0], closest.coords[1]);
        if (distance > 100) {
            const areaPrefix = t ? t('AREA_PREFIX') : 'Área';
            return `${areaPrefix} ${closest.name}`;
        }

        return closest.name;
    } catch (error) {
        const errorMsg = t ? t('CITY_NAME_ERROR') : 'Error al obtener el nombre de la ciudad';
        const unknownLocation = t ? t('UNKNOWN_LOCATION') : 'Ubicación Desconocida';
        console.error(errorMsg, error);
        return unknownLocation;
    }
};
