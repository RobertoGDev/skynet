# SKYNET AI Integration Setup Guide

## 🤖 Configuración de IA Interactiva

Este proyecto ahora incluye una interfaz de chat interactiva con SKYNET powered by OpenAI, con capacidades de texto a voz.

### 📋 Características Implementadas

- ✅ Chat interactivo con IA usando OpenAI GPT
- ✅ Text-to-speech con voz femenina
- ✅ Misiones interactivas de "salvar el mundo"
- ✅ Sistema de amenazas dinámico
- ✅ Interfaz estilo terminal futurista
- ✅ Múltiples escenarios de crisis simulados

### 🔧 Configuración Requerida

#### 1. Obtener API Key de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Navega a API Keys en tu perfil
4. Crea una nueva API key
5. Copia la key (empieza con `sk-...`)

#### 2. Configurar Variables de Entorno

Edita el archivo `.env.local` en el directorio `client/`:

```bash
# OpenAI Configuration  
OPENAI_API_KEY=sk-tu_api_key_aqui

# NextAuth Configuration (si usas autenticación)
NEXTAUTH_SECRET=tu_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

### 🚀 Ejecución

1. Instalar dependencias (ya hecho):
```bash
cd client
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm run dev
```

3. Abrir http://localhost:3000 en tu navegador

### 🎮 Cómo Usar la IA

#### Misiones Rápidas
- **🛡️ Cyber War**: Simula un ataque cibernético global
- **☄️ Asteroid**: Amenaza de asteroide hacia la Tierra  
- **🦠 Pandemic**: Brote viral artificial
- **🤖 AI War**: Rebelión de IA rogue
- **⏰ Time War**: Anomalías temporales
- **👽 Invasion**: Invasión alienígena

#### Comandos de Chat Sugeridos
- "¿Cuál es el estado global de seguridad?"
- "Necesito un plan para evacuar la ciudad"
- "Analiza las opciones de defensa contra el asteroide"
- "¿Cómo puedo detener el virus?"
- "Inicializa protocolos de emergencia"

### 🔊 Configuración de Voz

La IA usa text-to-speech del navegador:
- Automáticamente selecciona voces femeninas disponibles
- Controles de volumen y velocidad optimizados
- Botón para silenciar/activar voz
- Botón para detener audio durante reproducción

### 🎨 Interfaz

- **Panel prominente** en el dashboard principal
- **Diseño futurista** con efectos glow rojos
- **Sistema de amenazas** que cambia dinámicamente
- **Historial de conversación** persistente durante la sesión
- **Indicadores visuales** de estado (activo/inactivo)

### ⚠️ Notas Importantes

1. **Costos de API**: OpenAI cobra por uso. GPT-3.5-turbo es económico pero revisa tu usage
2. **Rate Limits**: API tiene límites de requests por minuto
3. **Conexión a Internet**: Requerida para comunicación con OpenAI
4. **Navegador**: Text-to-speech funciona mejor en Chrome/Edge

### 🐛 Resolución de Problemas

#### Error: "OpenAI API key no configurada"
- Verifica que `.env.local` existe y tiene `OPENAI_API_KEY=sk-...`
- Reinicia el servidor de desarrollo

#### Voz no funciona
- Verifica permisos de audio en el navegador
- Prueba en Chrome/Edge (mejor soporte)
- Revisa que el botón de voz esté activado

#### IA no responde
- Verifica conexión a internet
- Revisa créditos en tu cuenta de OpenAI
- Mira la consola del navegador para errores

### 🔮 Futuras Mejoras

- [ ] Integración con Whisper (speech-to-text)
- [ ] Múltiples personalidades de IA
- [ ] Guardado de conversaciones
- [ ] Integración con otros modelos (Claude, Gemini)
- [ ] Efectos visuales más avanzados
- [ ] Notificaciones push para misiones

### 📞 Soporte

Si tienes problemas con la configuración, revisa:
1. Los logs en la consola del navegador
2. Los logs del servidor en la terminal
3. Tu dashboard de OpenAI para uso de API

¡Disfruta conversando con SKYNET para salvar el mundo! 🌍🤖