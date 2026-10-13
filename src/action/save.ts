import { readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import { fontelloHost } from "../constants";
import { downloadBuffer, getInlineContent } from "~/util";
import { getIconSetFiles } from "~/config";
import { readFontelloArchive } from "~/archive";
import { IconSetConfig } from "~/types";

export async function save(iconSetConfig: IconSetConfig, configFile: string) {
  const fontelloDir = dirname(configFile);
  const { idFile, cssFile, templateFile, woff2File } = getIconSetFiles(
    fontelloDir,
    iconSetConfig,
  );

  const id = readFileSync(idFile, { encoding: "utf-8" });

  const zip = await downloadBuffer(`${fontelloHost}/${id}/get`);
  const { configContent, fontelloConfig, woff2, cssCodes } =
    await readFontelloArchive(zip);

  const templateContent = readFileSync(templateFile, { encoding: "utf-8" });
  const fontData = await getInlineContent(woff2);

  const cssContent = templateContent
    .replaceAll("{{FONT_FAMILY}}", iconSetConfig.fontFamily)
    .replaceAll("{{URL_DATA}}", fontData)
    .replaceAll("{{PREFIX}}", fontelloConfig.css_prefix_text)
    .replaceAll("{{TIMESTAMP}}", Date.now().toString())
    .replaceAll("{{CODES}}", cssCodes);

  writeFileSync(configFile, configContent);
  writeFileSync(woff2File, woff2);
  writeFileSync(cssFile, cssContent, { encoding: "utf-8" });
}
