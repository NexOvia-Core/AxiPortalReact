import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const bffOrigin = process.env.VITE_BFF_ORIGIN || "http://localhost/AxiPortalBFF";

export default defineConfig({
  base: process.env.VITE_APP_BASE_PATH || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-framer": ["framer-motion"],
          "vendor-react": ["react", "react-dom", "wouter"],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    proxy: {
      "/api": {
        target: bffOrigin,
        changeOrigin: true,
        secure: false,
      },
      "/axiportal/api": {
        target: bffOrigin,
        changeOrigin: true,
        secure: false,
        rewrite: requestPath => requestPath.replace(/^\/axiportal/, ""),
      },
    },
  },
});
