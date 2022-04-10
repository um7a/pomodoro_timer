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

export class JsonFileAccessor {
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

  jsonFileExists() {
    return existsSync(this.filePath);
  }

  save(key, value) {
    const currentJsonObject = this.getJsonObject();
    currentJsonObject[key] = value;

    const dirPath = dirname(this.filePath);
    if (!existsSync(dirPath)) {
      console.warn(
        `The directory ${dirPath} does not exist. Create new directory.`
      );
      mkdirSync(dirPath);
    }
    writeFileSync(
      this.filePath,
      JSON.stringify(currentJsonObject, undefined, 2)
    );
  }

  getJsonObject() {
    try {
      const jsonStr = readFileSync(this.filePath, "utf8");
      return JSON.parse(jsonStr);
    } catch (err) {
      if (err.code === "ENOENT") {
        // If the json file does not exist return empty object.
        return {};
      }
      // If the json file exists and failed to read file, Re-throw error.
      throw err;
    }
  }

  get(key) {
    const jsonObject = this.getJsonObject();
    if (typeof jsonObject !== "object") {
      return undefined;
    }
    return jsonObject[key];
  }

  rename(newFilePath) {
    renameSync(this.filePath, newFilePath);
    this.filePath = newFilePath;
  }

  copy() {
    if (!this.filePath.endsWith(".json")) {
      throw new Error(
        `Unexpected file path. Not .json file: "${this.filePath}"`
      );
    }
    const withoutExtension = this.filePath.split(".json")[0];

    let i = 1;
    while (existsSync(withoutExtension + "." + i.toString() + ".json")) {
      i++;
    }
    const copyFilePath = withoutExtension + "." + i.toString() + ".json";
    copyFileSync(this.filePath, copyFilePath);
    this.filePath = copyFilePath;
  }

  delete() {
    try {
      unlinkSync(this.filePath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }
  }
}
