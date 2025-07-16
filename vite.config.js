import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "",
  server: { 
    port: 12001,
    host: "0.0.0.0",
    strictPort: false,
    cors: true,
    allowedHosts: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *"
    }
  },
  preview: {
    port: 12000,
    host: "0.0.0.0",
    strictPort: true,
    cors: true,
    allowedHosts: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "X-Frame-Options": "ALLOWALL",
      "Content-Security-Policy": "frame-ancestors *"
    }
  }
});
