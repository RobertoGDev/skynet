'use client';

import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';

export default function AudioToggleButton() {
  const { isPlaying, toggleAudio } = useAudio();
  const { t } = useLanguage();

  return (
    <button
      onClick={toggleAudio}
      className={`px-3 py-1 rounded border text-xs uppercase tracking-wide mr-2 transition-all ${
        isPlaying 
          ? 'bg-green-800/80 hover:bg-green-700 text-white border-green-600 glow-green' 
          : 'bg-red-800/80 hover:bg-red-700 text-white border-red-600 glow-red'
      }`}
      title={isPlaying ? t('AUDIO_ON') : t('AUDIO_OFF')}
    >
      {isPlaying ? '🔊' : '🔇'} {isPlaying ? 'ON' : 'OFF'}
    </button>
  );
}