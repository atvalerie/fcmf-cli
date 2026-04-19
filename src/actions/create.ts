import { logDebug, logError, logInfo } from "../logging/index.js";

import { input } from "@inquirer/prompts";
import fs from "fs/promises";
import { questionTheme } from "../logging/theme.js";
import { log } from "console";

export default async function create(path: string, options: { authorid?: string; link?: string; projectlink?: string }) {
  logDebug(`Path provided: ${path}`);
  logDebug(`Options provided: ${JSON.stringify(options, null, 2)}`);

  if (path) {
    logDebug(`Checking if file already exists at path: ${path}`);

    try {
      const fileExists = await fs.access(path);

      if (fileExists === undefined) {
        logError(`File already exists at path: ${path}. Please choose a different path or delete the existing file.`);
        return;
      }
    } catch (err) {
      // actually good because that means we can create the file
      logDebug(`No existing file found at path: ${path}.`);
    }
  }

  // todo validate if its 32 char
  if (!options.authorid) {
    options.authorid = await input({
      message: "Enter an author ID/username for the manifest (optional - up to 32 characters, will be generated if left blank):",
      theme: questionTheme
    });
    logDebug(`Author ID entered: ${options.authorid}`);
  }

  if (!options.link) {
    options.link = await input({
      message: "Enter a link to the manifest (optional, can be left blank):",
      theme: questionTheme
    });
    logDebug(`Manifest link entered: ${options.link}`);
  }

  if (!options.projectlink) {
    options.projectlink = await input({
      message: "Enter a project link/discord server/website/email for the manifest (ANYTHING that can be used to reach the author, optional, can be left blank):",
      theme: questionTheme
    });
    logDebug(`Project link entered: ${options.projectlink}`);
  }

  const manifest = {
    version: "0.3.1",
    collectionId: crypto.randomUUID(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    collectionAuthorId: options.authorid || crypto.randomUUID(),
    collectionLink: options.link,
    collectionProjectLink: options.projectlink,
    encryption: {
      type: "AES_256_GCM",
      linkEncryption: "NONE",
      fileEncryption: "NONE",
    },
    artists: [],
    albums: [],
    tracks: [],
  };

  if (path) {
    try {
      await fs.writeFile(path, JSON.stringify(manifest, null, 2));
      logInfo(`Manifest successfully written to file at path: ${path}`);
    } catch (err) {
      logError(`Error writing manifest to file at path: ${path}. Error: ${(err as Error).message}`);
    }
  } else {
    logInfo("No path provided, outputting manifest content to console:");
    console.log(JSON.stringify(manifest, null, 2));
  }

  logInfo("Encryption is set to NONE by default, remember to update the manifest with the correct encryption settings and encrypt your files/links before.");
  logInfo("In order to use the manifest, pass the path to the manifest file when running other commands, for example: fcmf-cli validate <path>");
  logInfo("Happy manifesting!");
}