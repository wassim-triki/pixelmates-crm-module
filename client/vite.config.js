import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // base: '/vite/demo',
  server: {
    port: 4000,
  },
  plugins: [react()],
});
