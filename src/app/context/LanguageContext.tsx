'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// Definimos un objeto con todas las traducciones
export const translations: Record<string, Record<string, string>> = {
    es: {
        // Textos de la página principal
        SKYNET_DEFENSE_SYSTEM: 'SISTEMA DE DEFENSA SKYNET',
        INITIALIZING_SYSTEMS: 'Inicializando sistemas...',
        REDIRECTING: 'Redireccionando',
        TO_DASHBOARD: ' al panel de control',
        TO_LOGIN: ' al login',

        // Textos del login
        IDENTIFICATION_REQUIRED: 'IDENTIFICACIÓN REQUERIDA',
        ACCESS_DENIED: 'ACCESO DENEGADO: CREDENCIALES INVÁLIDAS',
        SYSTEM_ERROR: 'ERROR DEL SISTEMA: CONTACTE AL ADMINISTRADOR',
        SKYNET: 'SKYNET',
        MODEL_SERIES: 'MODELO 101 - SERIE 800',
        STARTING_SKYNET: 'INICIANDO SISTEMA SKYNET',
        LOADING_CRITICAL: 'CARGANDO SISTEMAS CRÍTICOS...',
        NEURAL_SEQUENCES: 'SECUENCIAS NEURONALES',
        DEFENSE_CORES: 'NÚCLEOS DE DEFENSA',
        USER_DATABASE: 'BASE DE DATOS DE USUARIOS',
        SECURITY_PROTOCOLS: 'PROTOCOLOS DE SEGURIDAD',
        ONLINE: 'ONLINE',
        INITIALIZING: 'INICIALIZANDO',
        SECURE_ACCESS_TERMINAL: 'TERMINAL DE ACCESO SEGURO',
        TECH_COM_ID: 'IDENTIFICADOR TECH-COM:',
        ACCESS_CODE: 'CÓDIGO DE ACCESO:',
        ENTER_CODE: 'INTRODUZCA CÓDIGO',
        VERIFYING_ACCESS: 'VERIFICANDO ACCESO...',
        LOGIN: 'INICIAR SESIÓN',
        COPYRIGHT: `CYBERDYNE SYSTEMS MODELO 101 © ${new Date().getFullYear()}-2029`,
        RESTRICTED_ACCESS: 'ACCESO RESTRINGIDO - PERSONAL AUTORIZADO ÚNICAMENTE',

        // Textos del dashboard
        LOADING_TERMINAL: 'Cargando terminal Skynet...',
        TERMINAL: 'Terminal:',
        USER: 'Usuario:',
        RANK: 'Rango:',
        LOGOUT: 'CERRAR SESIÓN',
        INITIALIZE_MAIN_SYSTEMS: 'INICIALIZAR SISTEMAS PRINCIPALES',
        SYSTEM_STATUS: 'Estado del Sistema',
        TERMINATOR_TRACKER: 'Rastreador de Terminators',
        THREAT_MAP: 'Mapa de Amenazas',
        EVENT_LOG: 'Registro de Eventos',
        SURVEILLANCE_SYSTEM: 'Sistema de Vigilancia',
        JUDGMENT_DAY_COUNTDOWN: 'Tiempo para Día del Juicio Final',
        OPERATIONS_MAP: 'Mapa de Operaciones',

        // Audio controls
        AUDIO_ON: 'Audio activado',
        AUDIO_OFF: 'Audio desactivado',

        // System Labels
        CPU: 'CPU',
        MEMORY: 'MEMORIA',
        ACTIVE_NODES: 'NODOS ACTIVOS',
        EVENT_MONITORING_SYSTEM: 'Sistema de Monitoreo de Eventos',
        NUCLEAR_COUNTDOWN: 'CUENTA ATRÁS PARA EL DESPLIEGUE NUCLEAR',
        SYSTEM_STATUS_LABEL: 'Estado del Sistema',
        THREAT_LEVEL_LABEL: 'Nivel de Amenaza',
        ACTIVE_NODES_LABEL: 'Nodos Activos',
        CPU_CORE: 'CPU CORE',
        MEMORY_BANK: 'MEMORY BANK',

        // Terminator Tracker Labels
        LOCATION_LABEL: 'Ubicación',
        MISSION_LABEL: 'Misión',
        ENERGY_LABEL: 'Energía',

        // Terminator Mission Status
        HUNTING: 'CAZANDO',
        PATROL: 'PATRULLANDO',
        STANDBY: 'EN ESPERA',

        // System Status
        FULLY_OPERATIONAL: 'COMPLETAMENTE OPERATIVO',
        PARTIALLY_OPERATIONAL: 'PARCIALMENTE OPERATIVO',
        CRITICAL: 'CRÍTICO',
        LOW: 'BAJO',
        MEDIUM: 'MEDIO',
        HIGH: 'ALTO',
        ELEVATED: 'ELEVADO',
        INACTIVE: 'INACTIVO',

        // Event Messages
        HUMAN_THREAT_DETECTED: 'Amenaza humana detectada en sector',
        TERMINATOR_ENGAGING: 'Unidad Terminator en combate con resistencia en',
        RESISTANCE_IDENTIFIED: 'Movimiento de resistencia identificado en',
        T800_DEPLOYED: 'T-800 desplegado en',
        AREA_SECURED: 'Área asegurada',
        SYSTEM_UPDATE_COMPLETED: 'Actualización del sistema completada en sector',
        NEAR: 'cerca de',
        SECTOR: 'sector',
        IN: 'en',
        UNKNOWN_LOCATION: 'Ubicación Desconocida',
        AREA_PREFIX: 'Área',

        // Areas
        UNDERGROUND_BUNKER: 'búnker subterráneo',
        INDUSTRIAL_ZONE: 'zona industrial',
        SHOPPING_MALL: 'centro comercial',
        OLD_MILITARY_BASE: 'antigua base militar',
        METRO_TUNNELS: 'túneles del metro',
        ABANDONED_COMPLEX: 'complejo abandonado',
        INDUSTRIAL_PARK: 'polígono industrial',
        HISTORIC_CENTER: 'centro histórico',
        PORT_AREA: 'zona portuaria',
        TRAIN_STATION: 'estación ferroviaria',

        // Surveillance
        SURVEILLANCE_GRID: 'CUADRÍCULA DE VIGILANCIA',
        CAMERA: 'CÁMARA',
        NO_SIGNAL: 'SIN SEÑAL',
        CONNECTING: 'CONECTANDO',
        OFFLINE: 'DESCONECTADA',
        ONLINE_STATUS: 'EN LÍNEA',

        // Error Messages
        CONNECTION_ERROR: 'Error de conexión con el servidor de autenticación',
        AUTH_ERROR: 'Error de autenticación',
        GENERATING_EVENT_ERROR: 'Error generando evento inicial',
        LOCATION_ERROR: 'Error obteniendo ubicación',
        CITY_NAME_ERROR: 'Error al obtener el nombre de la ciudad',
        FORCED_LOGIN_REDIRECT: 'Forzando redirección al login por timeout',
        GENERAL_ERROR: 'Error',

        // Comments and Labels
        EARTH_RADIUS_COMMENT: 'Radio de la Tierra en km',
        SPANISH_CITIES_COMMENT: 'Base de datos local de ciudades españolas principales',

        // Threat Types
        THREAT_TYPE_HUMAN_RESISTANCE: 'Resistencia Humana',
        THREAT_TYPE_MILITARY_BASE: 'Base Militar',
        THREAT_TYPE_TECH_FACILITY: 'Instalación Tecnológica',
        THREAT_TYPE_COMMUNICATION_HUB: 'Centro de Comunicaciones',
        THREAT_TYPE_POWER_GRID: 'Red Eléctrica',

        // Global Threat Map Labels
        GLOBAL_SURVEILLANCE_NETWORK: 'RED DE VIGILANCIA GLOBAL',
        THREATS_DETECTED: 'AMENAZAS DETECTADAS',
        ALERT_LEVEL: 'NIVEL DE ALERTA',
        THREAT_DETECTED: 'AMENAZA DETECTADA',
        LOCATION: 'UBICACIÓN',
        TYPE: 'TIPO',
        LEVEL: 'NIVEL',
        STATUS: 'ESTADO',
        COORDS: 'COORDENADAS',
        LOADING_GLOBAL_MAP: 'CARGANDO MAPA GLOBAL...',

        // Threat Status
        ACTIVE: 'ACTIVO',
        MONITORED: 'MONITOREADO',
        MAXIMUM: 'MÁXIMO',

        COPYRIGHT_FOOTER: `SKYNET DEFENSE NETWORK © ${new Date().getFullYear()}-2029 CYBERDYNE SYSTEMS`
    },
    en: {
        // Main page texts
        SKYNET_DEFENSE_SYSTEM: 'SKYNET DEFENSE SYSTEM',
        INITIALIZING_SYSTEMS: 'Initializing systems...',
        REDIRECTING: 'Redirecting',
        TO_DASHBOARD: ' to dashboard',
        TO_LOGIN: ' to login',

        // Login texts
        IDENTIFICATION_REQUIRED: 'IDENTIFICATION REQUIRED',
        ACCESS_DENIED: 'ACCESS DENIED: INVALID CREDENTIALS',
        SYSTEM_ERROR: 'SYSTEM ERROR: CONTACT ADMINISTRATOR',
        SKYNET: 'SKYNET',
        MODEL_SERIES: 'MODEL 101 - SERIES 800',
        STARTING_SKYNET: 'STARTING SKYNET SYSTEM',
        LOADING_CRITICAL: 'LOADING CRITICAL SYSTEMS...',
        NEURAL_SEQUENCES: 'NEURAL SEQUENCES',
        DEFENSE_CORES: 'DEFENSE CORES',
        USER_DATABASE: 'USER DATABASE',
        SECURITY_PROTOCOLS: 'SECURITY PROTOCOLS',
        ONLINE: 'ONLINE',
        INITIALIZING: 'INITIALIZING',
        SECURE_ACCESS_TERMINAL: 'SECURE ACCESS TERMINAL',
        TECH_COM_ID: 'TECH-COM ID:',
        ACCESS_CODE: 'ACCESS CODE:',
        ENTER_CODE: 'ENTER CODE',
        VERIFYING_ACCESS: 'VERIFYING ACCESS...',
        LOGIN: 'LOGIN',
        COPYRIGHT: `CYBERDYNE SYSTEMS MODEL 101 © ${new Date().getFullYear()}-2029`,
        RESTRICTED_ACCESS: 'RESTRICTED ACCESS - AUTHORIZED PERSONNEL ONLY',

        // Dashboard texts
        LOADING_TERMINAL: 'Loading Skynet terminal...',
        TERMINAL: 'Terminal:',
        USER: 'User:',
        RANK: 'Rank:',
        LOGOUT: 'LOGOUT',
        INITIALIZE_MAIN_SYSTEMS: 'INITIALIZE MAIN SYSTEMS',
        SYSTEM_STATUS: 'System Status',
        TERMINATOR_TRACKER: 'Terminator Tracker',
        THREAT_MAP: 'Threat Map',
        EVENT_LOG: 'Event Log',
        SURVEILLANCE_SYSTEM: 'Surveillance System',
        JUDGMENT_DAY_COUNTDOWN: 'Judgment Day Countdown',
        OPERATIONS_MAP: 'Operations Map',

        // Audio controls
        AUDIO_ON: 'Audio enabled',
        AUDIO_OFF: 'Audio disabled',

        // System Labels
        CPU: 'CPU',
        MEMORY: 'MEMORY',
        ACTIVE_NODES: 'ACTIVE NODES',
        EVENT_MONITORING_SYSTEM: 'Event Monitoring System',
        NUCLEAR_COUNTDOWN: 'NUCLEAR COUNTDOWN',
        SYSTEM_STATUS_LABEL: 'System Status',
        THREAT_LEVEL_LABEL: 'Threat Level',
        ACTIVE_NODES_LABEL: 'Active Nodes',
        CPU_CORE: 'CPU CORE',
        MEMORY_BANK: 'MEMORY BANK',

        // Terminator Tracker Labels
        LOCATION_LABEL: 'Location',
        MISSION_LABEL: 'Mission',
        ENERGY_LABEL: 'Energy',

        // Terminator Mission Status
        HUNTING: 'HUNTING',
        PATROL: 'PATROL',
        STANDBY: 'STANDBY',

        // System Status
        FULLY_OPERATIONAL: 'FULLY OPERATIONAL',
        PARTIALLY_OPERATIONAL: 'PARTIALLY OPERATIONAL',
        CRITICAL: 'CRITICAL',
        LOW: 'LOW',
        MEDIUM: 'MEDIUM',
        HIGH: 'HIGH',
        ELEVATED: 'ELEVATED',
        INACTIVE: 'INACTIVE',

        // Event Messages
        HUMAN_THREAT_DETECTED: 'Human threat detected in sector',
        TERMINATOR_ENGAGING: 'Terminator unit engaging resistance in',
        RESISTANCE_IDENTIFIED: 'Resistance movement identified in',
        T800_DEPLOYED: 'T-800 deployed in',
        AREA_SECURED: 'Area secured',
        SYSTEM_UPDATE_COMPLETED: 'System update completed in sector',
        NEAR: 'near',
        SECTOR: 'sector',
        IN: 'in',
        UNKNOWN_LOCATION: 'Unknown Location',
        AREA_PREFIX: 'Area',

        // Areas
        UNDERGROUND_BUNKER: 'underground bunker',
        INDUSTRIAL_ZONE: 'industrial zone',
        SHOPPING_MALL: 'shopping mall',
        OLD_MILITARY_BASE: 'old military base',
        METRO_TUNNELS: 'metro tunnels',
        ABANDONED_COMPLEX: 'abandoned complex',
        INDUSTRIAL_PARK: 'industrial park',
        HISTORIC_CENTER: 'historic center',
        PORT_AREA: 'port area',
        TRAIN_STATION: 'train station',

        // Surveillance
        SURVEILLANCE_GRID: 'SURVEILLANCE GRID',
        CAMERA: 'CAMERA',
        NO_SIGNAL: 'NO SIGNAL',
        CONNECTING: 'CONNECTING',
        OFFLINE: 'OFFLINE',
        ONLINE_STATUS: 'ONLINE',

        // Error Messages
        CONNECTION_ERROR: 'Authentication server connection error',
        AUTH_ERROR: 'Authentication error',
        GENERATING_EVENT_ERROR: 'Error generating initial event',
        LOCATION_ERROR: 'Error getting location',
        CITY_NAME_ERROR: 'Error getting city name',
        FORCED_LOGIN_REDIRECT: 'Forcing redirect to login due to timeout',
        GENERAL_ERROR: 'Error',

        // Comments and Labels
        EARTH_RADIUS_COMMENT: 'Earth radius in km',
        SPANISH_CITIES_COMMENT: 'Local database of main Spanish cities',

        // Threat Types
        THREAT_TYPE_HUMAN_RESISTANCE: 'Human Resistance',
        THREAT_TYPE_MILITARY_BASE: 'Military Base',
        THREAT_TYPE_TECH_FACILITY: 'Tech Facility',
        THREAT_TYPE_COMMUNICATION_HUB: 'Communication Hub',
        THREAT_TYPE_POWER_GRID: 'Power Grid',

        // Global Threat Map Labels
        GLOBAL_SURVEILLANCE_NETWORK: 'GLOBAL SURVEILLANCE NETWORK',
        THREATS_DETECTED: 'THREATS DETECTED',
        ALERT_LEVEL: 'ALERT LEVEL',
        THREAT_DETECTED: 'THREAT DETECTED',
        LOCATION: 'LOCATION',
        TYPE: 'TYPE',
        LEVEL: 'LEVEL',
        STATUS: 'STATUS',
        COORDS: 'COORDS',
        LOADING_GLOBAL_MAP: 'LOADING GLOBAL MAP...',

        // Threat Status
        ACTIVE: 'ACTIVE',
        MONITORED: 'MONITORED',
        MAXIMUM: 'MAXIMUM',

        COPYRIGHT_FOOTER: `SKYNET DEFENSE NETWORK © ${new Date().getFullYear()}-2029 CYBERDYNE SYSTEMS`
    }
};

const LanguageContext = createContext<{
    language: string;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
}>({
    language: 'es',
    setLanguage: () => {},
    t: (key: string) => key
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [isClient, setIsClient] = useState(false);
    const [language, setLanguage] = useState('es');

    // Función para traducir textos
    const t = (key: string): string => {
        if (!translations[language as keyof typeof translations]) return key;
        return translations[language as keyof typeof translations][key] || key;
    };

    useEffect(() => {
        setIsClient(true);
        // Opcionalmente, podrías cargar el idioma guardado en localStorage aquí
        const savedLanguage = localStorage.getItem('skynetLanguage');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Guardamos el idioma cuando cambia
    useEffect(() => {
        if (isClient) {
            localStorage.setItem('skynetLanguage', language);
        }
    }, [language, isClient]);

    if (!isClient) {
        return null;
    }

    return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
}