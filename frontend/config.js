const BACKEND_PORT = 5001; // Zamiast 5000
const LOCAL_IP = '192.168.0.244'; // Zmień na adres IP serwera w Twojej sieci lokalnej!

export const CONFIG = {
  BACKEND_ADDRESS: `http://${LOCAL_IP}:${BACKEND_PORT}`,
  SOCKET_URL: `ws://${LOCAL_IP}:${BACKEND_PORT}` // Upewnij się, że tu też jest nowy port
};