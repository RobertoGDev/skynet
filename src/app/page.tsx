'use client';
import { useState, useEffect } from 'react';
import CountdownClock from './components/CountdownClock';
import GlobalThreatMap from './components/GlobalThreatMap';
import SurveillanceGrid from './components/SurveillanceGrid';
import SystemStatus from './components/SystemStatus';
import EventLog from './components/EventLog';
import TerminatorTracker from './components/TerminatorTracker';

export default function Home() {
    const [userLocation, setUserLocation] = useState({ latitude: 40.4168, longitude: -3.7038 });

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                }
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-black text-red-500 p-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold">SKYNET DEFENSE SYSTEM</h1>
                <SystemStatus />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EventLog />
                <GlobalThreatMap userLocation={userLocation} />
                <SurveillanceGrid />
                <CountdownClock />
                <TerminatorTracker userLocation={userLocation} />
            </div>
        </div>
    );
}
