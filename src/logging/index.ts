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

const getTimestamp = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

const formatLog = (
  level: string,
  color: any,
  message: string,
  messageColor: any,
) => {
  return `${ansis.dim`${getTimestamp()}`} ${color.bold`${level}`} ${messageColor(message)}`;
};

const logDebug = (message: string) => {
  if (getLogLevel() >= 4) {
    console.log(formatLog(" DEBUG ", ansis.bgGray.white, message, ansis.white));
  }
};

const logInfo = (message: string) => {
  if (getLogLevel() >= 3) {
    console.log(formatLog(" INFO  ", ansis.bgBlue.white, message, ansis.blue));
  }
};

const logWarn = (message: string) => {
  if (getLogLevel() >= 2) {
    console.log(
      formatLog(" WARN  ", ansis.bgYellow.white, message, ansis.yellow),
    );
  }
};

const logError = (message: string) => {
  if (getLogLevel() >= 1) {
    console.log(formatLog(" ERROR ", ansis.bgRed.white, message, ansis.red));
  }
};

export { logDebug, logInfo, logWarn, logError };