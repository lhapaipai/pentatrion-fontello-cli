import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";

import prompts from "prompts";
import { program } from "commander";
import {
  FontelloConfig,
  IconSetConfig,
  ProjectAnswers,
  ProjectConfig,
} from "./types";

export const packageDir = dirname(fileURLToPath(import.meta.url));
export const templatesDir = resolve(packageDir, "../templates");
export const projectDir = cwd();
export const tmpDir = resolve(projectDir, "tmp");

export function getIconSetFiles(fontelloDir: string) {
  const idFile = resolve(fontelloDir, ".fontello");
  const cssFile = resolve(fontelloDir, "fontello.css");
  const templateFile = resolve(fontelloDir, "fontello.css.template");
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
    templateFile,
    woff2File,
  };
}

export function getZipInfos(zipContentDir: string) {
  const configFile = resolve(zipContentDir, "config.json");

  let configContent = JSON.parse(
    readFileSync(configFile, { encoding: "utf-8" })
  ) as FontelloConfig;

  const woff2File = resolve(zipContentDir, `font/${configContent.name}.woff2`);
  const codesFile = resolve(
    zipContentDir,
    `css/${configContent.name}-codes.css`
  );

  return { configFile, woff2File, codesFile, configContent };
}

export async function getIconSetConfig(
  projectDir: string
): Promise<IconSetConfig> {
  const partialConfig = await resolveIconSetConfig(projectDir);
  return {
    base: "",
    name: "default",
    ...partialConfig,
  };
}

export async function resolveIconSetConfig(
  projectDir: string
): Promise<Partial<IconSetConfig>> {
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

  let configFile = resolve(projectDir, options.iconsConfig);
  const projectConfigFile = resolve(projectDir, options.projectConfig);

  if (!existsSync(configFile)) {
    if (!existsSync(projectConfigFile)) {
      console.log(
        `${projectConfigFile} or ${configFile} doesn't exists for this project`
      );
      process.exit(0);
    } else {
      const projectConfig = (await import(projectConfigFile))
        .default as ProjectConfig;

      if (!Array.isArray(projectConfig)) {
        return projectConfig;
      } else if (projectConfig.length === 0) {
        console.log("configure at least one project in your workspace");
        process.exit(0);
      } else if (projectConfig.length === 1) {
        return projectConfig[0];
      } else {
        const answers: ProjectAnswers = await prompts([
          {
            message: "Which Icon set do you want to use ?",
            type: "select",
            name: "iconSetIndex",
            choices: projectConfig.map(({ name }, index) => ({
              title: name,
              value: index,
            })),
          },
        ]);
        return projectConfig[parseInt(answers.iconSetIndex)];
      }
    }
  }

  return {
    base: dirname(options.iconsConfig),
  };
}
