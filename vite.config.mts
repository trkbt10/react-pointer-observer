import { defineConfig as defineVitestConfig } from "vitest/config";
import path from "node:path";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { mergeConfig } from "vitest/config";
import dts from "vite-plugin-dts";
const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
  },
});
const viteConfig = defineConfig({
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      formats: ["es", "cjs"],
      fileName: (format) => {
        if (format === "es") return "[name].mjs";
        if (format === "cjs") return "[name].js";
        return `[name].${format}.js`;
      },
    },
    minify: true,
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [
    viteReact({
      include: "./src/**/*.tsx",
    }),
    dts({
      insertTypesEntry: true,
      outDir: "dist",
      include: "./src/**/*.ts",
      entryRoot: "./src",
    }),
  ],
});

export default mergeConfig(viteConfig, {
  ...vitestConfig,
});
