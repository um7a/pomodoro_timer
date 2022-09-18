declare global {
  interface Window {
    electron: IElectron;
  }
}
export interface IElectron {
  getProfile: () => Promise<any>;
  getProfileNames: () => Promise<string[]>;
  getCurrentProfileName: () => Promise<string>;
  setCurrentProfileName: (profileName: string) => Promise<void>;
  onProfileChanged: (callback) => Promise<void>;
  renameCurrentProfile: (profileName: string) => Promise<void>;
  set: (
    profileKey: string,
    value: number | string | string[] | boolean
  ) => Promise<void>;
  copyProfile: () => Promise<void>;
  deleteProfile: (nextProfileName: string) => Promise<void>;
}
