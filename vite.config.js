/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: 'src', // Ensure root is 'src'
  publicDir: 'public',
  base: '/',

  server: {
    open: true,
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },

  css: {
    postcss: {
      plugins: [
        tailwindcss('./tailwind.config.cjs'), // Using .cjs for now
        autoprefixer(),
      ],
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: new URL('src/index.html', import.meta.url).pathname, // Dynamic path resolution
      },
    },
  },

  esbuild: {
    target: 'esnext',
  },
});