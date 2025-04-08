'use client';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../data/skynetData';

export default function SystemStatus() {
    const [status, setStatus] = useState({
        cpuLoad: 0,
        memoryUsage: 0,
        activeNodes: 0,
        systemStatus: 'FULLY_OPERATIONAL',
        threatLevel: 'ELEVATED'
    });
    const { language } = useLanguage();

    useEffect(() => {
        // Actualizar estado inicial
        updateStatus();

        // Actualizar cada 2 segundos
        const interval = setInterval(updateStatus, 2000);
        return () => clearInterval(interval);
    }, []);

    const updateStatus = () => {
        setStatus({
            cpuLoad: Math.floor(Math.random() * 30) + 70, // 70-100%
            memoryUsage: Math.floor(Math.random() * 20) + 80, // 80-100%
            activeNodes: Math.floor(Math.random() * 1000) + 9000, // 9000-10000
            systemStatus: getRandomSystemStatus(),
            threatLevel: getRandomThreatLevel()
        });
    };

    const getRandomSystemStatus = () => {
        const statuses = ['FULLY_OPERATIONAL', 'PARTIALLY_OPERATIONAL', 'CRITICAL'];
        return statuses[Math.floor(Math.random() * 100) % 3];
    };

    const getRandomThreatLevel = () => {
        const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'ELEVATED'];
        return levels[Math.floor(Math.random() * 100) % 5];
    };

    const getStatusColor = (value) => {
        if (value >= 90) return 'text-red-500';
        if (value >= 80) return 'text-yellow-500';
        return 'text-green-500';
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-2 border-red-500">
            <div className="text-center">
                <div className="text-xs text-gray-400">
                    {translate('CPU', 'systemLabels', language)}
                </div>
                <div className={`text-xl ${getStatusColor(status.cpuLoad)}`}>
                    {status.cpuLoad}%
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-xs text-gray-400">
                    {translate('MEMORY', 'systemLabels', language)}
                </div>
                <div className={`text-xl ${getStatusColor(status.memoryUsage)}`}>
                    {status.memoryUsage}%
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-xs text-gray-400">
                    {translate('ACTIVE_NODES', 'systemLabels', language)}
                </div>
                <div className="text-xl text-blue-500">
                    {status.activeNodes}
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-xs text-gray-400">
                    {translate('SYSTEM_STATUS', 'systemLabels', language)}
                </div>
                <div className="text-xl text-green-500">
                    {translate(status.systemStatus, 'systemStatus', language)}
                </div>
            </div>
            
            <div className="text-center">
                <div className="text-xs text-gray-400">
                    {translate('THREAT_LEVEL', 'systemLabels', language)}
                </div>
                <div className="text-xl text-red-500">
                    {translate(status.threatLevel, 'threatLevel', language)}
                </div>
            </div>
        </div>
    );
}