import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from '@svgr/rollup';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    svgr({
      ref: true,
      svgo: false,
      titleProp: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
      components: path.resolve(__dirname, './src/components'),
      services: path.resolve(__dirname, './src/services'),
      util: path.resolve(__dirname, './src/util'),
      hooks: path.resolve(__dirname, './src/hooks'),
      ui: path.resolve(__dirname, './src/ui'),
      styles: path.resolve(__dirname, './src/styles'),
      data: path.resolve(__dirname, './src/data'),
      types: path.resolve(__dirname, './src/types'),
      lib: path.resolve(__dirname, './src/lib'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});
