import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import { JsonFileAccessor } from "./jsonFileAccessor";
import * as ColorUtils from "../../src/utils/colorUtils";

const PROFILE_CONFIG_DIR_PATH = os.homedir() + "/.pomodoroTimer/profiles/";
const JSON_EXTENSION = ".json";

type VALUE_ATTRIBUTE = {
  key: string;
  default: number | string | boolean | number[];
  type: "number" | "string" | "boolean" | "color" | "colorArray";
};

const VALUE_ATTRIBUTES: VALUE_ATTRIBUTE[] = [
  // Pomodoro
  {
    key: "workIntervalSec",
    default: 25 * 60,
    type: "number",
  },
  {
    key: "shortBreakIntervalSec",
    default: 5 * 60,
    type: "number",
  },
  {
    key: "longBreakIntervalSec",
    default: 20 * 60,
    type: "number",
  },
  {
    key: "nWorkBeforeLongBreak",
    default: 4,
    type: "number",
  },
  // Notification
  {
    key: "notificationIsEnabled",
    default: true,
    type: "boolean",
  },
  // Color
  {
    key: "transparent",
    default: 0.7,
    type: "number",
  },
  {
    key: "workColors",
    default: [0xff9500, 0xff0099],
    type: "colorArray",
  },
  {
    key: "shortBreakColors",
    default: [0x00b09b, 0x96c93d],
    type: "colorArray",
  },
  {
    key: "longBreakColors",
    default: [0x00e1ff, 0x7300ff],
    type: "colorArray",
  },
  {
    key: "backgroundColor",
    default: 0x000000,
    type: "color",
  },
  {
    key: "ringBaseColor",
    default: 0x1a1a1a,
    type: "color",
  },
  {
    key: "ringLabelColor",
    default: 0xffffff,
    type: "color",
  },
  {
    key: "scaleColor",
    default: 0x1a1a1a,
    type: "color",
  },
  {
    key: "preferenceTransparent",
    default: 1,
    type: "number",
  },
  {
    key: "preferenceBackgroundColor",
    default: 0x0e0e0e,
    type: "color",
  },
  {
    key: "preferenceLineColor",
    default: 0x1e1e1e,
    type: "color",
  },
  {
    key: "preferenceLabelBackgroundColor",
    default: 0x1a1a1a,
    type: "color",
  },
  {
    key: "preferenceLabelFontColor",
    default: 0xffffff,
    type: "color",
  },
  {
    key: "preferenceFontColor",
    default: 0xffffff,
    type: "color",
  },
  {
    key: "preferenceFontInvalidColor",
    default: 0x9d0043,
    type: "color",
  },
  {
    key: "preferenceButtonColor",
    default: 0x0e0e0e,
    type: "color",
  },
  {
    key: "preferenceButtonHoverColor",
    default: 0x454545,
    type: "color",
  },
  {
    key: "preferenceButtonFontColor",
    default: 0x4d4d4d,
    type: "color",
  },
  {
    key: "preferenceButtonFontHoverColor",
    default: 0x000000,
    type: "color",
  },
  {
    key: "preferenceCheckMarkColor",
    default: 0x72b66d,
    type: "color",
  },
];

const nameToFilePath = (profileName: string) => {
  return PROFILE_CONFIG_DIR_PATH + profileName + JSON_EXTENSION;
};

const filePathToName = (profileFilePath: string) => {
  return path.basename(profileFilePath).split(JSON_EXTENSION)[0];
};

export class ProfileConfigFileAccessor {
  private jsonFileAccessor: JsonFileAccessor;

  constructor(profileName: string) {
    const profileConfigFilePath = nameToFilePath(profileName);
    this.jsonFileAccessor = new JsonFileAccessor(profileConfigFilePath);
  }

  isProfileConfigFormat() {
    const jsonObject = this.getProfile();
    if (typeof jsonObject !== "object") {
      console.warn(`invalid profile format: profile is not object.`);
      return false;
    }
    for (let i = 0; i < VALUE_ATTRIBUTES.length; i++) {
      const attr = VALUE_ATTRIBUTES[i];
      const key = attr.key;
      const type = attr.type;
      const actualValue = jsonObject[key];
      if (type === "color") {
        if (!ColorUtils.isColorNumber(actualValue)) {
          console.log(`value of ${key} is not color: ${actualValue}`);
          return false;
        }
      } else if (type === "colorArray") {
        if (!Array.isArray(actualValue)) {
          console.log(`value of ${key} is not array: ${actualValue}`);
          return false;
        }
        if (!actualValue.every((elem) => ColorUtils.isColorNumber(elem))) {
          console.log(`element of key ${key} is not color: ${actualValue}`);
          return false;
        }
      } else if (typeof actualValue !== type) {
        console.log(`value of ${key} is not ${type}: ${actualValue}`);
        return false;
      }
    }
    return true;
  }

  getProfile() {
    const profile = this.jsonFileAccessor.getJsonObject();

    for (let i = 0; i < VALUE_ATTRIBUTES.length; i++) {
      const attr = VALUE_ATTRIBUTES[i];
      const key = attr.key;
      const type = attr.type;
      const defaultValue = attr.default;
      const actualValue = profile[key];

      // Json format does not support hex number. So the config file is written by string.
      // But in this code, number is more convenient than string. So convert it.
      if (type === "color") {
        if (
          typeof actualValue === "string" &&
          ColorUtils.isColorStr(actualValue)
        ) {
          profile[key] = ColorUtils.ston(actualValue);
          continue;
        } else if (
          typeof actualValue === "number" &&
          ColorUtils.isColorNumber(actualValue)
        ) {
          continue;
        }
        // If profile has not color string nor color number, don't use it and use default value instead.
        profile[key] = defaultValue;
        continue;
      }

      if (type === "colorArray") {
        if (Array.isArray(profile[key])) {
          if (
            profile[key].every(
              (elem: any) =>
                typeof elem === "string" && ColorUtils.isColorStr(elem)
            )
          ) {
            profile[key] = profile[key].map((elem: string) =>
              ColorUtils.ston(elem)
            );
            continue;
          }
          if (
            profile[key].every(
              (elem: any) =>
                typeof elem === "number" && ColorUtils.isColorNumber(elem)
            )
          ) {
            continue;
          }
          // If profile has not color string array nor color number array,
          // don't use it and use default value instead.
          profile[key] = defaultValue;
          continue;
        }
      }

      if (typeof profile[key] === "undefined") {
        profile[key] = defaultValue;
      }
    }
    return profile;
  }

  static GetProfileNames() {
    const profileNames: string[] = [];
    const profileFileNames = fs.readdirSync(PROFILE_CONFIG_DIR_PATH);
    profileFileNames.forEach((profileFileName) => {
      // If file name does not end with ".json", skip
      if (!profileFileName.endsWith(JSON_EXTENSION)) {
        return;
      }
      const profileName = profileFileName.split(JSON_EXTENSION)[0];
      if (profileName.length === 0) {
        return;
      }
      profileNames.push(profileName);
    });
    profileNames.sort();
    return profileNames;
  }

  set(key: string, value: string | number | boolean | string[]) {
    const attr = VALUE_ATTRIBUTES.find((attr) => attr.key === key);
    if (!attr) {
      throw new Error(`"${key}" is not valid key of profile config file.`);
    }

    const type = attr.type;
    if (type === "color") {
      const valueIsColorNumber =
        typeof value === "number" && ColorUtils.isColorNumber(value);
      const valueIsColorStr =
        typeof value === "string" && ColorUtils.isColorStr(value);
      if (valueIsColorNumber || valueIsColorStr) {
        this.jsonFileAccessor.save(key, value);
        return;
      }
      throw new Error(
        `"${value}" is not valid value of ${key} for profile config file.`
      );
    }

    if (type === "colorArray") {
      if (Array.isArray(value)) {
        const elemIsColorNumber = value.every(
          (elem) => typeof elem === "number" && ColorUtils.isColorNumber(elem)
        );
        const elemIsColorStr = value.every(
          (elem) => typeof elem === "string" && ColorUtils.isColorStr(elem)
        );
        if (elemIsColorNumber || elemIsColorStr) {
          this.jsonFileAccessor.save(key, value);
          return;
        }
      }
    }

    if (typeof value === attr.type) {
      this.jsonFileAccessor.save(key, value);
      return;
    }
    throw new Error(
      `"${value}" is not valid value of ${key} for profile config file.`
    );
  }

  changeProfile(profileName: string) {
    const profileConfigFilePath = nameToFilePath(profileName);
    this.jsonFileAccessor.setFilePath(profileConfigFilePath);
  }

  createNewProfileConfigFile() {
    if (this.jsonFileAccessor.jsonFileExists()) {
      throw new Error(
        `Profile config file of "${this.jsonFileAccessor.getFilePath()}" already exists.`
      );
    }
    VALUE_ATTRIBUTES.forEach((attr) => {
      const key = attr.key;
      const defaultValue = attr.default;
      this.jsonFileAccessor.save(key, defaultValue);
    });
  }

  deleteProfileConfigFile() {
    this.jsonFileAccessor.delete();
  }

  renameProfileConfigFile(newProfileName: string) {
    const newProfilePath = nameToFilePath(newProfileName);
    this.jsonFileAccessor.rename(newProfilePath);
  }

  copyProfileConfigFile() {
    this.jsonFileAccessor.copy();
    return filePathToName(this.jsonFileAccessor.getFilePath());
  }
}
