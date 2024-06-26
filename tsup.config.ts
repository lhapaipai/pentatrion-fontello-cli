import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/fontello.ts"],
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
});
