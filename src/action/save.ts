import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { dirname, resolve } from "node:path";

import { rimrafSync } from "rimraf";
import extractZip from "extract-zip";
import { fontelloHost } from "../constants";
import { downloadFile, getInlineContent } from "~/util";
import { getIconSetFiles, getZipFiles, tmpDir } from "~/config";
import { IconSetConfig } from "~/types";

export async function save(iconSetConfig: IconSetConfig, configFile: string) {
  const fontelloDir = dirname(configFile);
  const { idFile, cssFile, templateFile, woff2File } =
    getIconSetFiles(fontelloDir);

  existsSync(tmpDir) && rimrafSync(tmpDir);
  mkdirSync(tmpDir, { recursive: true });

  const id = readFileSync(idFile, { encoding: "utf-8" });

  /**
   * download and extract zip file into "zipContentDir"
   */
  const zipFile = resolve(tmpDir, "fontello.zip");
  await downloadFile(`${fontelloHost}/${id}/get`, zipFile);
  await extractZip(zipFile, { dir: tmpDir });
  const files: string[] = readdirSync(tmpDir, { encoding: "utf-8" });
  const fontelloDirname = files.find((fileName) =>
    fileName.startsWith("fontello-")
  );

  const zipFiles = getZipFiles(resolve(tmpDir, fontelloDirname!));
  /**
   * copy vital files into project
   */
  copyFileSync(zipFiles.config, configFile);
  copyFileSync(zipFiles.woff2, woff2File);

  let cssCodes = readFileSync(zipFiles.codes, { encoding: "utf-8" });
  let templateContent = readFileSync(templateFile, { encoding: "utf-8" });
  const fontData = await getInlineContent(zipFiles.woff2);

  const cssContent = templateContent
    .replaceAll("{{FONT_FAMILY}}", `fontello-${iconSetConfig.name}`)
    .replaceAll("{{URL_DATA}}", fontData)
    .replaceAll("{{PREFIX}}", iconSetConfig.prefix)
    .replaceAll("{{TIMESTAMP}}", Date.now().toString())
    .concat(cssCodes);

  writeFileSync(cssFile, cssContent, { encoding: "utf-8" });

  rimrafSync(tmpDir);
}
