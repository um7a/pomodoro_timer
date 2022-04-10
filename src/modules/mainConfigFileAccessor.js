import * as os from "os";

import { JsonFileAccessor } from "./jsonFileAccessor";

const MAIN_CONFIG_FILE_PATH = os.homedir() + "/.pomodoroTimer/config.json";

const CURRENT_PROFILE_NAME_KEY = "currentProfileName";
const DEFAULT_CURRENT_PROFILE_NAME = "Default";

const DEFAULT_VALUES = {
  [CURRENT_PROFILE_NAME_KEY]: DEFAULT_CURRENT_PROFILE_NAME,
};
export class MainConfigFileAccessor {
  constructor() {
    this.jsonFileAccessor = new JsonFileAccessor(MAIN_CONFIG_FILE_PATH);
  }

  isMainConfigFormat() {
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

  getCurrentProfileName() {
    if (!this.isMainConfigFormat()) {
      return undefined;
    }
    const profileName = this.jsonFileAccessor.get(CURRENT_PROFILE_NAME_KEY);
    return profileName;
  }

  setCurrentProfileName(newProfileName) {
    this.jsonFileAccessor.save(CURRENT_PROFILE_NAME_KEY, newProfileName);
  }

  createNewMainConfigFile() {
    if (this.jsonFileAccessor.jsonFileExists()) {
      throw new Error(
        `Main config file "${MAIN_CONFIG_FILE_PATH}" already exists.`
      );
    }
    Object.entries(DEFAULT_VALUES).forEach(([key, value]) => {
      this.jsonFileAccessor.save(key, value);
    });
  }

  deleteMainConfigFile() {
    this.jsonFileAccessor.delete();
  }
}
