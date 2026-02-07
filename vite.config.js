import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { compression } from 'vite-plugin-compression2';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => {
  const isMinify = mode === "min" || mode === "min-obf";
  const isObfuscate = mode === "obf" || mode === "min-obf";

  return {
    root: ".",
    publicDir: "public",
    
    // 🛠️ 1. PATH ALIASES
    // This allows you to use '@' to refer to your 'src' directory
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },

    // 🎨 2. CSS MODULE CONFIG
    css: {
      modules: {
        // This allows you to write .home-wrapper in CSS 
        // but access it as s.homeWrapper in JS
        localsConvention: "camelCaseOnly",
      },
    },

    server: {
      port: 5173,
      historyApiFallback: true, 
    },

    plugins: [
      createHtmlPlugin({
        minify: isMinify,
      }),
      {
        name: "force-bundle-to-bottom",
        enforce: "post",
        transformIndexHtml(html) {
          const scriptTagRegex = /<script type="module" crossorigin src="\/assets\/js\/main\.js"><\/script>/;
          const match = html.match(scriptTagRegex);

          if (match) {
            const scriptTag = match[0];
            return html
              .replace(scriptTag, "")
              .replace("</body>", `  ${scriptTag}\n</body>`);
          }
          return html;
        },
      },
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
      ...(isMinify ? [
        compression({
          algorithm: 'gzip',
          exclude: [/\.(br)$/, /\.(gz)$/],
        }),
        compression({
          algorithm: 'brotliCompress',
          exclude: [/\.(br)$/, /\.(gz)$/],
        }),
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
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/css/screen.css';
            }
            return 'assets/[name].[ext]';
          },
        },
      },
    },
  };
});