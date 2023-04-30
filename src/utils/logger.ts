function dateToStr(date: Date): string {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  const dateStr: string =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    diff +
    pad(tzOffset / 60) +
    ":" +
    pad(tzOffset % 60);
  return dateStr;
}

export type LogLevel = number;
export const LogLevelError: LogLevel = 0;
export const LogLevelWarn: LogLevel = 1;
export const LogLevelNotice: LogLevel = 2;
export const LogLevelInfo: LogLevel = 3;
export const LogLevelDebug: LogLevel = 4;

export class Logger {
  private level: LogLevel;

  constructor(level: LogLevel) {
    this.level = level;
  }

  debug(message: string): void {
    if (this.level >= LogLevelDebug) {
      const date = new Date();
      console.log(`${dateToStr(date)} ${message}`);
    }
  }

  log(message: string): void {
    if (this.level >= LogLevelInfo) {
      const date = new Date();
      console.log(`${dateToStr(date)} ${message}`);
    }
  }

  warn(message: string): void {
    if (this.level >= LogLevelWarn) {
      const date = new Date();
      console.warn(`${dateToStr(date)} ${message}`);
    }
  }
}
