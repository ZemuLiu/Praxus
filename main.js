// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

// Create or get the application directory for storing app data
const getAppDataPath = () => {
  const userDataPath = app.getPath('userData');
  const appDataPath = path.join(userDataPath, 'PraxusData');
  
  if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath, { recursive: true });
  }
  
  return appDataPath;
};

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // In development, load the Vite dev server
  // In production, load the built app
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:3000'); // Vite dev server URL
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  return win;
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Handle IPC calls to the Python backend
ipcMain.handle('call-praxus', async (event, request) => {
  const { channel, data } = request;
  
  return new Promise((resolve, reject) => {
    try {
      // Determine Python path (use system Python for now)
      const pythonPath = 'python'; // or specify absolute path
      
      // Path to the AI script
      const scriptPath = path.join(__dirname, 'python/ai.py');
      
      // Convert data to a JSON string if it's an object
      const dataString = typeof data === 'object' ? JSON.stringify(data) : data;
      
      // Spawn Python process
      const pythonProcess = spawn(pythonPath, [scriptPath, channel, dataString]);
      
      let stdoutData = '';
      let stderrData = '';
      
      // Collect stdout data
      pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
      });
      
      // Collect stderr data
      pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          // Process completed successfully
          resolve(stdoutData);
        } else {
          // Process failed
          reject(stderrData || `Python process exited with code ${code}`);
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (err) => {
        reject(`Failed to start Python process: ${err.message}`);
      });
      
    } catch (error) {
      reject(`Error in IPC handler: ${error.message}`);
    }
  });
});
