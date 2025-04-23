import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import LanguageSelector from './components/LanguageSelector';
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
                <LanguageProvider>
                    <nav className="p-4 flex justify-between items-center">
                        <h1 className="text-red-500 text-2xl font-bold">SKYNET</h1>
                        <div className="flex items-center space-x-4">
                            <LanguageSelector />
                        </div>
                    </nav>
                    {children}
                </LanguageProvider>
            </body>
        </html>
    );
}
