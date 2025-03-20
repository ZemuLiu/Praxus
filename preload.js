// preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Enhanced IPC handling with timeout and error handling
contextBridge.exposeInMainWorld('electronAPI', {
  callPraxus: async (channel, data) => {
    try {
      // Add timeout to prevent hanging
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('IPC Request timeout')), 30000)
      );

      const response = await Promise.race([
        ipcRenderer.invoke('call-praxus', {
          channel,
          data,
          timestamp: Date.now()
        }),
        timeout
      ]);

      return response;
    } catch (error) {
      console.error('IPC Error:', error);
      throw error;
    }
  }
});
