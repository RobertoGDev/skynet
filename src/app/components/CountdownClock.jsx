// client/src/components/CountdownClock.js
'use client';
import React, { useState, useEffect } from 'react';

const CountdownClock = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 63,
        hours: 2,
        minutes: 14,
        seconds: 56
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                const { days, hours, minutes, seconds } = prevTime;

                if (seconds > 0) {
                    return { ...prevTime, seconds: seconds - 1 };
                }
                if (minutes > 0) {
                    return { days, hours, minutes: minutes - 1, seconds: 59 };
                }
                if (hours > 0) {
                    return { days, hours: hours - 1, minutes: 59, seconds: 59 };
                }
                if (days > 0) {
                    return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };
                }

                // Countdown finished
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    
    // Calcular modo crítico directamente del estado actual
    const criticalMode = timeLeft.days === 0 && timeLeft.hours < 24;
    const isCountdownFinished = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

    return (
        <div className="h-full p-4 space-y-4">
            {/* Display digital del countdown - estilo de la imagen */}
                {!isCountdownFinished ? (
                    <div className="relative">
                        {/* Fondo del display */}
                        <div className="bg-black border-2 border-red-500/50 rounded-lg px-8 py-6 relative overflow-hidden">
                            {/* Efecto de brillo interno */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-red-500/5 to-red-900/10"></div>

                            {/* Números del countdown */}
                            <div className="relative z-10 flex items-center justify-center space-x-2">
                                {/* Días */}
                                <div
                                    className={`text-5xl font-mono font-bold tracking-wider ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
                                        fontFamily: 'monospace'
                                    }}>
                                    {String(timeLeft.days).padStart(2, '0')}
                                </div>

                                {/* Separador : */}
                                <div
                                    className={`text-5xl font-mono font-bold ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 15px rgba(255, 0, 0, 0.6)'
                                    }}>
                                    :
                                </div>

                                {/* Horas */}
                                <div
                                    className={`text-5xl font-mono font-bold tracking-wider ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
                                        fontFamily: 'monospace'
                                    }}>
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </div>

                                {/* Separador : */}
                                <div
                                    className={`text-5xl font-mono font-bold ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 15px rgba(255, 0, 0, 0.6)'
                                    }}>
                                    :
                                </div>

                                {/* Minutos */}
                                <div
                                    className={`text-5xl font-mono font-bold tracking-wider ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
                                        fontFamily: 'monospace'
                                    }}>
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </div>

                                {/* Separador : */}
                                <div
                                    className={`text-5xl font-mono font-bold ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 15px rgba(255, 0, 0, 0.6)'
                                    }}>
                                    :
                                </div>

                                {/* Segundos */}
                                <div
                                    className={`text-5xl font-mono font-bold tracking-wider ${criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'}`}
                                    style={{
                                        textShadow: '0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.4)',
                                        fontFamily: 'monospace'
                                    }}>
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </div>
                            </div>

                            {/* Líneas de escaneo */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
                        </div>

                        {/* Alerta de modo crítico */}
                        {criticalMode && (
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-900/80 px-4 py-1 rounded border border-red-500 animate-pulse">
                                <div className="text-red-400 font-mono text-xs uppercase tracking-wide">⚠ CRITICAL MODE ⚠</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center">
                        <div
                            className="text-red-600 font-bold text-6xl font-mono animate-pulse mb-4"
                            style={{
                                textShadow: '0 0 30px rgba(255, 0, 0, 1)',
                                fontFamily: 'monospace'
                            }}>
                            00:00:00:00
                        </div>
                        <div className="text-red-500 font-mono text-lg uppercase tracking-wider animate-pulse">⚠ JUDGMENT DAY INITIATED ⚠</div>
                        <div className="text-yellow-400 font-mono text-sm mt-2">NUCLEAR DEPLOYMENT IN PROGRESS</div>
                    </div>
                )}
        </div>
    );
};

export default CountdownClock;
