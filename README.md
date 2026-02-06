# ⚡ VNP Stack (VanJS + Navigo + Puter)

The **VNP Stack** is a "Spartan" Single Page Application (SPA) template designed for maximum performance. It swaps massive frameworks for micro-libraries, providing a full-featured reactive environment in a bundle size that is 95% smaller than React.

---

## 🚀 The Power Players
- **VanJS:** The world's smallest reactive UI library (~1KB).
- **Navigo:** A powerful, minimalist router for clean client-side navigation.
- **Puter:** Cloud-native state management and backend integration.
- **Vite 7:** Next-gen tooling for instant hot-module replacement and ultra-optimized builds.

---

## 🛠️ Scripting Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Standard production build. |
| `npm run build:min` | Build with HTML/JS minification and Gzip/Brotli compression. |
| `npm run build:obf` | Build with JavaScript obfuscation for code protection. |
| `npm run build:min-obf` | The "Full Spartan": Minified, Obfuscated, and Compressed. |
| `npm run preview` | Preview the production build locally (Port 4173). |
| `npm run clean` | Deletes the `dist` folder using `rimraf`. |

---

## 🏗️ How to Expand the Stack

### 1. Adding a New Page
Pages are functional components stored in `src/pages/`.
1. Create a new file, e.g., `src/pages/about.js`.
2. Export a function that returns a VanJS element:
   ```javascript
   import van from "vanjs-core";
   const { div, h1, p } = van.tags;

   export const About = () => div(
     h1("About VNP"),
     p("This stack is built for speed.")
   );
   ```
3. Register it in `src/main.js`:
   ```javascript
   import { About } from "./pages/about";
   // ... inside router logic
   router.on("/about", () => render(About));
   ```

### 2. Adding a Component
Components are reusable UI elements in `src/components/`.
```javascript
import van from "vanjs-core";
const { button } = van.tags;

export const ActionButton = (text, action) => 
  button({ onclick: action, class: "btn-style" }, text);
```

### 3. Navigation
Since `window.router` is globally exposed in `main.js`, you can trigger navigation from any logic block or component without a page refresh:
```javascript
const handleLogin = () => {
  // logic here...
  window.router.navigate("/dashboard");
};
```

---

## 📚 Library Documentation

Master the core technologies driving the VNP Stack:

* **[VanJS Documentation](https://vanjs.org/)**: Learn about `van.state` for reactivity and the `van.tags` proxy.
* **[Navigo Documentation](https://github.com/krasimir/navigo)**: Explore hooks, parameters (`/user/:id`), and manual routing.
* **[Puter API Docs](https://docs.puter.com/)**: How to use Cloud KV storage, hosting, and auth.
* **[Vite 7 Guide](https://vitejs.dev/)**: Understand the build pipeline and environment variables.

---

## 🔒 Security & Optimization
When running `npm run build:min-obf`, the stack performs a multi-stage optimization:
1. **Minification:** Terser strips comments and shrinks variable names.
2. **Obfuscation:** Code logic is transformed to prevent reverse-engineering.
3. **Compression:** Vite generates `.br` (Brotli) and `.gz` (Gzip) copies of your assets automatically.

---

## 📁 Project Structure
- `src/main.js` - The application entry point and router orchestrator.
- `src/pages/` - Application views/routes.
- `src/components/` - Reusable UI logic.
- `public/` - Static assets (favicons, etc).
- `vite.config.js` - The high-performance build configuration.

---
Created by Christopher Ditfort. Licensed under ISC.
