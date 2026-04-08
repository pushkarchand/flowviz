import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@browser": path.resolve(__dirname, "./src/pages/browser"),
      "@css": path.resolve(__dirname, "./src/pages/css"),
      "@js": path.resolve(__dirname, "./src/pages/js"),
      "@data": path.resolve(__dirname, "./src/data"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@shared": path.resolve(__dirname, "./src/components/shared"),
      "@i18n": path.resolve(__dirname, "./src/i18n"),
      "@engine": path.resolve(__dirname, "./src/engine"),
      "@content": path.resolve(__dirname, "./src/content"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
