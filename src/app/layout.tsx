import type { Metadata } from 'next';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './components/AuthProvider';
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
                <AuthProvider>
                    <LanguageProvider>
                        <nav className="p-4 flex flex-col md:flex-row justify-between items-center">
                            <h1 className="text-red-500 text-md font-bold">CYBERDINE SYSTEMS</h1>
                            <div className="flex items-center space-x-4">
                                <LanguageSelector />
                            </div>
                        </nav>
                        {children}
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
