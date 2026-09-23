import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  root: "web",
  base: "./",
  publicDir: "data",
  plugins: [vue({ features: { vapor: true } })],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  fmt: {
    ignorePatterns: ["AGENTS.md", "web/data/**"],
  },
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
