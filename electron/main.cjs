
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;
let testStarted = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Newton Athena",

    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadURL("http://localhost:5173");

  // Block Escape and browser-back shortcuts during the test.
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (!testStarted || input.type !== "keyDown") return;

    if (
      input.key === "Escape" ||
      (input.alt && input.key === "ArrowLeft") ||
      input.key === "BrowserBack"
    ) {
      event.preventDefault();
    }
  });

  // Restore fullscreen if the window leaves fullscreen during the test.
  mainWindow.on("leave-full-screen", () => {
    if (testStarted && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.setKiosk(true);
      mainWindow.setFullScreen(true);
    }
  });

  // Prevent closing the window while the test is running.
  mainWindow.on("close", (event) => {
    if (testStarted) {
      event.preventDefault();
    }
  });
}

// Start the test in fullscreen and kiosk mode.
ipcMain.handle("start-test", () => {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return false;
  }

  testStarted = true;

  mainWindow.setFullScreen(true);
  mainWindow.setKiosk(true);

  return true;
});

// End the test and close the application.
ipcMain.handle("end-test", () => {
  testStarted = false;
  app.quit();

  return true;
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
