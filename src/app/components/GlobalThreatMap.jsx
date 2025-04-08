'use client';
import dynamic from 'next/dynamic';

// Importación dinámica del mapa para evitar errores de SSR
const Map = dynamic(
    () => import('./Map'),
    { 
        ssr: false,
        loading: () => (
            <div className="h-[400px] border-2 border-red-500 flex items-center justify-center">
                <span className="text-red-500">Cargando mapa...</span>
            </div>
        )
    }
);

export default function GlobalThreatMap({ userLocation }) {
    return <Map userLocation={userLocation} />;
}
