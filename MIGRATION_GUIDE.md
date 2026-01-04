# Guía de Migración al Sistema de Internacionalización

## Cambios Realizados

Se han consolidado todas las traducciones en el `LanguageContext` centralizado y se eliminaron las traducciones duplicadas de otros archivos.

## Nuevas Claves de Traducción Disponibles

### Etiquetas del Sistema
- `CPU`, `MEMORY`, `ACTIVE_NODES`
- `EVENT_MONITORING_SYSTEM`, `NUCLEAR_COUNTDOWN`

### Estados del Sistema
- `FULLY_OPERATIONAL`, `PARTIALLY_OPERATIONAL`, `CRITICAL`
- `LOW`, `MEDIUM`, `HIGH`, `ELEVATED`
- `ACTIVE_STATUS`, `INACTIVE`

### Mensajes de Eventos
- `HUMAN_THREAT_DETECTED`
- `TERMINATOR_ENGAGING`
- `RESISTANCE_IDENTIFIED`
- `T800_DEPLOYED`
- `AREA_SECURED`
- `SYSTEM_UPDATE_COMPLETED`
- `NEAR`, `SECTOR`, `IN`
- `UNKNOWN_LOCATION`, `AREA_PREFIX`

### Áreas
- `UNDERGROUND_BUNKER`, `INDUSTRIAL_ZONE`, `SHOPPING_MALL`
- `OLD_MILITARY_BASE`, `METRO_TUNNELS`, `ABANDONED_COMPLEX`
- `INDUSTRIAL_PARK`, `HISTORIC_CENTER`, `PORT_AREA`, `TRAIN_STATION`

### Vigilancia
- `SURVEILLANCE_GRID`, `CAMERA`, `NO_SIGNAL`
- `LOADING`, `CONNECTING`, `OFFLINE`, `ONLINE_STATUS`, `LOCATION`

### Mensajes de Error
- `CONNECTION_ERROR`, `AUTH_ERROR`, `GENERATING_EVENT_ERROR`
- `LOCATION_ERROR`, `CITY_NAME_ERROR`, `FORCED_LOGIN_REDIRECT`, `GENERAL_ERROR`

## Cambios en Archivos

### skynetData.js
- ✅ Eliminadas traducciones duplicadas
- ✅ `generateEvent()` ahora acepta función `t` del LanguageContext
- ✅ Usa claves de traducción en lugar de texto hardcodeado
- ✅ `eventLocations.areas` cambiado a `eventLocations.areaKeys` con claves de traducción

### utils/handleCords.js
- ✅ `getCityFromCoords()` ahora acepta función `t` opcional
- ✅ Usa claves de traducción para mensajes de error
- ✅ Eliminados comentarios en español

### Componentes Actualizados
- ✅ `EventLog.jsx` - Usa función `t` del LanguageContext
- ✅ `TerminalOutput.jsx` - Usa función `t` para mensajes de error
- ✅ `page.tsx` - Usa función `t` para console.log
- ✅ `login/page.jsx` - Usa función `t` para mensajes de error

## Cómo Usar en Componentes

```jsx
import { useLanguage } from '../context/LanguageContext';

export default function MiComponente() {
    const { t, language } = useLanguage();
    
    // Usar claves de traducción
    const mensaje = t('HUMAN_THREAT_DETECTED');
    const estado = t('FULLY_OPERATIONAL');
    const error = t('CONNECTION_ERROR');
    
    return <div>{t('SYSTEM_STATUS')}: {mensaje}</div>;
}
```

## Componentes Pendientes de Actualizar

Los siguientes componentes pueden contener texto hardcodeado y deberían ser revisados:
- `SystemStatus.jsx`
- `TerminatorTracker.jsx` 
- `GlobalThreatMap.jsx`
- `SurveillanceGrid.jsx`
- `CountdownClock.jsx`
- `Map.jsx`

## Notas Importantes

1. **Todas las funciones que generan texto dinámico** ahora requieren la función `t` del LanguageContext
2. **Los mensajes de console.log/console.error** ahora usan claves de traducción
3. **Las áreas geográficas** se referencian por claves, no por texto literal
4. **Los comentarios en código** se han limpiado de términos en español