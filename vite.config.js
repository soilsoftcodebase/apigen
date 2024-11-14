// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     // host: '127.0.0.1', // Custom hostname (use '0.0.0.0' for all available IPs)
//     port: 3001, // Custom port
//     open: true, // Opens the browser automatically
//   },
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Change 4000 to your desired port number
  },
});
