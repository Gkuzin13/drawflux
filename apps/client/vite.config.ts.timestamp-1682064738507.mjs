// vite.config.ts
import react from "file:///home/georgy/Desktop/Dev/Projects/sketch-app/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.2.1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/georgy/Desktop/Dev/Projects/sketch-app/node_modules/.pnpm/vite@4.2.1_@types+node@18.15.11/node_modules/vite/dist/node/index.js";
var __vite_injected_original_import_meta_url = "file:///home/georgy/Desktop/Dev/Projects/sketch-app/apps/client/vite.config.ts";
var vite_config_default = defineConfig({
  server: { port: 5174 },
  plugins: [react()],
  resolve: {
    alias: {
      "@/": new URL("./src/", __vite_injected_original_import_meta_url).pathname
    }
  },
  test: {
    globals: true,
    setupFiles: ["./test/setup.ts"],
    environment: "jsdom",
    deps: {
      // Temporary workaround
      // Otherwise throws "ERR_MODULE_NOT_FOUND"
      registerNodeLoader: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9nZW9yZ3kvRGVza3RvcC9EZXYvUHJvamVjdHMvc2tldGNoLWFwcC9hcHBzL2NsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvZ2Vvcmd5L0Rlc2t0b3AvRGV2L1Byb2plY3RzL3NrZXRjaC1hcHAvYXBwcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvZ2Vvcmd5L0Rlc2t0b3AvRGV2L1Byb2plY3RzL3NrZXRjaC1hcHAvYXBwcy9jbGllbnQvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7IHBvcnQ6IDUxNzQgfSxcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdALyc6IG5ldyBVUkwoJy4vc3JjLycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgc2V0dXBGaWxlczogWycuL3Rlc3Qvc2V0dXAudHMnXSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBkZXBzOiB7XG4gICAgICAvLyBUZW1wb3Jhcnkgd29ya2Fyb3VuZFxuICAgICAgLy8gT3RoZXJ3aXNlIHRocm93cyBcIkVSUl9NT0RVTEVfTk9UX0ZPVU5EXCJcbiAgICAgIHJlZ2lzdGVyTm9kZUxvYWRlcjogdHJ1ZSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsb0JBQW9CO0FBSDJMLElBQU0sMkNBQTJDO0FBS3pRLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVEsRUFBRSxNQUFNLEtBQUs7QUFBQSxFQUNyQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTSxJQUFJLElBQUksVUFBVSx3Q0FBZSxFQUFFO0FBQUEsSUFDM0M7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxZQUFZLENBQUMsaUJBQWlCO0FBQUEsSUFDOUIsYUFBYTtBQUFBLElBQ2IsTUFBTTtBQUFBO0FBQUE7QUFBQSxNQUdKLG9CQUFvQjtBQUFBLElBQ3RCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
