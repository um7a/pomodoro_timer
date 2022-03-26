import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname } from "path";

export class ConfigFileAccessor {
  //
  // private
  //
  filePath;

  //
  // public
  //
  constructor(filePath) {
    this.filePath = filePath;
  }

  configFileExists() {
    return existsSync(this.filePath);
  }

  save(key, value) {
    const currentConfigObject = this.getConfigObject();
    currentConfigObject[key] = value;

    const dirPath = dirname(this.filePath);
    if (!existsSync(dirPath)) {
      console.warn(
        `The directory ${dirPath} does not exist. Create new directory.`
      );
      mkdirSync(dirPath);
    }
    writeFileSync(
      this.filePath,
      JSON.stringify(currentConfigObject, undefined, 2)
    );
  }

  getConfigObject() {
    try {
      const configStr = readFileSync(this.filePath, "utf8");
      return JSON.parse(configStr);
    } catch (err) {
      if (err.code === "ENOENT") {
        // If the config file does not exist return empty object.
        return {};
      }
      // If the config file exists and failed to read file, Re-throw error.
      throw err;
    }
  }
}
