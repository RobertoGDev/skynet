import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
    import { AIProvider } from './context/AIContext';
import { AuthProvider } from './components/AuthProvider';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
    title: 'Skynet Defense System',
    description: 'Sistema de Defensa Global Skynet',
    icons: {
        icon: [
            { url: '/images/icon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/images/icon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/images/icon/favicon.ico', sizes: '48x48', type: 'image/x-icon' }
        ],
        apple: [
            { url: '/images/icon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
        ],
        other: [
            { url: '/images/icon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/images/icon/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
    },
    manifest: '/images/icon/site.webmanifest'
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body suppressHydrationWarning={true} className="antialiased bg-black text-white">
                <AuthProvider>
                    <LanguageProvider>
                        <AudioProvider>
                            <AIProvider>{children}</AIProvider>
                        </AudioProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
