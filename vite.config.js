import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/dado-d6-estaciones-clima/",
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
