'use client';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-red-800/80 hover:bg-red-700 text-white py-1 px-3 rounded border border-red-600 text-xs uppercase tracking-wide mr-2 transition-all"
            title="Seleccionar idioma / Select language">
            <option value="es">🇪🇸 ES</option>
            <option value="en">🇺🇸 EN</option>
        </select>
    );
}
