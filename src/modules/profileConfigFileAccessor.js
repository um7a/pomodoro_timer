import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { JsonFileAccessor } from "./jsonFileAccessor";
import * as ColorUtils from "../utils/colorUtils";

const PROFILE_CONFIG_DIR_PATH = os.homedir() + "/.pomodoroTimer/profiles/";
const JSON_EXTENSION = ".json";

const DEFAULT_VALUES = {
  // Pomodoro
  workIntervalSec: 25 * 60,
  shortBreakIntervalSec: 5 * 60,
  longBreakIntervalSec: 20 * 60,
  nWorkBeforeLongBreak: 4,
  // Graphic
  fps: 2,
  // Notification
  notificationIsEnabled: true,
  // Color
  workColors: ["#d38312", "#a83279"],
  shortBreakColors: ["#00b09b", "#96c93d"],
  longBreakColors: ["#43cea2", "#1e90ff"],
  backgroundColor: "#000000",
  ringBaseColor: "#131313",
  ringLabelColor: "#4d4d4d",
  ringFontColor: "#c0c0c0",
  scaleColor: "#131313",
  preferenceBackgroundColor: "#0e0e0e",
  preferenceLineColor: "#1e1e1e",
  preferenceLabelBackgroundColor: "#171717",
  preferenceLabelFontColor: "#4d4d4d",
  preferenceFontColor: "#4d4d4d",
  preferenceFontInvalidColor: "#9b0043",
  preferenceButtonColor: "#0e0e0e",
  //preferenceButtonHoverColor: "#ff6767", // pink
  //preferenceButtonHoverColor: "#b3ff66", // green
  preferenceButtonHoverColor: "#454545", // gray
  preferenceButtonFontColor: "#4d4d4d",
  preferenceButtonFontHoverColor: "#000000",
  preferenceCheckMarkColor: "#72b66d",
};

const nameToFilePath = (profileName) => {
  return PROFILE_CONFIG_DIR_PATH + profileName + JSON_EXTENSION;
};

const filePathToName = (profileFilePath) => {
  return path.basename(profileFilePath).split(JSON_EXTENSION)[0];
};

export class ProfileConfigFileAccessor {
  constructor(profileName) {
    const profileConfigFilePath = nameToFilePath(profileName);
    this.jsonFileAccessor = new JsonFileAccessor(profileConfigFilePath);
  }

  isProfileConfigFormat() {
    const jsonObject = this.jsonFileAccessor.getJsonObject();
    if (typeof jsonObject !== "object") {
      return false;
    }
    const {
      workIntervalSec,
      shortBreakIntervalSec,
      longBreakIntervalSec,
      nWorkBeforeLongBreak,
      fps,
      notificationIsEnabled,
      workColors,
      shortBreakColors,
      longBreakColors,
      backgroundColor,
      ringBaseColor,
      ringLabelColor,
      ringFontColor,
      scaleColor,
      preferenceLabelBackgroundColor,
      preferenceLabelFontColor,
      preferenceFontColor,
      preferenceFontInvalidColor,
      preferenceBackgroundColor,
      preferenceLineColor,
      preferenceButtonColor,
      preferenceButtonHoverColor,
      preferenceButtonFontColor,
      preferenceButtonFontHoverColor,
      preferenceCheckMarkColor,
    } = jsonObject;

    // Check number values
    const numValues = [
      workIntervalSec,
      shortBreakIntervalSec,
      longBreakIntervalSec,
      nWorkBeforeLongBreak,
      fps,
    ];
    const numValuesAreValid = numValues.every((num) => {
      if (typeof num !== "number") {
        return false;
      }
      return true;
    });
    if (!numValuesAreValid) {
      return false;
    }

    // Check array values
    const arrayValues = [
      { array: workColors, nElem: 2 },
      { array: shortBreakColors, nElem: 2 },
      { array: longBreakColors, nElem: 2 },
    ];
    const arrayValuesAreValid = arrayValues.every((arrayInfo) => {
      if (
        !Array.isArray(arrayInfo.array) ||
        arrayInfo.array.length !== arrayInfo.nElem
      ) {
        return false;
      }
      return true;
    });
    if (!arrayValuesAreValid) {
      return false;
    }

    // Check boolean values
    const boolValues = [notificationIsEnabled];
    const boolValuesAreValid = boolValues.every((b) => {
      if (typeof b !== "boolean") {
        return false;
      }
      return true;
    });
    if (!boolValuesAreValid) {
      return false;
    }

    // Check color string values
    const colorStrValues = [
      workColors[0],
      workColors[1],
      shortBreakColors[0],
      shortBreakColors[1],
      longBreakColors[0],
      longBreakColors[1],
      backgroundColor,
      ringBaseColor,
      ringLabelColor,
      ringFontColor,
      scaleColor,
      preferenceLabelBackgroundColor,
      preferenceLabelFontColor,
      preferenceFontColor,
      preferenceFontInvalidColor,
      preferenceBackgroundColor,
      preferenceLineColor,
      preferenceButtonColor,
      preferenceButtonHoverColor,
      preferenceButtonFontColor,
      preferenceButtonFontHoverColor,
      preferenceCheckMarkColor,
    ];

    const colorStrValuesAreValid = colorStrValues.every((colorStr) => {
      return ColorUtils.isColorStr(colorStr);
    });
    if (!colorStrValuesAreValid) {
      return false;
    }

    return true;
  }

  get(key) {
    return this.jsonFileAccessor.get(key);
  }

  getProfile() {
    return this.jsonFileAccessor.getJsonObject();
  }

  getProfileNames() {
    const profileNames = [];
    const profileFileNames = fs.readdirSync(PROFILE_CONFIG_DIR_PATH);
    profileFileNames.forEach((profileFileName) => {
      // If file name does not end with ".json", skip
      if (!profileFileName.endsWith(JSON_EXTENSION)) {
        return;
      }
      const profileName = profileFileName.split(JSON_EXTENSION)[0];
      if (typeof profileName === "undefined" || profileName.length === 0) {
        return;
      }
      profileNames.push(profileName);
    });
    profileNames.sort();
    return profileNames;
  }

  set(key, value) {
    if (!Object.keys(DEFAULT_VALUES).some((validKey) => key === validKey)) {
      throw new Error(`"${key}" is not valid key of profile config file.`);
    }
    if (typeof DEFAULT_VALUES[key] === "number") {
      if (typeof value !== "number") {
        throw new Error(
          `"${value}" is not valid value of ${key} for profile config file.`
        );
      }
    }
    if (ColorUtils.isColorStr(DEFAULT_VALUES[key])) {
      if (!ColorUtils.isColorStr(value)) {
        throw new Error(
          `"${value}" is not valid value of ${key} for profile config file.`
        );
      }
    }
    if (typeof DEFAULT_VALUES[key] === "boolean") {
      if (typeof value !== "boolean") {
        throw new Error(
          `"${value}" is not valid value of ${key} for profile config file.`
        );
      }
    }
    this.jsonFileAccessor.save(key, value);
  }

  changeProfile(profileName) {
    const profileConfigFilePath = nameToFilePath(profileName);
    this.jsonFileAccessor.setFilePath(profileConfigFilePath);
  }

  createNewProfileConfigFile() {
    if (this.jsonFileAccessor.jsonFileExists()) {
      throw new Error(
        `Profile config file of "${this.jsonFileAccessor.getFilePath()}" already exists.`
      );
    }
    Object.entries(DEFAULT_VALUES).forEach(([key, value]) => {
      this.jsonFileAccessor.save(key, value);
    });
  }

  deleteProfileConfigFile() {
    this.jsonFileAccessor.delete();
  }

  renameProfileConfigFile(newProfileName) {
    const newProfilePath = nameToFilePath(newProfileName);
    this.jsonFileAccessor.rename(newProfilePath);
  }

  copyProfileConfigFile() {
    this.jsonFileAccessor.copy();
    return filePathToName(this.jsonFileAccessor.getFilePath());
  }
}
