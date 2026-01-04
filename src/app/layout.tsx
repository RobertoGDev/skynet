import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
    import { AIProvider } from './context/AIContext';
import { AuthProvider } from './components/AuthProvider';
import 'leaflet/dist/leaflet.css';
import './globals.css';

export const metadata: Metadata = {
    title: 'Skynet Defense System',
    description: 'Sistema de Defensa Global Skynet'
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
