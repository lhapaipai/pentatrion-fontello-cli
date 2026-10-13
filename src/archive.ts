import { buffer } from "node:stream/consumers";

import yauzl from "yauzl";
import { FontelloConfig } from "~/types";

/**
 * Reads every file of the zip in memory, keyed by its path relative to the
 * root folder (Fontello wraps everything in a single `fontello-<hash>/`).
 */
async function readZipEntries(zip: Buffer) {
  const zipfile = await yauzl.fromBufferPromise(zip);
  const entries = new Map<string, Buffer>();

  for await (const entry of zipfile.eachEntry()) {
    if (entry.fileName.endsWith("/")) {
      continue;
    }
    const relativePath = entry.fileName.slice(entry.fileName.indexOf("/") + 1);
    const stream = await zipfile.openReadStreamPromise(entry);
    entries.set(relativePath, await buffer(stream));
  }

  return entries;
}

function getEntry(entries: Map<string, Buffer>, path: string) {
  const content = entries.get(path);
  if (!content) {
    throw new Error(`${path} not found in the Fontello archive`);
  }
  return content;
}

export async function readFontelloArchive(zip: Buffer) {
  const entries = await readZipEntries(zip);

  const configContent = getEntry(entries, "config.json");
  const fontelloConfig = JSON.parse(
    configContent.toString("utf-8"),
  ) as FontelloConfig;

  return {
    configContent,
    fontelloConfig,
    woff2: getEntry(entries, `font/${fontelloConfig.name}.woff2`),
    cssCodes: getEntry(
      entries,
      `css/${fontelloConfig.name}-codes.css`,
    ).toString("utf-8"),
  };
}
