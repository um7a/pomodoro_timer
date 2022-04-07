import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "fs";
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

  setFilePath(filePath) {
    this.filePath = filePath;
  }

  getFilePath() {
    return this.filePath;
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

  rename(newFilePath) {
    renameSync(this.filePath, newFilePath);
    this.filePath = newFilePath;
  }

  copy() {
    if (!this.filePath.endsWith(".json")) {
      throw new Error(`Unexpected file path. Not .json file.`);
    }
    const withoutExtension = this.filePath.split(".json")[0];

    let i = 2;
    while (existsSync(withoutExtension + "." + i.toString() + ".json")) {
      i++;
    }
    const copyFilePath = withoutExtension + "." + i.toString() + ".json";
    copyFileSync(this.filePath, copyFilePath);
    this.filePath = copyFilePath;
  }

  delete() {
    unlinkSync(this.filePath);
  }
}
