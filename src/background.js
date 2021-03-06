"use strict";

import { app, protocol, BrowserWindow, ipcMain, Menu, dialog } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import * as localShortcut from "electron-localshortcut";

import { MainConfigFileAccessor } from "./modules/mainConfigFileAccessor";
import { ProfileConfigFileAccessor } from "./modules/profileConfigFileAccessor";

const isDevelopment = process.env.NODE_ENV !== "production";
let pomodoroWindow = undefined;
let preferenceWindow = undefined;

// To save hardware resource.
app.disableHardwareAcceleration();

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createPomodoroWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#000000",
    // Set window size
    width: 230,
    height: 240,
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

  win.on("close", () => {
    app.quit();
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "pomodoro");
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./pomodoro.html");
  }

  return win;
}

async function createPreferenceWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    show: false,
    backgroundColor: "#000000",
    // Set window size
    width: 200 + 370 * 2, // short column 200px, long column 370 px
    height: 230 + 30 + 450,
    frame: false,
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
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "preference");
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./preference.html");
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
      {
        label: "Preferences",
        click: async () => {
          preferenceWindow = await createPreferenceWindow();
        },
      },
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

ipcMain.on("notify-config-change", (/* event, arg */) => {
  pomodoroWindow.webContents.send("notify-config-change");
});

ipcMain.on("notify-temporary-change", (event, arg) => {
  pomodoroWindow.webContents.send("notify-temporary-change", arg);
});

ipcMain.on("close-preference", (event, arg) => {
  const SAVE = 0;
  const DO_NOT_SAVE = 1;
  const CANCEL = 2;
  let selected = DO_NOT_SAVE;

  // If no unsaved changes, simply close.
  if (Object.keys(arg).length === 0) {
    preferenceWindow.close();
    return;
  }

  // Handle unsaved changes.
  const options = {
    type: "warning",
    message: "Unsaved changes are found.",
    detail: "Do you save the changes?",
    buttons: ["Save", "Don't Save", "Cancel"],
  };
  selected = dialog.showMessageBoxSync(options);
  if (selected === CANCEL) {
    return;
  }
  // If user want to save the unsaved changes, save it.
  if (selected === SAVE) {
    const mainConfigFileAccessor = new MainConfigFileAccessor();
    const profileName = mainConfigFileAccessor.getCurrentProfileName();
    const profileConfigFileAccessor = new ProfileConfigFileAccessor(
      profileName
    );
    Object.entries(arg).forEach(([key, value]) => {
      profileConfigFileAccessor.set(key, value);
    });
  }
  preferenceWindow.close();

  // Notify reload config file.
  pomodoroWindow.webContents.send("notify-config-change");
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit();
});

app.on("activate", async () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (typeof pomodoroWindow === "undefined") {
    pomodoroWindow = await createPomodoroWindow();
  }
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
  pomodoroWindow = await createPomodoroWindow();

  // Register shortcuts.
  localShortcut.register(pomodoroWindow, "Command+R", () => {
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
