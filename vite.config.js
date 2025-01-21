import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Change 4000 to your desired port number
  },
  include: [
    // Add file paths that need JSX support
    "src/**/*.js",
    "src/**/*.jsx",
  ],
});
