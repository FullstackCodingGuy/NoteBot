const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Define safe functions to expose to the renderer process
});
