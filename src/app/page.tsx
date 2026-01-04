'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './context/LanguageContext';

export default function Home() {
    const { status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        // Añadimos un temporizador para asegurarnos que el estado de la sesión se ha cargado
        const redirectionTimer = setTimeout(() => {
            if (status === 'authenticated') {
                router.push('/dashboard');
            } else {
                // Si no está autenticado o está cargando por más tiempo del esperado, redirigir al login
                router.push('/login');
            }
        }, 2000); // Esperamos 2 segundos para dar tiempo a que se cargue el estado de la sesión

        return () => clearTimeout(redirectionTimer);
    }, [status, router]);

    // Añadimos un efecto adicional para forzar la redirección después de un tiempo máximo
    useEffect(() => {
        const forceRedirectTimer = setTimeout(() => {
            console.log(t('FORCED_LOGIN_REDIRECT'));
            router.push('/login');
        }, 5000);

        return () => clearTimeout(forceRedirectTimer);
    }, [router]);

    // Página de carga mientras se determina el estado de autenticación
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center" style={{ fontFamily: "'modern-vision', 'Courier New', monospace" }}>
            <div className="text-center">
                <h1 className="text-5xl mb-4 text-red-500 font-bold">{t('SKYNET_DEFENSE_SYSTEM')}</h1>
                <div className="animate-pulse mb-10 text-red-600 text-3xl">{t('INITIALIZING_SYSTEMS')}</div>
                <div className="text-yellow-500 text-sm">
                    {t('REDIRECTING')}
                    {status === 'loading' ? '...' : status === 'authenticated' ? t('TO_DASHBOARD') : t('TO_LOGIN')}
                </div>
            </div>
        </div>
    );
}
