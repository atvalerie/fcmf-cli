import { log } from "node:console";
import { logDebug, logError, logWarn } from "../logging/index.js";
import validate from "./validate.js";
import { questionTheme } from "../logging/theme.js";
import { search } from "@inquirer/prompts";
import { filePicker } from "../helpers/file-picker.js";

export default async function addTrack(manifestPath: string, trackPath: string) {
  logDebug(`Manifest path provided: ${manifestPath}`);
  logDebug(`Track path provided: ${trackPath}`);

  if (!manifestPath) {
    logError("No manifest path provided. Please provide a path to the existing manifest file.");
    return;
  }

  const manifestExists = await validate(manifestPath, true);

  if (manifestExists == false || manifestExists === undefined) {
    logError(`Manifest file not found at path: ${manifestPath}. Please ensure the file exists and is readable.`);
    return;
  }

  if (!trackPath) {
    logWarn("No track path provided. You will be prompted to enter the track path.");
    trackPath = await filePicker({
      message: "Select a track file:",
      root: process.cwd(),
    });
    logDebug(`Track path entered: ${trackPath}`);
  }
}