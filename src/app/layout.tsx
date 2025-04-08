import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "./context/LanguageContext";
import LanguageSelector from './components/LanguageSelector';
import 'leaflet/dist/leaflet.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skynet Defense System",
  description: "Sistema de Defensa Global Skynet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
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

