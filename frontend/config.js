const BACKEND_PORT = 5001;
const LOCAL_IP = '192.168.0.244';

export const CONFIG = {
  BACKEND_ADDRESS: `http://${LOCAL_IP}:${BACKEND_PORT}`,
  SOCKET_URL: `ws://${LOCAL_IP}:${BACKEND_PORT}` // To jest nieużywane przez Socket.IO client v3+
};