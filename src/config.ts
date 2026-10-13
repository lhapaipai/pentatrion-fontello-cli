import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";

import prompts from "prompts";
import { program } from "commander";
import { IconSetConfig, ProjectAnswers, ProjectConfig } from "./types";

export const packageDir = dirname(fileURLToPath(import.meta.url));
export const templatesDir = resolve(packageDir, "../templates");
export const projectDir = cwd();

export function getIconSetFiles(
  fontelloDir: string,
  iconSetConfig: IconSetConfig,
) {
  const idFile = resolve(fontelloDir, ".fontello");
  const cssFile = resolve(fontelloDir, iconSetConfig.cssFile);
  const templateFile = resolve(
    fontelloDir,
    `${iconSetConfig.cssFile}.template`,
  );
  const woff2File = resolve(fontelloDir, "fontello.woff2");

  if (!existsSync(idFile)) {
    console.log(
      `${idFile} doesn't exists open fontello in your browser before saving`,
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

export async function getIconSetConfig(
  projectDir: string,
): Promise<IconSetConfig> {
  const partialConfig = await resolveIconSetConfig(projectDir);
  return {
    base: "",
    fontFamily: "fontello",
    cssFile: "fontello.css",
    ...partialConfig,
  };
}

export async function resolveIconSetConfig(
  projectDir: string,
): Promise<Partial<IconSetConfig>> {
  program.option(
    "-f, --fontello-config <config>",
    "Icon Set configuration",
    "config.json",
  );
  program.option(
    "-p, --project-config <config>",
    "js file containing multiple Icon Set configurations",
    "fontello.config.js",
  );
  program.parse();
  const options = program.opts();

  let fontelloConfigFile = resolve(projectDir, options.fontelloConfig);
  const projectConfigFile = resolve(projectDir, options.projectConfig);

  if (!existsSync(fontelloConfigFile)) {
    if (!existsSync(projectConfigFile)) {
      console.log(
        `${projectConfigFile} or ${fontelloConfigFile} doesn't exists for this project`,
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
            choices: projectConfig.map(({ fontFamily }, index) => ({
              title: fontFamily,
              value: index,
            })),
          },
        ]);
        return projectConfig[parseInt(answers.iconSetIndex)];
      }
    }
  }

  return {
    base: dirname(options.fontelloConfig),
  };
}
