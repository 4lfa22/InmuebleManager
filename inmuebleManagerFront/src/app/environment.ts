// Configuración de la API para Dual ngrok Setup
// Para cambiar las URLs, modifica estas constantes:
const BACKEND_NGROK_URL = 'https://a4c50be61d5f.ngrok-free.app';
const BACKEND_LOCAL_URL = 'http://localhost:8080';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return BACKEND_NGROK_URL;
  }

  const hostname = window.location.hostname;

  // Si accedes desde ngrok, usa la URL ngrok del backend
  if (hostname.includes('ngrok')) {
    console.log('✅ Backend URL:', BACKEND_NGROK_URL);
    return BACKEND_NGROK_URL;
  }

  // Para localhost
  console.log('✅ Backend URL:', BACKEND_LOCAL_URL);
  return BACKEND_LOCAL_URL;
}




