import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    outDir: 'standalone',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/main.jsx'),
      name: 'MathVisualLab',
      formats: ['iife'],
      fileName: () => 'math-lab.iife.js'
    },
    rollupOptions: {
      output: {
        assetFileNames: 'math-lab.css'
      }
    }
  }
});
