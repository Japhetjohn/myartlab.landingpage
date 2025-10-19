/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: 'src', // Project root
  publicDir: 'public', // Photos are in src/public
  base: '/',

  server: {
    open: true, // Opens the default entry point (index.html in src)
  },

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html', // Entry point in src
      },
    },
  },

  esbuild: {
    target: 'esnext',
  },
});