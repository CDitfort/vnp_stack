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
| `npm run dev` | Starts Vite dev server with HMR. |
| `npm run build:min-obf` | The "Full Spartan": Minified, Obfuscated, and Compressed. |
| `npm run preview` | Locally test your production build (Port 4173). |
| `npm run clean` | Resets the project by deleting the `dist` folder. |

---

## 🔒 Optimization Pipeline
Running `npm run build:min-obf` triggers:
1. **Terser:** Aggressive JS minification.
2. **Obfuscator:** Protects logic from prying eyes.
3. **Compression:** Generates `.br` and `.gz` files for instant load times.

---
Created by Christopher Ditfort. Licensed under ISC.
