import { logDebug, logError, logWarn } from "../logging/index.js";
import validate from "./validate.js";
import { filePickerTheme } from "../logging/theme.js";
import { filePicker } from "../helpers/file-picker.js";
import fs from "fs/promises";
import { parseFile } from "music-metadata";

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
      theme: filePickerTheme
    });
    logDebug(`Track path entered: ${trackPath}`);
  }

  if (!trackPath) {
    logError("No track path provided. Please provide a path to the track file.");
    return;
  }

  const file = await fs.readFile(trackPath).catch((err) => {
    logError(`Error reading track file at path: ${trackPath}. Please ensure the file exists and is readable.`);
    logError(`Error details: ${err.message}`);
    return;
  });

  if (!file) {
    return;
  }

  logDebug("Parsing audio file...");

  const parsedFile = await parseFile(trackPath).catch((err) => {
    logError(`Error parsing audio file at path: ${trackPath}. Please ensure the file is a valid audio file.`);
    logError(`Error details: ${err.message}`);
    return;
  });

  if (!parsedFile) {
    return;
  }

  
}