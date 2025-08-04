import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { peerDependencies } from "./package.json";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: [
        resolve(__dirname, "lib/index.ts"),
        resolve(__dirname, "lib/form.ts"),
      ],
      name: "create-react-context",
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies)]
    },
    sourcemap: true,
    emptyOutDir: true
  },
  resolve: { alias: { "@": resolve(__dirname, "lib") } },
  plugins: [dts({
    tsconfigPath: resolve(__dirname, "tsconfig.app.json"),
  })],
});
