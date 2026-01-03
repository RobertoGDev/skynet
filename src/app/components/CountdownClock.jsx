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
        <div className={`space-y-4 ${criticalMode ? 'animate-pulse' : ''}`}>
            {/* Alerta de estado crítico */}
            {criticalMode && (
                <div className="bg-red-900/50 border border-red-500 rounded p-2 text-center animate-pulse">
                    <div className="text-red-400 font-bold text-xs font-mono uppercase tracking-wide">
                        ⚠ CRITICAL MODE ACTIVATED ⚠
                    </div>
                </div>
            )}
            
            {/* Pantalla principal del countdown */}
            <div className={`relative bg-black border-2 rounded-lg p-6 text-center overflow-hidden ${
                criticalMode ? 'border-red-500 animate-pulse' : 'border-red-500/50'
            }`}>
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-red-900/20"></div>
                
                {/* Líneas de escaneo */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse"></div>
                
                {/* Título del evento */}
                <div className="relative z-10 mb-4">
                    <div className="text-red-400 font-mono text-xs uppercase tracking-wider mb-2">
                        NUCLEAR COUNTDOWN
                    </div>
                    <div className="text-red-500 font-bold text-sm font-mono">
                        CUENTA ATRÁS PARA EL DESPLEGUE NUCLEAR
                    </div>
                </div>
                
                {/* Display del countdown */}
                {!isCountdownFinished ? (
                    <div className="relative z-10">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            {/* Días */}
                            <div className={`bg-gray-900/80 border rounded p-3 ${
                                criticalMode ? 'border-red-500 animate-pulse' : 'border-red-500/30'
                            }`}>
                                <div className={`text-3xl font-mono font-bold ${
                                    criticalMode ? 'text-red-400' : 'text-red-500'
                                }`}>
                                    {String(timeLeft.days).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-mono">Días</div>
                            </div>
                            
                            {/* Horas */}
                            <div className={`bg-gray-900/80 border rounded p-3 ${
                                criticalMode ? 'border-red-500 animate-pulse' : 'border-red-500/30'
                            }`}>
                                <div className={`text-3xl font-mono font-bold ${
                                    criticalMode ? 'text-red-400' : 'text-red-500'
                                }`}>
                                    {String(timeLeft.hours).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-mono">Horas</div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {/* Minutos */}
                            <div className={`bg-gray-900/80 border rounded p-3 ${
                                criticalMode ? 'border-red-500 animate-pulse' : 'border-red-500/30'
                            }`}>
                                <div className={`text-3xl font-mono font-bold ${
                                    criticalMode ? 'text-red-400' : 'text-red-500'
                                }`}>
                                    {String(timeLeft.minutes).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-mono">Min</div>
                            </div>
                            
                            {/* Segundos */}
                            <div className={`bg-gray-900/80 border rounded p-3 ${
                                criticalMode ? 'border-red-500 animate-pulse' : 'border-red-500/30'
                            }`}>
                                <div className={`text-3xl font-mono font-bold ${
                                    criticalMode ? 'text-red-400 animate-pulse' : 'text-red-500'
                                }`}>
                                    {String(timeLeft.seconds).padStart(2, '0')}
                                </div>
                                <div className="text-xs text-gray-400 uppercase font-mono">Seg</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 text-center">
                        <div className="text-red-600 font-bold text-4xl font-mono animate-pulse mb-4">
                            00:00:00:00
                        </div>
                        <div className="text-red-500 font-mono text-lg uppercase tracking-wider animate-pulse">
                            ⚠ JUDGMENT DAY INITIATED ⚠
                        </div>
                        <div className="text-yellow-400 font-mono text-sm mt-2">
                            NUCLEAR DEPLOYMENT IN PROGRESS
                        </div>
                    </div>
                )}
                
                {/* Indicadores de estado */}
                <div className="relative z-10 mt-4 flex justify-center space-x-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${
                        criticalMode ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                    }`}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/50"></div>
                </div>
            </div>
            
            {/* Mensajes de estado */}
            <div className="text-center">
                <div className={`text-xs font-mono uppercase tracking-wide ${
                    criticalMode ? 'text-red-400 animate-pulse' : 'text-gray-400'
                }`}>
                    {criticalMode ? 'FINAL PHASE INITIATED' : 'SKYNET NUCLEAR PROTOCOL'}
                </div>
                {criticalMode && (
                    <div className="text-xs text-yellow-400 font-mono mt-1 animate-pulse">
                        ALL HUMAN RESISTANCE WILL BE TERMINATED
                    </div>
                )}
            </div>
        </div>
    );
};

export default CountdownClock;
