// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.loadURL('http://localhost:3000'); // Vite dev server URL
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('call-praxus', async (event, prompt) => {
  return new Promise((resolve, reject) => {
    exec(`python ${path.join(__dirname, 'python/ai.py')} "${prompt}"`, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
});