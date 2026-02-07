import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { compression } from 'vite-plugin-compression2';
import obfuscator from 'vite-plugin-javascript-obfuscator';
import Sitemap from 'vite-plugin-sitemap'; 
import { APP_CONFIG } from './src/config.js'; 

export default defineConfig(({ mode }) => {
  const isMinify = mode === "min" || mode === "min-obf";
  const isObfuscate = mode === "obf" || mode === "min-obf";

  // Check if we need to run the Sitemap plugin at all
  const shouldRunSEO = APP_CONFIG.SITE_MAP?.ENABLED || APP_CONFIG.ROBOTS?.ENABLED;

  return {
    root: ".",
    publicDir: "public",
    
    resolve: {
      alias: { "@": resolve(__dirname, "src") },
    },

    css: {
      modules: { localsConvention: "camelCaseOnly" },
    },

    server: {
      port: 5173,
      historyApiFallback: true, 
    },

    plugins: [
      // 🗺️ 1. CONDITIONAL SEO GENERATION
      ...(shouldRunSEO ? [
        Sitemap({ 
          hostname: APP_CONFIG.SITE_MAP.hostname,
          dynamicRoutes: APP_CONFIG.SITE_MAP.routes,
          exclude: APP_CONFIG.SITE_MAP.exclude,
          readable: true,
          // Individual toggles from your config
          generateRobotsTxt: APP_CONFIG.ROBOTS?.ENABLED,
          robots: APP_CONFIG.ROBOTS?.policies,
          disable: !APP_CONFIG.SITE_MAP?.ENABLED 
        })
      ] : []),

      createHtmlPlugin({ minify: isMinify }),

      // 🛠️ 2. BUNDLE POSITIONING
      {
        name: "force-bundle-to-bottom",
        enforce: "post",
        transformIndexHtml(html) {
          const scriptTagRegex = /<script type="module" crossorigin src="\/assets\/js\/main\.js"><\/script>/;
          const match = html.match(scriptTagRegex);
          if (match) {
            const scriptTag = match[0];
            return html.replace(scriptTag, "").replace("</body>", `  ${scriptTag}\n</body>`);
          }
          return html;
        },
      },

      // 🔒 3. OBFUSCATION (Conditional)
      ...(isObfuscate ? [
        obfuscator({
          options: {
            compact: true,
            controlFlowFlattening: true,
            stringArray: true,
            stringArrayThreshold: 0.75,
          },
        })
      ] : []),

      // 📦 4. COMPRESSION (Conditional)
      ...(isMinify ? [
        compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
        compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
      ] : []),
    ],

    build: {
      outDir: "dist",
      emptyOutDir: true,
      minify: isMinify ? "terser" : false,
      rollupOptions: {
        input: resolve(__dirname, "index.html"),
        external: ["@heyputer/puter.js"],
        output: {
          entryFileNames: "assets/js/main.js",
          chunkFileNames: "assets/js/main.js",
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) return 'assets/css/screen.css';
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  };
});