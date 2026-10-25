
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  startTest: () => ipcRenderer.invoke("start-test"),
  endTest: () => ipcRenderer.invoke("end-test"),
});
