type IconSetConfig = {
    name: string;
    base: string;
    prefix: string;
};
type ProjectConfig = IconSetConfig | IconSetConfig[];

declare function defineConfig(config: ProjectConfig): ProjectConfig;

export { defineConfig };
