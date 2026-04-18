import { logDebug } from "../logging/index.js";

export default async function create(path: string, options: { authorid?: string; link?: string; projectlink?: string }) {
  logDebug(`Path provided: ${path}`);

  if (options.authorid) {
    logDebug(`Author ID provided: ${options.authorid}`);
  }

  if (options.link) {
    logDebug(`Manifest link provided: ${options.link}`);
  }

  if (options.projectlink) {
    logDebug(`Project link provided: ${options.projectlink}`);
  }

  const manifest = {
    version: "0.3.1",
    collectionId: crypto.randomUUID(),
    createdAt: Date.now().toString(),
    updatedAt: Date.now().toString(),
    collectionAuthorId: options.authorid || crypto.randomUUID(),
    collectionLink: options.link,
    collectionProjectLink: options.projectlink,
    artists: [],
    albums: [],
    tracks: [],
  };

  logDebug(`Generated manifest: ${JSON.stringify(manifest)}`);
}