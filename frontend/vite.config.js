import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
    allowedHosts: [
      "making-paving-hangnail.ngrok-free.dev"
    ],
    // proxy: {
    //   '/api': {
    //     target: 'https://hackathon-swiftsupport.vercel.app',
    //     changeOrigin: true,
    //   }
    // }
  }
});
