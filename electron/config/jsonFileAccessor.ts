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
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  setFilePath(filePath: string): void {
    this.filePath = filePath;
  }

  getFilePath(): string {
    return this.filePath;
  }

  jsonFileExists(): boolean {
    return existsSync(this.filePath);
  }

  save(
    key: string,
    // Json format has string, number, boolean, array, and object.
    value:
      | string
      | number
      | boolean
      | Array<string | number | boolean | Object>
      | Object
  ): void {
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

  saveRaw(raw: any): void {
    const dirPath = dirname(this.filePath);
    if (!existsSync(dirPath)) {
      console.warn(
        `The directory ${dirPath} does not exist. Create new directory.`
      );
      mkdirSync(dirPath);
    }

    writeFileSync(this.filePath, JSON.stringify(raw, undefined, 2));
  }

  getJsonObject(): any {
    try {
      const jsonStr = readFileSync(this.filePath, "utf8");
      return JSON.parse(jsonStr);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        // If the json file does not exist return empty object.
        return {};
      }
      // If the json file exists and failed to read file, Re-throw error.
      throw err;
    }
  }

  get(
    key: string
  ):
    | string
    | number
    | boolean
    | Array<string | number | boolean | Object>
    | Object
    | undefined {
    const jsonObject = this.getJsonObject();
    if (typeof jsonObject !== "object") {
      return undefined;
    }
    return jsonObject[key];
  }

  rename(newFilePath: string): void {
    renameSync(this.filePath, newFilePath);
    this.filePath = newFilePath;
  }

  copy(): void {
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

  delete(): void {
    try {
      unlinkSync(this.filePath);
    } catch (err: any) {
      if (err.code !== "ENOENT") {
        throw err;
      }
    }
  }
}
