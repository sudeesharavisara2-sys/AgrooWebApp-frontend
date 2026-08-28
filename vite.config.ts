import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: {
    // sockjs-client expects Node's `global` object, which doesn't exist in
    // the browser. Vite doesn't polyfill it like Webpack/CRA did.
    global: 'globalThis',
  },
});