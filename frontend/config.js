export const CONFIG = {
  BACKEND_ADDRESS: process.env.RENDER_EXTERNAL_URL || 'http://localhost:5001',
  SOCKET_URL: (process.env.RENDER_EXTERNAL_URL || 'ws://localhost:5001').replace(/^http/, 'ws')
};


/** 
 *export const CONFIG = {
  BACKEND_ADDRESS: process.env.RENDER_EXTERNAL_URL || 'http://localhost:5001',
  SOCKET_URL: (process.env.RENDER_EXTERNAL_URL || 'ws://localhost:5001').replace(/^http/, 'ws')
};
*/