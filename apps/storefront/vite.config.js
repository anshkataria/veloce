import { defineConfig, searchForWorkspaceRoot } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: { allow: [searchForWorkspaceRoot(import.meta.dirname)] },
  },
  optimizeDeps: {
    exclude: ["@veloce/ui"],
  },
  test: { environment: "jsdom", setupFiles: "./src/test/setup.js", exclude: ["e2e/**", "node_modules/**"] },
});
