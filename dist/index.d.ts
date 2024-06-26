type IconSetConfig = {
    name: string;
    base: string;
};
type ProjectConfig = IconSetConfig | IconSetConfig[];

declare function defineConfig(config: ProjectConfig): ProjectConfig;

export { defineConfig };
