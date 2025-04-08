'use client';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
    const { language, setLanguage } = useLanguage();

    return (
        <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)} 
            className="bg-black text-red-500 border border-red-500"
        >
            <option value="es">Español</option>
            <option value="en">English</option>
        </select>
    );
}
