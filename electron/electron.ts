import { app, BrowserWindow, ipcMain, Menu, powerMonitor } from "electron";
import path from "path";
import { MainConfigFileAccessor } from "./config/mainConfigFileAccessor";
import { ProfileConfigFileAccessor } from "./config/profileConfigFileAccessor";

let mainWindow: BrowserWindow | undefined;
let preferenceWindow: BrowserWindow | undefined;

console.log(`Load main config file.`);
const mainConfigFileAccessor = new MainConfigFileAccessor();
if (!mainConfigFileAccessor.isMainConfigFormat()) {
  console.warn(
    `Main config file is invalid format. Delete and create new one.`
  );
  mainConfigFileAccessor.deleteMainConfigFile();
  mainConfigFileAccessor.createNewMainConfigFile();
}

console.log(`Load current profile config file.`);
const currentProfileName = mainConfigFileAccessor.getCurrentProfileName();
if (typeof currentProfileName === "undefined") {
  throw new Error(`Failed to get current profile name from main config file.`);
}

console.log(`Validate profile config files.`);
let profileConfigFileAccessor: ProfileConfigFileAccessor | undefined;
const profileList = ProfileConfigFileAccessor.GetProfileNames();
profileList.forEach((profileName) => {
  profileConfigFileAccessor = new ProfileConfigFileAccessor(profileName);
  if (!profileConfigFileAccessor.isProfileConfigFormat()) {
    console.warn(
      `Profile config file ${profileName} is invalid format. Delete.`
    );
    profileConfigFileAccessor.deleteProfileConfigFile();

    // If current profile is invalid, create new.
    if (profileName === currentProfileName) {
      console.warn(
        `Current profile config file ${profileName} is deleted. Create new one.`
      );
      profileConfigFileAccessor.createNewProfileConfigFile();
    }
  }
});

console.log(`Load current profile config file.`);
const currentProfileConfigFileAccessor = new ProfileConfigFileAccessor(
  currentProfileName
);
if (currentProfileConfigFileAccessor.profileConfigFileExists() === false) {
  currentProfileConfigFileAccessor.save();
}

console.log(`Setup ipcMain.`);
ipcMain.handle("getProfile", () => {
  return currentProfileConfigFileAccessor.getProfile();
});

ipcMain.handle("getProfileNames", () => {
  return ProfileConfigFileAccessor.GetProfileNames();
});

ipcMain.handle("getCurrentProfileName", () => {
  return mainConfigFileAccessor.getCurrentProfileName();
});

ipcMain.handle("setCurrentProfileName", (_, profileName: string) => {
  mainConfigFileAccessor.setCurrentProfileName(profileName);
  currentProfileConfigFileAccessor.changeProfile(profileName);
  if (typeof mainWindow === "undefined") {
    console.warn(`Main window does not exist. Skip sending profile change.`);
  } else {
    console.log("send on ProfileChanged");
    mainWindow.webContents.send("onProfileChanged");
  }
  if (typeof preferenceWindow === "undefined") {
    console.warn(
      `Preference window does not exist. Skip sending profile change.`
    );
  } else {
    preferenceWindow.webContents.send("onProfileChanged");
  }
  return;
});

ipcMain.handle("renameCurrentProfile", (_, profileName: string) => {
  currentProfileConfigFileAccessor.renameProfileConfigFile(profileName);
  mainConfigFileAccessor.setCurrentProfileName(profileName);
  return;
});

ipcMain.handle(
  "set",
  (_, profileKey: string, value: number | string | string[] | boolean) => {
    console.error(`Update profile key = ${profileKey}, value = ${value}`);
    currentProfileConfigFileAccessor.set(profileKey, value);
    if (typeof mainWindow === "undefined") {
      console.warn(`Main window does not exist. Skip sending profile change.`);
    } else {
      mainWindow.webContents.send("onProfileChanged");
    }
    if (typeof preferenceWindow === "undefined") {
      console.warn(
        `Preference window does not exist. Skip sending profile change.`
      );
    } else {
      preferenceWindow.webContents.send("onProfileChanged");
    }
  }
);

ipcMain.handle("copyProfile", () => {
  const newProfileName =
    currentProfileConfigFileAccessor.copyProfileConfigFile();
  mainConfigFileAccessor.setCurrentProfileName(newProfileName);
  // Reload profile on main window.
  if (typeof mainWindow === "undefined") {
    console.warn(`Main window does not exist. Skip sending profile change.`);
  } else {
    mainWindow.webContents.send("onProfileChanged");
  }
  // Reload profile on preference window.
  if (typeof preferenceWindow === "undefined") {
    console.warn(
      `Preference window does not exist. Skip sending profile change.`
    );
  } else {
    preferenceWindow.webContents.send("onProfileChanged");
  }
});

ipcMain.handle("deleteProfile", (_, nextProfileName: string) => {
  console.log(`Delete profile. The next profile is "${nextProfileName}"`);
  currentProfileConfigFileAccessor.deleteProfileConfigFile();
  currentProfileConfigFileAccessor.changeProfile(nextProfileName);
  mainConfigFileAccessor.setCurrentProfileName(nextProfileName);
  // Reload profile on main window.
  if (typeof mainWindow === "undefined") {
    console.warn(`Main window does not exist. Skip sending profile change.`);
  } else {
    console.log(`Send profile change to main window.`);
    mainWindow.webContents.send("onProfileChanged");
  }
  // Reload profile on preference window.
  if (typeof preferenceWindow === "undefined") {
    console.warn(
      `Preference window does not exist. Skip sending profile change.`
    );
  } else {
    console.log(`Send profile change to preference window.`);
    preferenceWindow.webContents.send("onProfileChanged");
  }
});

//
// Handle suspending / resuming a computer.
//
powerMonitor.on("suspend", () => {
  console.log(`Computer was suspended.`);
  if (typeof mainWindow === "undefined") {
    console.warn(`Main window does not exist. Skip sending ComputerSuspended.`);
  } else {
    console.log(`Send ComputerSuspended event to main window.`);
    mainWindow.webContents.send("onComputerSuspended");
  }
});

powerMonitor.on("resume", () => {
  console.log(`Computer was resumed.`);
  if (typeof mainWindow === "undefined") {
    console.warn(`Main window does not exist. Skip sending ComputerResumed.`);
  } else {
    console.log(`Send ComputerResumed event to main window.`);
    mainWindow.webContents.send("onComputerResumed");
  }
});

const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: 190,
    height: 190,
    frame: false,
    transparent: true,
    titleBarStyle: "customButtonsOnHover",
    maximizable: false,
    resizable: false,
    webPreferences: {
      // Not to stall the app when it is in background.
      backgroundThrottling: false,
      // To use ipcRenderer in preload.js.
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    x: 30,
    y: 60,
  });
  mainWindow.loadFile("build/index.html", { query: { route: "main" } });
  return mainWindow;
};

const createPreferenceWindow = (): BrowserWindow => {
  const preferenceWindow = new BrowserWindow({
    show: false,
    width: 200 + 370 * 2, // Profile column and preference columns * 2.
    height: 230 + 30 + 450,
    frame: false,
    transparent: true,
    titleBarStyle: "customButtonsOnHover",
    maximizable: false,
    resizable: false,
    webPreferences: {
      // To use ipcRenderer in preload.js.
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  preferenceWindow.loadFile("build/index.html", {
    query: { route: "preference" },
  });
  preferenceWindow.show();
  return preferenceWindow;
};

// Set menu
const template = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: "about", label: `About ${app.name}` },
      { type: "separator" },
      {
        label: "Preferences",
        click: () => {
          if (typeof preferenceWindow !== "undefined") {
            console.log(
              `Preference window already exists Skip creating the window.`
            );
            return;
          }
          console.log(`Create preference window.`);
          preferenceWindow = createPreferenceWindow();
          preferenceWindow.on("closed", () => {
            preferenceWindow = undefined;
          });
        },
      },
      { type: "separator" },
      { role: "reload", label: `Reload` },
      { type: "separator" },
      { role: "hide", label: `Hide ${app.name}` },
      { role: "hideOthers", label: "Hide Others" },
      { role: "unhide", label: "Show All" },
      { role: "minimize", label: "Minimize" },
      { type: "separator" },
      { role: "quit", label: `Quit ${app.name}` },
    ],
  },
  {
    label: "View",
    submenu: [{ role: "toggleDevTools", label: "Developer" }],
  },
]);
Menu.setApplicationMenu(template);

app.whenReady().then(() => {
  console.log(`Create main window.`);
  mainWindow = createMainWindow();
});

app.on("window-all-closed", () => {
  console.log(`Quit.`);
  app.quit();
});
