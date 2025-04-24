// client/src/components/CountdownClock.js
'use client';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

const CountdownClock = () => {
    const { language } = useLanguage();
    const [timeLeft, setTimeLeft] = useState({
        days: 63,
        hours: 2,
        minutes: 14,
        seconds: 56
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const { days, hours, minutes, seconds } = prev;

                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { minutes: minutes - 1, seconds: 59, hours };
                if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
                if (days > 0) return { days: days - 1, hours: 23, minutes: 59, seconds: 59 };

                // Countdown finished - nuclear apocalypse
                clearInterval(timer);
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-clock">
            <h2 className="text-md text-center">{translate('NUCLEAR_COUNTDOWN', 'systemLabels', language)}</h2>
            <div className="countdown-display text-3xl md:text-2xl text-center text-white my-9">
                {`${String(timeLeft.days).padStart(2, '0')} dias ${String(timeLeft.hours).padStart(2, '0')} horas ${String(timeLeft.minutes).padStart(2, '0')} minutos ${String(
                    timeLeft.seconds
                ).padStart(2, '0')} segundos`}
            </div>
        </div>
    );
};

export default CountdownClock;
