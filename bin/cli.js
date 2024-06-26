#!/usr/bin/env node

// src/cli.ts
import { copyFileSync as copyFileSync2, existsSync as existsSync3, mkdirSync as mkdirSync2 } from "fs";
import { dirname as dirname4, resolve as resolve4 } from "path";
import prompts2 from "prompts";

// src/config.ts
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { cwd } from "process";
import { fileURLToPath } from "url";
import prompts from "prompts";
import { program } from "commander";
var packageDir = dirname(fileURLToPath(import.meta.url));
var templatesDir = resolve(packageDir, "../templates");
var projectDir = cwd();
var tmpDir = resolve(projectDir, "tmp");
function getIconSetFiles(fontelloDir) {
  const idFile = resolve(fontelloDir, ".fontello");
  const cssFile = resolve(fontelloDir, "fontello.css");
  const templateFile2 = resolve(fontelloDir, "fontello.css.template");
  const woff2File = resolve(fontelloDir, "fontello.woff2");
  if (!existsSync(idFile)) {
    console.log(
      `${idFile} doesn't exists open fontello in your browser before saving`
    );
    process.exit();
  }
  return {
    idFile,
    cssFile,
    templateFile: templateFile2,
    woff2File
  };
}
function getZipInfos(zipContentDir) {
  const configFile2 = resolve(zipContentDir, "config.json");
  let configContent = JSON.parse(
    readFileSync(configFile2, { encoding: "utf-8" })
  );
  const woff2File = resolve(zipContentDir, `font/${configContent.name}.woff2`);
  const codesFile = resolve(
    zipContentDir,
    `css/${configContent.name}-codes.css`
  );
  return { configFile: configFile2, woff2File, codesFile, configContent };
}
async function getIconSetConfig(projectDir2) {
  const partialConfig = await resolveIconSetConfig(projectDir2);
  return {
    base: "",
    name: "default",
    ...partialConfig
  };
}
async function resolveIconSetConfig(projectDir2) {
  program.option(
    "-i, --icons-config <config>",
    "Icon Set configuration",
    "config.json"
  );
  program.option(
    "-p, --project-config <config>",
    "js file containing multiple Icon Set configurations",
    "fontello.config.js"
  );
  program.parse();
  const options = program.opts();
  let configFile2 = resolve(projectDir2, options.iconsConfig);
  const projectConfigFile = resolve(projectDir2, options.projectConfig);
  if (!existsSync(configFile2)) {
    if (!existsSync(projectConfigFile)) {
      console.log(
        `${projectConfigFile} or ${configFile2} doesn't exists for this project`
      );
      process.exit(0);
    } else {
      const projectConfig = (await import(projectConfigFile)).default;
      if (!Array.isArray(projectConfig)) {
        return projectConfig;
      } else if (projectConfig.length === 0) {
        console.log("configure at least one project in your workspace");
        process.exit(0);
      } else if (projectConfig.length === 1) {
        return projectConfig[0];
      } else {
        const answers = await prompts([
          {
            message: "Which Icon set do you want to use ?",
            type: "select",
            name: "iconSetIndex",
            choices: projectConfig.map(({ name }, index) => ({
              title: name,
              value: index
            }))
          }
        ]);
        return projectConfig[parseInt(answers.iconSetIndex)];
      }
    }
  }
  return {
    base: dirname(options.iconsConfig)
  };
}

// src/action/open.ts
import { createReadStream, writeFileSync } from "fs";
import open from "open";
import FormData from "form-data";
import axios from "axios";

// src/constants.ts
var fontelloHost = "https://fontello.com";

// src/action/open.ts
import { dirname as dirname2, resolve as resolve2 } from "path";
async function openBrowser(configFile2) {
  const fontelloDir = dirname2(configFile2);
  const idFile = resolve2(fontelloDir, ".fontello");
  const payload = new FormData();
  payload.append("config", createReadStream(configFile2));
  const res = await axios({
    method: "POST",
    url: fontelloHost,
    data: payload,
    headers: payload.getHeaders()
  });
  const id = res.data;
  writeFileSync(idFile, id, { encoding: "utf-8" });
  const url = `${fontelloHost}/${id}`;
  open(url);
  console.log(
    `Your browser should open itself, otherwise you can open the following URL manually: ${url}`
  );
}

// src/action/save.ts
import {
  copyFileSync,
  existsSync as existsSync2,
  mkdirSync,
  readFileSync as readFileSync3,
  readdirSync,
  writeFileSync as writeFileSync2
} from "fs";
import { dirname as dirname3, resolve as resolve3 } from "path";
import { rimrafSync } from "rimraf";
import extractZip from "extract-zip";

// src/util.ts
import { createWriteStream, readFileSync as readFileSync2 } from "fs";
import axios2 from "axios";
import { fileTypeFromBuffer } from "file-type";
function downloadFile(url, dstFile) {
  return new Promise((resolve5, reject) => {
    axios2({
      method: "GET",
      url,
      responseType: "stream"
    }).then((res) => {
      if (res.status !== 200) {
        reject(new Error(`error get: ${url}: ${res.status}`));
      }
      const stream = createWriteStream(dstFile);
      stream.on("close", () => {
        resolve5(true);
      });
      res.data.pipe(stream);
      res.data.on("end", () => {
        stream.close();
      });
    }).catch((err) => {
      reject(err);
    });
  });
}
async function getInlineContent(path) {
  const buf = await readFileSync2(path);
  const result = await fileTypeFromBuffer(buf);
  if (!result) {
    throw new Error(`unable to find Mime Type from ${path}`);
  }
  return `data:${result.mime};charset=utf-8;base64,${buf.toString("base64")}`;
}

// src/action/save.ts
async function save(iconSetConfig2, configFile2) {
  const fontelloDir = dirname3(configFile2);
  const { idFile, cssFile, templateFile: templateFile2, woff2File } = getIconSetFiles(fontelloDir);
  existsSync2(tmpDir) && rimrafSync(tmpDir);
  mkdirSync(tmpDir, { recursive: true });
  const id = readFileSync3(idFile, { encoding: "utf-8" });
  const zipFile = resolve3(tmpDir, "fontello.zip");
  await downloadFile(`${fontelloHost}/${id}/get`, zipFile);
  await extractZip(zipFile, { dir: tmpDir });
  const files = readdirSync(tmpDir, { encoding: "utf-8" });
  const fontelloDirname = files.find(
    (fileName) => fileName.startsWith("fontello-")
  );
  const zipInfos = getZipInfos(resolve3(tmpDir, fontelloDirname));
  copyFileSync(zipInfos.configFile, configFile2);
  copyFileSync(zipInfos.woff2File, woff2File);
  let cssCodes = readFileSync3(zipInfos.codesFile, { encoding: "utf-8" });
  let templateContent = readFileSync3(templateFile2, { encoding: "utf-8" });
  const fontData = await getInlineContent(zipInfos.woff2File);
  const cssContent = templateContent.replaceAll("{{FONT_FAMILY}}", `fontello-${iconSetConfig2.name}`).replaceAll("{{URL_DATA}}", fontData).replaceAll("{{PREFIX}}", zipInfos.configContent.css_prefix_text).replaceAll("{{TIMESTAMP}}", Date.now().toString()).concat(cssCodes);
  writeFileSync2(cssFile, cssContent, { encoding: "utf-8" });
  rimrafSync(tmpDir);
}

// src/cli.ts
var iconSetConfig = await getIconSetConfig(projectDir);
var configFile = resolve4(projectDir, iconSetConfig.base, "config.json");
var templateFile = resolve4(
  projectDir,
  iconSetConfig.base,
  "fontello.css.template"
);
if (!existsSync3(configFile)) {
  console.log(`config.json doesn't exists for this project
we create one.`);
  mkdirSync2(dirname4(configFile), { recursive: true });
  copyFileSync2(resolve4(templatesDir, "config.empty.json"), configFile);
}
if (!existsSync3(templateFile)) {
  console.log(`config.json doesn't exists for this project
we create one.`);
  copyFileSync2(resolve4(templatesDir, "fontello.css.template"), templateFile);
}
var { action } = await prompts2([
  {
    message: "Which action do you want ?",
    type: "select",
    name: "action",
    choices: [
      { title: "Open Fontello in your Browser", value: "open" },
      { title: "Save your font in your local system", value: "save" }
    ]
  }
]);
switch (action) {
  case "open": {
    await openBrowser(configFile);
    break;
  }
  case "save": {
    await save(iconSetConfig, configFile);
    break;
  }
}
