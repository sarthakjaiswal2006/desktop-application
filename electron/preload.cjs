
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startTest: () => ipcRenderer.invoke("start-test"),
});
