#!/bin/bash

echo "🔧 Configurando servidores Skynet TTS..."

# Limpiar procesos anteriores
echo "🧹 Limpiando procesos anteriores..."
pkill -f proxy-server.js
pkill -f "next dev"
sleep 2

# Verificar que los puertos estén libres
echo "🔍 Verificando puertos..."
if lsof -Pi :3200 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Puerto 3200 ocupado"
    lsof -ti:3200 | xargs kill -9
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "❌ Puerto 3000 ocupado"  
    lsof -ti:3000 | xargs kill -9
fi

echo "🚀 Iniciando servidor proxy TTS..."
cd /home/rgdevelop/proyectos_linux/desarrollos/skynet/client
nohup node proxy-server.js > proxy.log 2>&1 &
PROXY_PID=$!

sleep 3

echo "🌐 Iniciando servidor Next.js..."
nohup npm run dev > nextjs.log 2>&1 &
NEXTJS_PID=$!

sleep 5

echo "🧪 Probando conexiones..."

# Probar proxy
if curl -s -f -X GET http://localhost:3200/ > /dev/null; then
    echo "✅ Proxy TTS funcionando en puerto 3200"
else
    echo "❌ Proxy TTS no responde"
fi

# Probar Next.js
if curl -s -f -X GET http://localhost:3000/ > /dev/null; then
    echo "✅ Next.js funcionando en puerto 3000"
else
    echo "❌ Next.js no responde"
fi

echo ""
echo "🎮 Servidores iniciados:"
echo "   📡 Proxy TTS (PID: $PROXY_PID): http://localhost:3200"
echo "   🌐 Next.js (PID: $NEXTJS_PID): http://localhost:3000"
echo ""
echo "🎯 Accede a: http://localhost:3000/dashboard"
echo ""
echo "📋 Para ver logs:"
echo "   tail -f proxy.log"
echo "   tail -f nextjs.log"
echo ""
echo "⛔ Para detener:"
echo "   kill $PROXY_PID $NEXTJS_PID"