// Configuración de la API Backend
const BACKEND_LOCAL_URL = 'http://localhost:8080';
// TODO: Cuando despliegues el backend en producción, configura esta URL
const BACKEND_PRODUCTION_URL = 'https://tu-backend-en-produccion.com';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return BACKEND_LOCAL_URL;
  }

  const hostname = window.location.hostname;

  // Si accedes desde Vercel (producción), usa el backend en producción
  if (hostname.includes('vercel.app')) {
    console.log('🌐 Acceso desde Vercel - Backend URL:', BACKEND_PRODUCTION_URL);
    return BACKEND_PRODUCTION_URL;
  }

  // Para localhost (desarrollo)
  console.log('💻 Acceso local - Backend URL:', BACKEND_LOCAL_URL);
  return BACKEND_LOCAL_URL;
}




