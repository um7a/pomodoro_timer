"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as localShortcut from "electron-localshortcut";
const isDevelopment = process.env.NODE_ENV !== "production";

app.disableHardwareAcceleration();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#000000",
    // Set window size
    width: 230,
    height: 230 + 30, // pomodoro + preference
    // Set position of window
    x: 30,
    y: 60,
    frame: false,
    titleBarStyle: "customButtonsOnHover",
    maximizable: false,
    resizable: isDevelopment ? true : false,
    webPreferences: {
      // The following nodeIntegration and contextIsolation are settings
      // to use common js module from electron.
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.once("ready-to-show", () => {
    win.show();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
  return win;
}

// Set menu
const template = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: "about", label: `About ${app.name}` },
      { type: "separator" },
      { role: "hide", label: `Hide ${app.name}` },
      { role: "hideothers", label: "Hide Others" },
      { role: "unhide", label: "Show All" },
      { role: "minimize", label: "Minimize" },
      { type: "separator" },
      { role: "quit", label: `Quit ${app.name}` },
    ],
  },
]);
Menu.setApplicationMenu(template);

ipcMain.on("open-preference", (/* event, arg */) => {
  const win = BrowserWindow.getAllWindows()[0];
  const currentSize = win.getSize();
  win.setSize(
    currentSize[0] + 370 * 2, // width (1 column = 370 px)
    currentSize[1] + 450, // height
    true // animate
  );
});

ipcMain.on("close-preference", (/* event, arg */) => {
  const win = BrowserWindow.getAllWindows()[0];
  const currentSize = win.getSize();
  win.setSize(
    currentSize[0] - 370 * 2, // width (1 column = 370 px)
    currentSize[1] - 450, // height
    true // animate
  );
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  const win = createWindow();

  // Register shortcuts.
  localShortcut.register(win, "Command+R", () => {
    // Note that the following console.log is printed not to electron window's development tool
    // but the console which executes npm run serve.
    console.log("Command+R is passed: This shortcut is disabled.");
  });
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
