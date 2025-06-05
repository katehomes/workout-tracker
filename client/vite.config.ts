import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,           // allows access from Docker container
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,   // required for reliable file watching in Docker
    },
  },
});


