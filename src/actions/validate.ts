import { logDebug, logError, logInfo } from "../logging/index.js";
import fs from "fs/promises";
import { MANIFEST_VERSION, type FlaxCollectionManifest } from "../types/spec_interfaces.js";
import { isValidTimestamp } from "../helpers/index.js";

export default async function validate(path: string, runningAsCommand: boolean = false): Promise<void | boolean> {
  const issues: string[] = [];
  logDebug(`Path provided: ${path}`, runningAsCommand);

  if (!path) {
    logError("No path provided. Please provide a path to the manifest file.", runningAsCommand);
    logError("Usage: fcmf-cli validate <path>", runningAsCommand);
    return;
  }
  
  const file = await fs.readFile(path, "utf-8").catch((err) => {
    logError(`Error reading file at path: ${path}. Please ensure the file exists and is readable.`, runningAsCommand);
    logError(`Error details: ${err.message}`, runningAsCommand);
    return;
  });

  if (!file) {
    return;
  }

  const manifest: FlaxCollectionManifest = JSON.parse(file);

  if (manifest.version !== MANIFEST_VERSION) {
    issues.push(`Invalid manifest version: ${manifest.version}. Expected version: ${MANIFEST_VERSION}.`);
  }

  if (manifest.collectionAuthorId && manifest.collectionAuthorId.length > 32) {
    issues.push(`Author ID is too long: ${manifest.collectionAuthorId}. Maximum length is 32 characters.`);
  }

  if (manifest.encryption) {
    const validLinkEncryptionValues = ["NONE", "AUDIO_ONLY", "AUDIO_AND_COVERS"];
    const validFileEncryptionValues = ["NONE", "AUDIO_ONLY", "AUDIO_AND_COVERS"];
    if (!validLinkEncryptionValues.includes(manifest.encryption.linkEncryption)) {
      issues.push(`Invalid link encryption value: ${manifest.encryption.linkEncryption}. Valid values are: ${validLinkEncryptionValues.join(", ")}.`);
    }
    if (!validFileEncryptionValues.includes(manifest.encryption.fileEncryption)) {
      issues.push(`Invalid file encryption value: ${manifest.encryption.fileEncryption}. Valid values are: ${validFileEncryptionValues.join(", ")}.`);
    }
    if (manifest.encryption.type !== "AES_256_GCM") {
      issues.push(`Invalid encryption type: ${manifest.encryption.type}. Currently, only AES_256_GCM is supported.`);
    }
  }

  if (manifest.createdAt && !isValidTimestamp(manifest.createdAt)) {
    issues.push(`Invalid createdAt date format: ${manifest.createdAt}. Expected a valid unix timestamp.`);
  }

  if (manifest.updatedAt && !isValidTimestamp(manifest.updatedAt)) {
    issues.push(`Invalid updatedAt date format: ${manifest.updatedAt}. Expected a valid unix timestamp.`);
  }

  // TODO: add validation for artists, albums and tracks

  if (issues.length > 0) {
    logError("Validation failed with the following issues:", runningAsCommand);
    issues.forEach((issue) => logError(`- ${issue}`, runningAsCommand));
    return false;
  } else {
    logDebug("Manifest is valid.", runningAsCommand);
    logInfo("Manifest validation successful! No issues found.", runningAsCommand);
    return true;
  }
}