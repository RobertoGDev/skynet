#!/bin/bash

echo "🚀 Iniciando servidores Skynet TTS..."

# Matar procesos anteriores
pkill -f proxy-server.js
pkill -f "next dev"

echo "📡 Iniciando servidor proxy TTS en puerto 3200..."
cd /home/rgdevelop/proyectos_linux/desarrollos/skynet/client
node proxy-server.js &

sleep 2

echo "🌐 Iniciando servidor Next.js en puerto 3005..."
PORT=3005 npm run dev &

echo "✅ Servidores iniciados:"
echo "   - Proxy TTS: http://localhost:3200"
echo "   - Frontend: http://localhost:3005"
echo ""
echo "🎮 Accede a: http://localhost:3005/dashboard"
echo ""
echo "Para detener los servidores, usa Ctrl+C"

wait