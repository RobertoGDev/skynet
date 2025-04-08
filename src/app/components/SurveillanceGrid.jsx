'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

// Componente para una única cámara
const Camera = ({ id, status, location }) => {
    const { language } = useLanguage();
    const [loadingState, setLoadingState] = useState('CONNECTING');
    const [retryCount, setRetryCount] = useState(0);
    const maxRetries = 3;

    useEffect(() => {
        let timer;
        const simulateConnection = () => {
            if (retryCount < maxRetries) {
                setLoadingState('CONNECTING');
                timer = setTimeout(() => {
                    // Simulamos estado aleatorio de la cámara
                    setLoadingState(Math.random() > 0.3 ? 'ONLINE' : 'NO_SIGNAL');
                }, 2000);
            } else {
                setLoadingState('OFFLINE');
            }
        };

        simulateConnection();

        return () => clearTimeout(timer);
    }, [retryCount]);

    const getStatusDisplay = () => {
        switch (loadingState) {
            case 'CONNECTING':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
                        <span className="text-red-500 text-sm animate-pulse">
                            {translate('CONNECTING', 'surveillance', language)}...
                        </span>
                    </div>
                );
            case 'NO_SIGNAL':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <span className="text-red-500 text-sm">
                            {translate('NO_SIGNAL', 'surveillance', language)}
                        </span>
                    </div>
                );
            case 'OFFLINE':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <span className="text-red-500 text-sm">
                            {translate('OFFLINE', 'surveillance', language)}
                        </span>
                    </div>
                );
            case 'ONLINE':
                return (
                    <div className="relative w-full h-full">
                        <div className="absolute top-2 left-2 text-green-500 text-xs">
                            {translate('ONLINE', 'surveillance', language)}
                        </div>
                        <div className="w-full h-full opacity-10 bg-gradient-to-br from-gray-500 to-gray-700 animate-pulse" />
                    </div>
                );
        }
    };

    return (
        <div className="border border-red-500 p-2 bg-black">
            <div className="text-xs text-gray-400 mb-1">
                {translate('CAMERA', 'surveillance', language)} {id}
            </div>
            <div className="relative aspect-video bg-gray-900">
                {getStatusDisplay()}
            </div>
            <div className="text-xs text-gray-400 mt-1">
                {translate('LOCATION', 'surveillance', language)}: {location}
            </div>
        </div>
    );
};

// Componente principal
export default function SurveillanceGrid() {
    const [cameras, setCameras] = useState([]);
    const { language } = useLanguage();

    useEffect(() => {
        // Generar cámaras simuladas una sola vez al montar el componente
        const simulatedCameras = Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            status: 'CONNECTING',
            location: `Sector ${String.fromCharCode(65 + i)}`
        }));
        
        setCameras(simulatedCameras);
    }, []); // Solo se ejecuta al montar el componente

    return (
        <div className="border-2 border-red-500 p-4">
            <h2 className="text-xl mb-4 text-center text-red-500">
                {translate('SURVEILLANCE_GRID', 'surveillance', language)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cameras.map(camera => (
                    <Camera 
                        key={camera.id} 
                        {...camera} 
                    />
                ))}
            </div>
        </div>
    );
}