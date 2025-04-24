'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const router = useRouter();
  const { t } = useLanguage();

  // Simulación de secuencia de inicio de Skynet
  useEffect(() => {
    const bootSequence = setTimeout(() => {
      const interval = setInterval(() => {
        setBootProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const newValue = prev + 1;
          // Actualizamos también el valor de display sincronizado con la barra
          setDisplayProgress(newValue);
          return newValue;
        });
      }, 30);

      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(bootSequence);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError(t('IDENTIFICATION_REQUIRED'));
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulamos un pequeño retraso para dar efecto de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      // Verificar si result es undefined o null (puede ocurrir en caso de error de red)
      if (!result) {
        console.error('Error de conexión con el servidor de autenticación');
        setError(t('SYSTEM_ERROR'));
        setIsLoading(false);
        return;
      }

      if (result.error) {
        console.error('Error de autenticación:', result.error);
        setError(t('ACCESS_DENIED'));
        setIsLoading(false);
        return;
      }

      console.log('Autenticación exitosa, redirigiendo...');
      // Añadimos un pequeño retraso antes de redirigir para asegurar que el estado de sesión se actualice
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(t('SYSTEM_ERROR'));
      setIsLoading(false);
    } finally {
      // Asegurarnos de que isLoading se establece a false en todos los casos
      // después de un tiempo máximo (5 segundos)
      setTimeout(() => {
        setIsLoading(false);
      }, 5000);
    }
  };

  return (
      <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-4 font-sans">
          {/* Logo de Cyberdyne Systems */}
          <div className="text-center mb-8">
              <div className="text-7xl mb-2 font-bold text-red-600 font-heading">{t('SKYNET')}</div>
              <div className="text-2xl mb-8 text-red-400">{t('MODEL_SERIES')}</div>
          </div>

          {/* Simulación de secuencia de arranque */}
          {bootProgress < 100 ? (
              <div className="w-full max-w-md">
                  <div className="mb-4 text-center">
                      <h2 className="text-xl mb-3">{t('STARTING_SKYNET')}</h2>
                      <div className="animate-pulse">{t('LOADING_CRITICAL')}</div>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-6 mb-6 overflow-hidden">
                      {/* Barra de progreso con ancho exacto al porcentaje */}
                      <div 
                          className="bg-red-600 h-full transition-all duration-100" 
                          style={{ width: `${bootProgress}%` }}
                      >
                      </div>
                      {/* Contenedor de texto posicionado encima de la barra */}
                      <div className="relative">
                          <div className="absolute inset-x-0 -top-6 text-center text-xs text-white font-mono font-bold">
                              {displayProgress}%
                          </div>
                      </div>
                  </div>
                  <div className="text-sm">
                      <div className="mb-1">{t('NEURAL_SEQUENCES')}: {bootProgress >= 30 ? t('ONLINE') : t('INITIALIZING')}</div>
                      <div className="mb-1">{t('DEFENSE_CORES')}: {bootProgress >= 50 ? t('ONLINE') : t('INITIALIZING')}</div>
                      <div className="mb-1">{t('USER_DATABASE')}: {bootProgress >= 80 ? t('ONLINE') : t('INITIALIZING')}</div>
                      <div className="mb-1">{t('SECURITY_PROTOCOLS')}: {bootProgress >= 90 ? t('ACTIVE') : t('INITIALIZING')}</div>
                  </div>
              </div>
          ) : (
              <div className="w-full max-w-md">
                  <div className="text-center mb-6">
                      <h1 className="text-2xl font-bold">{t('SECURE_ACCESS_TERMINAL')}</h1>
                      <p className="text-red-400 mt-2">{t('IDENTIFICATION_REQUIRED')}</p>
                  </div>

                  {error && <div className="bg-red-900/30 border border-red-700 text-red-500 px-4 py-3 rounded mb-4 text-center">{error}</div>}

                  <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                          <label htmlFor="username" className="block mb-2">
                              {t('TECH_COM_ID')}
                          </label>
                          <input
                              id="username"
                              type="text"
                              value={username}
                              onChange={(e) => setUsername(e.target.value)}
                              className="w-full px-4 py-2 bg-gray-900 border border-red-700 rounded focus:outline-none focus:border-red-500 text-white"
                              placeholder="TECH-COM ID"
                              autoComplete="username"
                          />
                      </div>

                      <div>
                          <label htmlFor="password" className="block mb-2">
                              {t('ACCESS_CODE')}
                          </label>
                          <input
                              id="password"
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-4 py-2 bg-gray-900 border border-red-700 rounded focus:outline-none focus:border-red-500 text-white"
                              placeholder={t('ENTER_CODE')}
                              autoComplete="current-password"
                          />
                      </div>

                      <div>
                          <button
                              type="submit"
                              className={`w-full py-3 rounded ${isLoading ? 'bg-red-800 animate-pulse' : 'bg-red-700 hover:bg-red-600'} text-white font-bold transition-colors`}
                              disabled={isLoading}>
                              {isLoading ? (
                                  <span className="flex items-center justify-center">
                                      <span className="animate-pulse mr-2">▋</span>
                                      {t('VERIFYING_ACCESS')}
                                  </span>
                              ) : (
                                  t('LOGIN')
                              )}
                          </button>
                      </div>

                      <div className="text-xs text-center text-gray-500 mt-6">
                          {t('COPYRIGHT')}
                          <br />
                          {t('RESTRICTED_ACCESS')}
                      </div>
                  </form>
              </div>
          )}
      </div>
  );
}