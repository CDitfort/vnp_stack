import { defineConfig } from "vite";
import { resolve } from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import { compression } from 'vite-plugin-compression2';
import obfuscator from 'vite-plugin-javascript-obfuscator';

export default defineConfig(({ mode }) => {
  // Logic to determine what to do based on the --mode flag
  const isMinify = mode === "min" || mode === "min-obf";
  const isObfuscate = mode === "obf" || mode === "min-obf";

  return {
    root: ".",
    publicDir: "public",
    plugins: [
      createHtmlPlugin({
        minify: isMinify,
      }),
      // Custom plugin to move the main.js script to the bottom of <body>
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
      // 1. OBFUSCATE: Runs during the build process
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
      // 2. COMPRESS: Runs LAST so it compresses the obfuscated code
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