const { app, BrowserWindow } = require("electron");
const path = require("path");
require("dotenv").config();

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"), // Optional: Securely preload scripts
    },
  });
  console.log("process.env: ", process.env.NODE_ENV);
  // mainWindow.loadFile("electron/src/index.html");
  // Load React app in production or development mode
  if (process.env.NODE_ENV === "Development") {
    mainWindow.loadURL(
      process.env.APP_URL
      // "http://localhost:3000"
    ); // React dev server
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html")); // Production build
  }
});
