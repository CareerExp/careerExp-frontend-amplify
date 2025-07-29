import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: false, // This will prevent CSS code splitting
    rollupOptions: {
      output: {
        manualChunks: undefined, // Ensures CSS is bundled properly
      },
    },
  },
  server: {
    host: true,
  },
});
