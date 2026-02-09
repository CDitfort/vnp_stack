import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";
import { createHtmlPlugin } from "vite-plugin-html";
import { compression } from 'vite-plugin-compression2';
import obfuscator from 'vite-plugin-javascript-obfuscator';
import Sitemap from 'vite-plugin-sitemap';
import { APP_CONFIG } from './src/config.js';

/**
 * 🗺️ Auto-discover page routes from src/pages/ folder structure.
 * Mirrors the same algorithm used in main.js at runtime.
 *   pages/Home/home.js                   → /
 *   pages/Dashboard/dashboard.js         → /dashboard
 *   pages/Dashboard/Profile/profile.js   → /dashboard/profile
 * The "notfound" route is excluded automatically.
 */
function discoverPageRoutes(pagesDir) {
  const routes = [];

  function scan(dir, segments) {
    const entries = readdirSync(dir, { withFileTypes: true });
    const hasPageFile = entries.some((e) => e.isFile() && e.name.endsWith('.js'));

    if (hasPageFile && segments.length > 0) {
      const lastSegment = segments[segments.length - 1].toLowerCase();
      if (lastSegment !== 'notfound') {
        let route = '/' + segments.map((s) => s.toLowerCase()).join('/');
        if (route === '/home') route = '/';
        routes.push(route);
      }
    }

    for (const entry of entries) {
      if (entry.isDirectory()) {
        scan(resolve(dir, entry.name), [...segments, entry.name]);
      }
    }
  }

  scan(pagesDir, []);
  return routes;
}

export default defineConfig(({ mode }) => {
  const isMinify = mode === "min" || mode === "min-obf";
  const isObfuscate = mode === "obf" || mode === "min-obf";

  // Check if we need to run the Sitemap plugin at all
  const shouldRunSEO = APP_CONFIG.SITE_MAP?.ENABLED || APP_CONFIG.ROBOTS?.ENABLED;

  // Auto-discover routes and apply exclude filter (prefix matching)
  const excludeList = APP_CONFIG.SITE_MAP?.exclude || [];
  const sitemapRoutes = shouldRunSEO
    ? discoverPageRoutes(resolve(__dirname, 'src/pages')).filter(
        (route) => !excludeList.some(
          (ex) => route === ex || route.startsWith(ex + '/')
        )
      )
    : [];

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
          dynamicRoutes: sitemapRoutes,
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