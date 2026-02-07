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

## 🌍 SEO & Routing Modes

The VNP Stack features a "Virtual SEO Engine" that allows you to swap metadata (Title, Description, Keywords) dynamically during navigation.

### 1. Configuration (`src/config.js`)
Toggle between **SaaS Mode** (easy setup) and **SEO Mode** (best for indexing) in your central config:

```javascript
export const APP_CONFIG = {
  // ✅ Set to 'true' for Hash Routing (e.g., [site.com/#/dashboard](https://site.com/#/dashboard))
  // 🚀 Set to 'false' for Path Routing (e.g., [site.com/dashboard](https://site.com/dashboard))
  USE_HASH_ROUTING: true, 

  DEFAULT_SEO: {
    title: "VNP Forge",
    description: "Ultra-fast AI Site Builder",
    keywords: "vanjs, puter, spa"
  }
};

### 2. Implementation
The `render` function in `main.js` merges your global defaults with page-specific data. This ensures that even if you only provide a title, the description and keywords fall back to your brand defaults.

```javascript
// src/main.js
const render = (page, seoConfig = {}) => {
  // Merges DEFAULT_SEO with the specific page config
  updateSEO({
    ...APP_CONFIG.DEFAULT_SEO,
    ...seoConfig
  });

  app.replaceChildren(page());
};

// Usage in Routes
router
  .on("/", () => render(Home)) // Uses all defaults
  .on("/dashboard", () => render(Dashboard, { 
    title: "User Dashboard",
    description: "Manage your VNP projects here." 
  }))
  .resolve();
```

### 3. Choosing Your Mode

| Feature | **SaaS Mode (Hash: true)** | **SEO Mode (Path: false)** |
| :--- | :--- | :--- |
| **URL Format** | `yoursite.com/#/dashboard` | `yoursite.com/dashboard` |
| **SEO Indexing** | Primarily the Home Page. | Every sub-page is indexed by Google. |
| **Setup Level** | **Zero Config.** Works on any host. | **Server Config Required.** |
| **Best For** | Apps, Dashboards, Internal Tools. | Business Sites, Blogs, Portfolios. |



---

## ⚠️ Critical: Server Configuration for Path Routing

If you choose to set `USE_HASH_ROUTING: false`, you **must** configure your web server or hosting provider (Puter, Netlify, Vercel, etc.) to handle "Catch-all" redirects.

### The Problem
In a Single Page Application (SPA), the browser handles all the routing logic. However, if a user refreshes the page while at `yoursite.com/dashboard`, or types that URL directly into the bar, the server will look for a physical folder or file named `/dashboard`. Since that doesn't exist, the server will return a **404 Not Found** error.

### The Fix: "Catch-All" Redirects
You must tell your server: *"If you don't find a file, just send `index.html` anyway."* Once `index.html` loads, the **Navigo** router will wake up, look at the URL path, and render the correct view.

#### How to set this up on common hosts:
* **Puter Hosting:** In your hosting settings or `puter.json` config, set the **Error Document** (or 404 fallback) to `/index.html`.
* **Netlify:** Create a file named `_redirects` in your `public` folder with the following line:
    `/* /index.html  200`
* **Vercel:** Add a `vercel.json` file to your root:
    ```json
    { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
    ```
* **Apache (.htaccess):** `FallbackResource /index.html`
* **Nginx:**
    `try_files $uri $uri/ /index.html;`

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
