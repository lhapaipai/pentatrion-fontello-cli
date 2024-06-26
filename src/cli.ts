#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

import prompts from "prompts";
import { projectDir, getIconSetConfig, templatesDir } from "./config";
import { openBrowser } from "./action/open";
import { save } from "./action/save";
import { ActionAnswers } from "./types";

const iconSetConfig = await getIconSetConfig(projectDir);

const configFile = resolve(projectDir, iconSetConfig.base, "config.json");
const templateFile = resolve(
  projectDir,
  iconSetConfig.base,
  `${iconSetConfig.cssFile}.template`
);
if (!existsSync(configFile)) {
  console.log(`config.json doesn't exists for this project\nwe create one.`);
  mkdirSync(dirname(configFile), { recursive: true });

  copyFileSync(resolve(templatesDir, "config.empty.json"), configFile);
}
if (!existsSync(templateFile)) {
  console.log(`config.json doesn't exists for this project\nwe create one.`);
  copyFileSync(resolve(templatesDir, "fontello.css.template"), templateFile);
}

const { action }: ActionAnswers = await prompts([
  {
    message: "Which action do you want ?",
    type: "select",
    name: "action",
    choices: [
      { title: "Open Fontello in your Browser", value: "open" },
      { title: "Save your font in your local system", value: "save" },
    ],
  },
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
