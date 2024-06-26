import { defineConfig } from "tsup";

export default defineConfig([
  {
    dts: true,
    entry: ["src/cli.ts"],
    format: ["esm"],
    esbuildOptions(options) {
      options.external = [
        "axios",
        "commander",
        "extract-zip",
        "form-data",
        "open",
        "prompts",
        "rimraf",
      ];
    },
    outDir: "bin",
    shims: true,
    clean: true,
    minify: false,
  },
  {
    dts: true,
    entry: ["src/index.ts"],
    format: ["esm"],
    outDir: "dist",
    shims: true,
    clean: true,
    minify: false,
  },
]);
