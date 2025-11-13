import { defineConfig } from "vite";
import path from "path";
import fs from "fs";

export default defineConfig({
  root: path.resolve(__dirname, "src/renderer"),
  build: {
    outDir: path.resolve(__dirname, "dist/renderer"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, "src/renderer/main.ts"),
    },
  },
  resolve: {
    alias: {
      "@core": path.resolve(__dirname, "src/renderer/core"),
      "@config": path.resolve(__dirname, "src/renderer/config"),
      "@runtime": path.resolve(__dirname, "src/renderer/runtime"),
      "@ui": path.resolve(__dirname, "src/renderer/ui"),
      "@services": path.resolve(__dirname, "src/services"),
      "@types": path.resolve(__dirname, "src/types"),
    },
  },
  plugins: [
    {
      name: "copy-legacy-assets",
      closeBundle() {
        const projectRoot = __dirname;
        const distRoot = path.resolve(projectRoot, "dist");
        const rendererDist = path.resolve(distRoot, "renderer");

        const copyFile = (sourceRelative: string, destinationRelative: string) => {
          const source = path.resolve(projectRoot, sourceRelative);
          const destination = path.resolve(projectRoot, destinationRelative);

          if (!fs.existsSync(source)) {
            return;
          }

          fs.mkdirSync(path.dirname(destination), { recursive: true });
          fs.copyFileSync(source, destination);
        };

        // Copy legacy runtime assets next to the renderer output so relative paths remain stable.
        copyFile("fallback-bundle.js", path.relative(projectRoot, path.join(distRoot, "fallback-bundle.js")));
        copyFile("configure_gemini_aq.js", path.relative(projectRoot, path.join(distRoot, "configure_gemini_aq.js")));
        copyFile("src/config/tactics.js", path.relative(projectRoot, path.join(distRoot, "src/config/tactics.js")));

        // Preserve fallback bundle in renderer directory for dev servers that expect it locally.
        copyFile("fallback-bundle.js", path.relative(projectRoot, path.join(rendererDist, "fallback-bundle.js")));
      },
    },
  ],
});
