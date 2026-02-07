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
    
    // 🛠️ ADDED: Development Server Config
    server: {
      port: 5173,
      historyApiFallback: true, // Redirects 404s to index.html in dev
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