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
import { getIconSetFiles, getZipInfos, tmpDir } from "~/config";
import { IconSetConfig } from "~/types";

export async function save(iconSetConfig: IconSetConfig, configFile: string) {
  const fontelloDir = dirname(configFile);
  const { idFile, cssFile, templateFile, woff2File } = getIconSetFiles(
    fontelloDir,
    iconSetConfig
  );

  existsSync(tmpDir) && rimrafSync(tmpDir);
  mkdirSync(tmpDir, { recursive: true });

  const id = readFileSync(idFile, { encoding: "utf-8" });

  const zipFile = resolve(tmpDir, "fontello.zip");
  await downloadFile(`${fontelloHost}/${id}/get`, zipFile);
  await extractZip(zipFile, { dir: tmpDir });
  const files: string[] = readdirSync(tmpDir, { encoding: "utf-8" });
  const fontelloDirname = files.find((fileName) =>
    fileName.startsWith("fontello-")
  );

  const zipInfos = getZipInfos(resolve(tmpDir, fontelloDirname!));
  copyFileSync(zipInfos.fontelloConfigFile, configFile);
  copyFileSync(zipInfos.woff2File, woff2File);

  let cssCodes = readFileSync(zipInfos.codesFile, { encoding: "utf-8" });
  let templateContent = readFileSync(templateFile, { encoding: "utf-8" });
  const fontData = await getInlineContent(zipInfos.woff2File);

  const cssContent = templateContent
    .replaceAll("{{FONT_FAMILY}}", iconSetConfig.fontFamily)
    .replaceAll("{{URL_DATA}}", fontData)
    .replaceAll("{{PREFIX}}", zipInfos.fontelloConfigContent.css_prefix_text)
    .replaceAll("{{TIMESTAMP}}", Date.now().toString())
    .replaceAll("{{CODES}}", cssCodes);

  writeFileSync(cssFile, cssContent, { encoding: "utf-8" });

  rimrafSync(tmpDir);
}
