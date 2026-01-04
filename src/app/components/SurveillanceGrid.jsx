'use client';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

// Componente para una única cámara
const Camera = ({ id, status, location, videoSrc }) => {
    const { language } = useLanguage();
    const [loadingState, setLoadingState] = useState('CONNECTING');
    const [retryCount, setRetryCount] = useState(0);
    const videoRef = useRef(null);
    const maxRetries = 3;

    useEffect(() => {
        let timer;
        const simulateConnection = () => {
            if (retryCount < maxRetries) {
                setLoadingState('CONNECTING');
                timer = setTimeout(() => {
                    // Si hay video asignado, mostrar online; si no, sin señal
                    setLoadingState(videoSrc ? 'ONLINE' : 'NO_SIGNAL');
                }, 2000);
            } else {
                setLoadingState('OFFLINE');
            }
        };

        simulateConnection();
        return () => clearTimeout(timer);
    }, [retryCount, videoSrc]);

    const getStatusDisplay = () => {
        switch (loadingState) {
            case 'CONNECTING':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                        <span className="text-yellow-500 text-xs animate-pulse">{translate('CONNECTING', 'surveillance', language)}...</span>
                    </div>
                );
            case 'NO_SIGNAL':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <span className="text-red-500 text-xs blink">{translate('NO_SIGNAL', 'surveillance', language)}</span>
                    </div>
                );
            case 'OFFLINE':
                return (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                        <span className="text-red-600 text-xs">{translate('OFFLINE', 'surveillance', language)}</span>
                    </div>
                );
            case 'ONLINE':
                return (
                    <div className="relative w-full h-full">
                        <div className="absolute top-1 left-1 text-green-400 text-xs font-mono z-10">● {translate('ONLINE', 'surveillance', language)}</div>
                        <div className="absolute top-1 right-1 text-red-400 text-xs font-mono z-10">REC</div>
                        {/* Video feed real */}
                        {videoSrc ? (
                            <video ref={videoRef} className="w-full h-full object-cover" src={`/videos/${videoSrc}`} autoPlay loop muted playsInline />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 relative overflow-hidden">
                                {/* Líneas de escaneo */}
                                <div
                                    className="absolute inset-0 opacity-30"
                                    style={{
                                        backgroundImage: 'linear-gradient(transparent 50%, rgba(0,255,0,0.1) 50%)',
                                        backgroundSize: '100% 4px',
                                        animation: 'scan 2s linear infinite'
                                    }}></div>
                                {/* Ruido estático */}
                                <div className="absolute inset-0 opacity-20 bg-static animate-pulse"></div>
                            </div>
                        )}
                        {/* Líneas de escaneo sobre el video */}
                        <div
                            className="absolute inset-0 opacity-30 pointer-events-none z-10"
                            style={{
                                backgroundImage: 'linear-gradient(transparent 50%, rgba(0,255,0,0.1) 50%)',
                                backgroundSize: '100% 4px',
                                animation: 'scan 2s linear infinite'
                            }}></div>
                        {/* Crosshair del visor */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-6 h-6 border border-red-500 relative">
                                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-px h-4 bg-red-500"></div>
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-px h-4 bg-red-500"></div>
                                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-px w-4 bg-red-500"></div>
                                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-px w-4 bg-red-500"></div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="border border-red-500/50 bg-gray-900 relative overflow-hidden">
            <div className="text-xs text-red-400 p-1 bg-red-900/30 font-mono uppercase tracking-wide">CAM-{id.toString().padStart(2, '0')}</div>
            <div className="relative aspect-video bg-gray-900">{getStatusDisplay()}</div>
            <div className="text-xs text-gray-400 p-1 bg-gray-800/50 font-mono">
                {location}
                {videoSrc && <span className="text-green-400 ml-2">● FEED ACTIVO</span>}
            </div>
        </div>
    );
};

// Componente principal
export default function SurveillanceGrid() {
    const [cameras, setCameras] = useState([]);
    const { language } = useLanguage();

    useEffect(() => {
        const sectors = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA'];
        const availableVideos = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4'];

        // Mezclar los videos aleatoriamente
        const shuffledVideos = [...availableVideos].sort(() => Math.random() - 0.5);
        
        // Crear array de 6 cámaras
        const cameraAssignments = Array(6).fill(null);
        
        // Definir las filas: Fila 1 (cámaras 0,1,2) y Fila 2 (cámaras 3,4,5)
        const row1 = [0, 1, 2];
        const row2 = [3, 4, 5];
        
        // Asignar máximo 2 videos por fila aleatoriamente
        let videoIndex = 0;
        
        // Fila 1: elegir 2 posiciones aleatorias de las 3 disponibles
        const row1Positions = [...row1].sort(() => Math.random() - 0.5).slice(0, 2);
        row1Positions.forEach(position => {
            if (videoIndex < shuffledVideos.length) {
                cameraAssignments[position] = shuffledVideos[videoIndex];
                videoIndex++;
            }
        });
        
        // Fila 2: elegir 2 posiciones aleatorias de las 3 disponibles
        const row2Positions = [...row2].sort(() => Math.random() - 0.5).slice(0, 2);
        row2Positions.forEach(position => {
            if (videoIndex < shuffledVideos.length) {
                cameraAssignments[position] = shuffledVideos[videoIndex];
                videoIndex++;
            }
        });

        const simulatedCameras = Array.from({ length: 6 }, (_, i) => ({
            id: i + 1,
            status: 'CONNECTING',
            location: `SECTOR ${sectors[i]}`,
            videoSrc: cameraAssignments[i]
        }));

        setCameras(simulatedCameras);
    }, []);

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {cameras.map((camera) => (
                    <Camera key={camera.id} {...camera} />
                ))}
            </div>
        </div>
    );
}