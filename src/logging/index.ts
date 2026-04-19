import ansis from "ansis";

const LogLevels = {
  0: "none",
  1: "error",
  2: "warn",
  3: "info",
  4: "debug",
} as const;

export type LogLevel = keyof typeof LogLevels;

export function getLogLevel(): LogLevel {
  const level = process.env.LOG_LEVEL;
  if (level && Object.keys(LogLevels).includes(level)) {
    return level as unknown as LogLevel;
  }
  return "3" as unknown as LogLevel;
}

const formatLog = (
  level: string,
  color: any,
  message: string,
  messageColor: any,
) => {
  return `${color.bold`${level}`} ${messageColor(message)}`;
};

const logDebug = (message: string, disabled: boolean = false) => {
  if (getLogLevel() >= 4 && !disabled) {
    console.log(formatLog(" DEBUG    ", ansis.bgGray.white, message, ansis.white));
  }
};

const logInfo = (message: string, disabled: boolean = false) => {
  if (getLogLevel() >= 3 && !disabled) {
    console.log(formatLog(" INFO     ", ansis.bgBlue.white, message, ansis.blue));
  }
};

const logWarn = (message: string, disabled: boolean = false) => {
  if (getLogLevel() >= 2 && !disabled) {
    console.log(
      formatLog(" WARN     ", ansis.bgYellow.white, message, ansis.yellow),
    );
  }
};

const logError = (message: string, disabled: boolean = false) => {
  if (getLogLevel() >= 1 && !disabled) {
    console.log(formatLog(" ERROR    ", ansis.bgRed.white, message, ansis.red));
  }
};

export { logDebug, logInfo, logWarn, logError };