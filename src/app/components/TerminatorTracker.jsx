'use client';
import { useState, useEffect } from 'react';
import { getRandomCoordInRadius, getCityFromCoords } from '../utils/handleCords';

export default function TerminatorTracker({ userLocation }) {
    const [terminators, setTerminators] = useState([]);

    useEffect(() => {
        const generateTerminators = async () => {
            const newTerminators = [];
            for(let i = 0; i < 5; i++) {
                const coords = getRandomCoordInRadius(
                    userLocation?.lat || 40.4168,
                    userLocation?.lon || -3.7038,
                    150
                );
                const [lat, lon] = coords;
                const city = await getCityFromCoords(lat, lon);
                
                newTerminators.push({
                    id: i,
                    position: coords,
                    location: city,
                    status: Math.random() > 0.2 ? 'ACTIVE' : 'INACTIVE'
                });
            }
            setTerminators(newTerminators);
        };

        generateTerminators();
    }, [userLocation]);

    return (
        <div className="border-2 border-red-500 p-4">
            <h2 className="text-xl mb-2">Terminator Units Status</h2>
            <div className="grid gap-2">
                {terminators.map((unit) => (
                    <div key={unit.id} className="flex justify-between">
                        <span>Unit T-{unit.id}</span>
                        <span>{unit.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
