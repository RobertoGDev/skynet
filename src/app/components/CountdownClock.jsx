// client/src/components/CountdownClock.js
'use client';
import React, { useState, useEffect } from 'react';

const CountdownClock = () => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 2,
        minutes: 14,
        seconds: 56
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const { hours, minutes, seconds } = prev;

                if (seconds > 0) return { ...prev, seconds: seconds - 1 };
                if (minutes > 0) return { minutes: minutes - 1, seconds: 59, hours };
                if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };

                // Countdown finished - nuclear apocalypse
                clearInterval(timer);
                return { hours: 0, minutes: 0, seconds: 0 };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="countdown-clock">
            <h2>NUCLEAR COUNTDOWN</h2>
            <div className="countdown-display">{`${timeLeft.hours.toString().padStart(2, '0')}:${timeLeft.minutes.toString().padStart(2, '0')}:${timeLeft.seconds.toString().padStart(2, '0')}`}</div>
        </div>
    );
};

export default CountdownClock;
