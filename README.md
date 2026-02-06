# ⚡ VNP Stack (VanJS + Navigo + Puter)

The **VNP Stack** is a "Spartan" Single Page Application (SPA) template designed for maximum performance. It swaps massive frameworks for micro-libraries, providing a full-featured reactive environment in a bundle size that is 95% smaller than React.

---

## 🚀 Key Features
- **VanJS:** The world's smallest reactive UI library (~1KB).
- **Navigo (Hash-Based):** Minimalist router configured with `{ hash: true }` for seamless static hosting (Puter, GitHub Pages, Netlify).
- **Puter:** Cloud-native state management and backend integration.
- **Vite 7 Pipeline:** Automated Brotli/Gzip compression and JS obfuscation.

---

## 🛣️ Hash-Based Routing
This stack uses **Hash Routing** (`/#/page`). 
- **Why?** Static hosts often return a 404 when a user refreshes a sub-page (e.g., `/dashboard`). By using hashes, the browser stays on `index.html`, and Navigo handles the internal view swap.
- **Usage:**
  ```javascript
  // To navigate in your code:
  window.router.navigate("/login"); // Results in your-site.com/#/login
  ```

---

## 🏗️ Expanding the Stack

### 1. Creating a Component
Components are reusable UI functions located in `src/components/`. They should accept parameters for flexibility.
```javascript
// src/components/Header.js
import van from "vanjs-core";
const { header, h1, nav, a } = van.tags;

export const Header = (title) => header(
  h1(title),
  nav(
    a({ href: "/#/" }, "Home"),
    a({ href: "/#/dashboard" }, "Dashboard")
  )
);
```

### 2. Implementing Components in a Page
To use a component, simply call it as a function within your Page's return structure.
```javascript
// src/pages/Dashboard.js
import van from "vanjs-core";
import { Header } from "../components/Header";
import { PrimaryButton } from "../components/Button";

const { div, p } = van.tags;

export const Dashboard = () => {
  return div(
    Header("User Dashboard"), // Calling the component
    p("Welcome back to the VNP Stack!"),
    PrimaryButton("Logout", () => window.router.navigate("/login"))
  );
};
```

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

## 📚 Technical Documentation

Master the core technologies driving the VNP Stack:

* **[VanJS Documentation](https://vanjs.org/)**: Reactivity, state management, and DOM tags.
* **[Navigo Documentation](https://github.com/krasimir/navigo)**: Hooks, parameters, and route matching.
* **[Puter API Docs](https://docs.puter.com/)**: Cloud KV storage, hosting, and authentication.
* **[Vite 7 Guide](https://vitejs.dev/)**: Bundling, environment variables, and plugins.
* **[Normalize.css](https://necolas.github.io/normalize.css/)**: Standardized browser default styles.

---

## 🔒 Optimization & Security
When running `npm run build:min-obf`, the stack executes:
1. **Minification:** Terser shrinks variable names and removes whitespace.
2. **Obfuscation:** Code logic is transformed to be unreadable to humans.
3. **Compression:** Generates `.br` (Brotli) and `.gz` (Gzip) copies of all assets.

---
Created by Christopher Ditfort. Licensed under ISC.
