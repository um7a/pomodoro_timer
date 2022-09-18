import * as os from "os";

import { JsonFileAccessor } from "./jsonFileAccessor";

const MAIN_CONFIG_FILE_PATH = os.homedir() + "/.pomodoroTimer/config.json";

const CURRENT_PROFILE_NAME_KEY = "currentProfileName";
const DEFAULT_CURRENT_PROFILE_NAME = "Default";

const DEFAULT_VALUES = {
  [CURRENT_PROFILE_NAME_KEY]: DEFAULT_CURRENT_PROFILE_NAME,
};
export class MainConfigFileAccessor {
  private jsonFileAccessor: JsonFileAccessor;

  constructor() {
    this.jsonFileAccessor = new JsonFileAccessor(MAIN_CONFIG_FILE_PATH);
  }

  isMainConfigFormat(): boolean {
    const jsonObject = this.jsonFileAccessor.getJsonObject();
    if (typeof jsonObject !== "object") {
      return false;
    }
    const currentProfileName = jsonObject[CURRENT_PROFILE_NAME_KEY];
    if (typeof currentProfileName !== "string") {
      return false;
    }
    return true;
  }

  getCurrentProfileName(): string | undefined {
    if (!this.isMainConfigFormat()) {
      return undefined;
    }
    const profileName = this.jsonFileAccessor.get(CURRENT_PROFILE_NAME_KEY);
    if (typeof profileName !== "string") {
      return undefined;
    }
    return profileName;
  }

  setCurrentProfileName(newProfileName: string): void {
    this.jsonFileAccessor.save(CURRENT_PROFILE_NAME_KEY, newProfileName);
  }

  createNewMainConfigFile(): void {
    if (this.jsonFileAccessor.jsonFileExists()) {
      throw new Error(
        `Main config file "${MAIN_CONFIG_FILE_PATH}" already exists.`
      );
    }
    Object.entries(DEFAULT_VALUES).forEach(([key, value]) => {
      this.jsonFileAccessor.save(key, value);
    });
  }

  deleteMainConfigFile(): void {
    this.jsonFileAccessor.delete();
  }
}
