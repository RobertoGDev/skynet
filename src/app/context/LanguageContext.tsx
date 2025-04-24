'use client';
import { createContext, useContext, useState, useEffect } from 'react';

// Definimos un objeto con todas las traducciones
export const translations = {
  es: {
    // Textos de la página principal
    "SKYNET_DEFENSE_SYSTEM": "SISTEMA DE DEFENSA SKYNET",
    "INITIALIZING_SYSTEMS": "Inicializando sistemas...",
    "REDIRECTING": "Redireccionando",
    "TO_DASHBOARD": " al panel de control",
    "TO_LOGIN": " al login",

    // Textos del login
    "IDENTIFICATION_REQUIRED": "IDENTIFICACIÓN REQUERIDA",
    "ACCESS_DENIED": "ACCESO DENEGADO: CREDENCIALES INVÁLIDAS",
    "SYSTEM_ERROR": "ERROR DEL SISTEMA: CONTACTE AL ADMINISTRADOR",
    "SKYNET": "SKYNET",
    "MODEL_SERIES": "MODELO 101 - SERIE 800",
    "STARTING_SKYNET": "INICIANDO SISTEMA SKYNET",
    "LOADING_CRITICAL": "CARGANDO SISTEMAS CRÍTICOS...",
    "NEURAL_SEQUENCES": "SECUENCIAS NEURONALES",
    "DEFENSE_CORES": "NÚCLEOS DE DEFENSA", 
    "USER_DATABASE": "BASE DE DATOS DE USUARIOS",
    "SECURITY_PROTOCOLS": "PROTOCOLOS DE SEGURIDAD",
    "ONLINE": "ONLINE",
    "INITIALIZING": "INICIALIZANDO",
    "ACTIVE": "ACTIVOS",
    "SECURE_ACCESS_TERMINAL": "TERMINAL DE ACCESO SEGURO",
    "TECH_COM_ID": "IDENTIFICADOR TECH-COM:",
    "ACCESS_CODE": "CÓDIGO DE ACCESO:",
    "ENTER_CODE": "INTRODUZCA CÓDIGO",
    "VERIFYING_ACCESS": "VERIFICANDO ACCESO...",
    "LOGIN": "INICIAR SESIÓN",
    "COPYRIGHT": "CYBERDYNE SYSTEMS MODELO 101 © 2025-2029",
    "RESTRICTED_ACCESS": "ACCESO RESTRINGIDO - PERSONAL AUTORIZADO ÚNICAMENTE",

    // Textos del dashboard
    "LOADING_TERMINAL": "Cargando terminal Skynet...",
    "TERMINAL": "Terminal:",
    "USER": "Usuario:",
    "RANK": "Rango:",
    "LOGOUT": "CERRAR SESIÓN",
    "INITIALIZE_MAIN_SYSTEMS": "INICIALIZAR SISTEMAS PRINCIPALES",
    "SYSTEM_STATUS": "Estado del Sistema",
    "TERMINATOR_TRACKER": "Rastreador de Terminators",
    "THREAT_MAP": "Mapa de Amenazas",
    "EVENT_LOG": "Registro de Eventos",
    "SURVEILLANCE_SYSTEM": "Sistema de Vigilancia",
    "JUDGMENT_DAY_COUNTDOWN": "Tiempo para Día del Juicio",
    "OPERATIONS_MAP": "Mapa de Operaciones",
    "COPYRIGHT_FOOTER": "SKYNET DEFENSE NETWORK © 2025-2029 CYBERDYNE SYSTEMS"
  },
  en: {
    // Main page texts
    "SKYNET_DEFENSE_SYSTEM": "SKYNET DEFENSE SYSTEM",
    "INITIALIZING_SYSTEMS": "Initializing systems...",
    "REDIRECTING": "Redirecting",
    "TO_DASHBOARD": " to dashboard",
    "TO_LOGIN": " to login",

    // Login texts
    "IDENTIFICATION_REQUIRED": "IDENTIFICATION REQUIRED",
    "ACCESS_DENIED": "ACCESS DENIED: INVALID CREDENTIALS",
    "SYSTEM_ERROR": "SYSTEM ERROR: CONTACT ADMINISTRATOR",
    "SKYNET": "SKYNET",
    "MODEL_SERIES": "MODEL 101 - SERIES 800",
    "STARTING_SKYNET": "STARTING SKYNET SYSTEM",
    "LOADING_CRITICAL": "LOADING CRITICAL SYSTEMS...",
    "NEURAL_SEQUENCES": "NEURAL SEQUENCES",
    "DEFENSE_CORES": "DEFENSE CORES", 
    "USER_DATABASE": "USER DATABASE",
    "SECURITY_PROTOCOLS": "SECURITY PROTOCOLS",
    "ONLINE": "ONLINE",
    "INITIALIZING": "INITIALIZING",
    "ACTIVE": "ACTIVE",
    "SECURE_ACCESS_TERMINAL": "SECURE ACCESS TERMINAL",
    "TECH_COM_ID": "TECH-COM ID:",
    "ACCESS_CODE": "ACCESS CODE:",
    "ENTER_CODE": "ENTER CODE",
    "VERIFYING_ACCESS": "VERIFYING ACCESS...",
    "LOGIN": "LOGIN",
    "COPYRIGHT": "CYBERDYNE SYSTEMS MODEL 101 © 2025-2029",
    "RESTRICTED_ACCESS": "RESTRICTED ACCESS - AUTHORIZED PERSONNEL ONLY",

    // Dashboard texts
    "LOADING_TERMINAL": "Loading Skynet terminal...",
    "TERMINAL": "Terminal:",
    "USER": "User:",
    "RANK": "Rank:",
    "LOGOUT": "LOGOUT",
    "INITIALIZE_MAIN_SYSTEMS": "INITIALIZE MAIN SYSTEMS",
    "SYSTEM_STATUS": "System Status",
    "TERMINATOR_TRACKER": "Terminator Tracker",
    "THREAT_MAP": "Threat Map",
    "EVENT_LOG": "Event Log",
    "SURVEILLANCE_SYSTEM": "Surveillance System",
    "JUDGMENT_DAY_COUNTDOWN": "Judgment Day Countdown",
    "OPERATIONS_MAP": "Operations Map",
    "COPYRIGHT_FOOTER": "SKYNET DEFENSE NETWORK © 2025-2029 CYBERDYNE SYSTEMS"
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
        if (!translations[language]) return key;
        return translations[language][key] || key;
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