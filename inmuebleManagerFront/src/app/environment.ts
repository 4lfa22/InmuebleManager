// Configuración de la API Backend
// IMPORTANTE: Actualiza BACKEND_NGROK_URL cada vez que reinicies ngrok
const BACKEND_NGROK_URL = 'https://a4c50be61d5f.ngrok-free.app';
const BACKEND_LOCAL_URL = 'http://localhost:8080';

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return BACKEND_NGROK_URL;
  }

  const hostname = window.location.hostname;

  // Si accedes desde Vercel (o cualquier dominio remoto), usa ngrok
  if (hostname.includes('vercel.app') || hostname.includes('ngrok')) {
    console.log('🌐 Acceso remoto - Backend URL:', BACKEND_NGROK_URL);
    return BACKEND_NGROK_URL;
  }

  // Para localhost
  console.log('💻 Acceso local - Backend URL:', BACKEND_LOCAL_URL);
  return BACKEND_LOCAL_URL;
}




