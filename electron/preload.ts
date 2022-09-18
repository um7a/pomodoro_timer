import { contextBridge, ipcRenderer } from "electron";

console.log(`Preload.`);

contextBridge.exposeInMainWorld("electron", {
  getProfile: () => ipcRenderer.invoke("getProfile"),
  getProfileNames: () => ipcRenderer.invoke("getProfileNames"),
  getCurrentProfileName: () => ipcRenderer.invoke("getCurrentProfileName"),
  setCurrentProfileName: (profileName: string) =>
    ipcRenderer.invoke("setCurrentProfileName", profileName),
  onProfileChanged: (callback: () => void) => {
    return ipcRenderer.on("onProfileChanged", callback);
  },
  renameCurrentProfile: (profileName: string) => {
    ipcRenderer.invoke("renameCurrentProfile", profileName);
  },
  set: (profileKey: string, value: number | string | string[] | boolean) => {
    ipcRenderer.invoke("set", profileKey, value);
  },
  copyProfile: () => {
    ipcRenderer.invoke("copyProfile");
  },
  deleteProfile: (nextProfileName: string) => {
    ipcRenderer.invoke("deleteProfile", nextProfileName);
  },
});
