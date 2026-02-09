# VNP Stack (VanJS + Navigo + Puter)

The **VNP Stack** is a lightweight Single Page Application (SPA) template built on micro-libraries. It provides a full-featured reactive environment — routing, state management, authentication, and a build pipeline — in a bundle that is a fraction of the size of React or Vue.

---

## Key Features

- **VanJS** — The world's smallest reactive UI library (~1KB). Fine-grained DOM reactivity with zero virtual DOM overhead.
- **Navigo** — Minimalist router with hash or path-based routing, hooks, and middleware.
- **Puter** — Cloud-native authentication, key-value storage, and static hosting.
- **Store System** — Built-in state management (`atom`, `map`, `computed`) layered on VanJS primitives. No subscriptions, no cleanup.
- **Vite 7 Pipeline** — Four build modes with optional Brotli/Gzip compression and JS obfuscation.
- **Auto Page Discovery** — Drop a folder in `src/pages/` and it becomes a route automatically. Nested folders create nested routes to any depth.
- **CSS Modules** — Scoped styles per page and component by default.
- **SEO Metadata** — Per-page title, description, and keywords with config-driven sitemap and robots.txt generation.

---

## Project Structure

```
src/
├── components/          Reusable UI components (Navbar, Footer, etc.)
│   └── Navbar/
│       ├── navbar.js
│       └── navbar.module.css
├── pages/               Each folder = one route (auto-registered)
│   ├── Home/
│   │   ├── home.js
│   │   └── home.module.css
│   ├── Dashboard/
│   │   ├── dashboard.js
│   │   ├── dashboard.module.css
│   │   └── Profile/          Nested folders = nested routes
│   │       ├── profile.js
│   │       └── profile.module.css
│   └── ...
├── stores/              Shared reactive state (atom, map, computed)
│   └── user.js
├── utils/               Utilities (store engine, SEO, auth)
│   ├── store.js
│   ├── seo.js
│   └── auth.js
├── config.js            Central app configuration
├── routes.js            Route overrides and middleware hooks
├── main.js              Entry point (router, auto-imports, render engine)
└── style.css            Global styles and page transitions
```

---

## Quick Start

### Using npx (recommended)

```bash
npx create-vnp-app my-project
cd my-project
npm install
npm run dev
```

### Using npm create

```bash
npm create vnp-app my-project
cd my-project
npm install
npm run dev
```

### Manual clone

```bash
git clone https://github.com/CDitfort/vnp_stack.git my-project
cd my-project
npm install
npm run dev
```

Dev server starts at `http://localhost:5173`.

---

## Pages & Auto-Registration

Every `.js` file inside `src/pages/` is automatically discovered and registered as a route. The **folder hierarchy** determines the path:

| File | Route |
| :--- | :--- |
| `src/pages/Home/home.js` | `/` |
| `src/pages/Dashboard/dashboard.js` | `/dashboard` |
| `src/pages/Dashboard/Profile/profile.js` | `/dashboard/profile` |
| `src/pages/Dashboard/Profile/Edit/edit.js` | `/dashboard/profile/edit` |
| `src/pages/Privacy/privacy.js` | `/privacy` |
| `src/pages/NotFound/notfound.js` | 404 fallback |

No manual route registration is needed. Any depth of nesting is supported automatically.

### Adding a Top-Level Page

1. Create a folder in `src/pages/` (e.g., `Settings/`).
2. Add a `.js` file with a matching name (e.g., `settings.js`).
3. Export a named function that matches the filename.

```javascript
// src/pages/Settings/settings.js
import van from "vanjs-core";
import s from "./Settings.module.css";

const { div, h1, p } = van.tags;

export const Settings = () => {
  return div({ class: s.wrapper },
    h1("Settings"),
    p("Your settings page content here.")
  );
};

Settings.seo = {
  title: "Settings | My App",
  description: "Manage your account settings."
};
```

The route `/settings` is now live. No other files need to change.

### Adding a Nested Page

To create a route like `/dashboard/profile`, add a subfolder inside the parent page folder:

```
src/pages/
└── Dashboard/
    ├── dashboard.js
    ├── dashboard.module.css
    └── Profile/
        ├── profile.js
        └── profile.module.css
```

```javascript
// src/pages/Dashboard/Profile/profile.js
import van from "vanjs-core";
import s from "./profile.module.css";

const { div, h1, p } = van.tags;

export const Profile = () => {
  return div({ class: s.wrapper },
    h1("Profile"),
    p("Your profile page content here.")
  );
};

Profile.seo = {
  title: "Profile | My App",
  description: "View and edit your profile."
};
```

The route `/dashboard/profile` (or `/#/dashboard/profile` with hash routing) is now live. You can nest further — a `Profile/Edit/edit.js` subfolder would create `/dashboard/profile/edit`, and so on to any depth.

---

## Components

Components are reusable UI functions in `src/components/`. They accept props and return VanJS DOM trees.

```javascript
// src/components/Alert/alert.js
import van from "vanjs-core";
import s from "./Alert.module.css";

const { div, p, button } = van.tags;

export const Alert = ({ message, onDismiss }) => {
  return div({ class: s.alert },
    p(message),
    button({ onclick: onDismiss }, "Dismiss")
  );
};
```

Use components by calling them inside a page:

```javascript
import { Alert } from "@/components/Alert/alert.js";

export const Home = () => {
  return div(
    Alert({ message: "Welcome back!", onDismiss: () => console.log("dismissed") }),
    p("Page content...")
  );
};
```

---

## State Management (Store System)

The store system lives in `src/utils/store.js` and provides three primitives built on `van.state()` and `van.derive()`. Because everything is native VanJS reactivity under the hood, DOM bindings update automatically and clean up naturally when nodes are removed — no subscriptions, no memory leaks.

### `atom(initialValue)` — Reactive Primitive

A single reactive value with helpers for reset and functional update.

```javascript
import { atom } from "@/utils/store.js";

const count = atom(0);

// Read
count.val;              // 0

// Write
count.val = 5;          // direct assignment

// Functional update
count.update(n => n + 1); // 6

// Reset to initial value
count.reset();          // back to 0
```

Use in a component:

```javascript
import van from "vanjs-core";
import { atom } from "@/utils/store.js";

const { div, p, button } = van.tags;
const count = atom(0);

export const Counter = () => {
  return div(
    p(() => `Count: ${count.val}`),
    button({ onclick: () => count.update(n => n + 1) }, "+1"),
    button({ onclick: () => count.reset() }, "Reset")
  );
};
```

### `map(initialObject)` — Reactive Object Store

Each key in the object becomes its own `van.state`. Ideal for grouped state like user sessions, form data, or theme settings.

```javascript
import { map } from "@/utils/store.js";

const userStore = map({
  username: "",
  isLoggedIn: false
});

// Read a single key
userStore.username.val;                    // ""

// Write a single key
userStore.username.val = "Chris";

// Bulk write multiple keys
userStore.set({ username: "Chris", isLoggedIn: true });

// Snapshot all current values as a plain object
userStore.get();                           // { username: "Chris", isLoggedIn: true }

// Reset all keys to their initial values
userStore.reset();                         // { username: "", isLoggedIn: false }
```

Use in a component:

```javascript
import van from "vanjs-core";
import { map } from "@/utils/store.js";

const { div, h1, input } = van.tags;

const profile = map({ name: "", bio: "" });

export const ProfileEditor = () => {
  return div(
    input({
      placeholder: "Name",
      value: profile.name.val,
      oninput: (e) => { profile.name.val = e.target.value; }
    }),
    input({
      placeholder: "Bio",
      value: profile.bio.val,
      oninput: (e) => { profile.bio.val = e.target.value; }
    }),
    h1(() => `Hello, ${profile.name.val || "stranger"}`)
  );
};
```

### `computed(fn)` — Derived State

A read-only value that recalculates automatically when any `van.state` it reads changes.

```javascript
import { map, computed } from "@/utils/store.js";

const cart = map({ price: 10, quantity: 2 });

const total = computed(() => cart.price.val * cart.quantity.val);
total.val;  // 20

cart.quantity.val = 5;
total.val;  // 50 (auto-updated)
```

Use in a component:

```javascript
import van from "vanjs-core";
import { map, computed } from "@/utils/store.js";

const { div, p, button } = van.tags;

const cart = map({ price: 10, quantity: 1 });
const total = computed(() => `$${(cart.price.val * cart.quantity.val).toFixed(2)}`);

export const Cart = () => {
  return div(
    p(() => `Quantity: ${cart.quantity.val}`),
    p(() => `Total: ${total.val}`),
    button({ onclick: () => cart.quantity.update(q => q + 1) }, "Add one")
  );
};
```

### Creating a Store File

For shared state across multiple pages or components, create a file in `src/stores/`:

```javascript
// src/stores/user.js
import { map, computed } from "@/utils/store.js";

export const userStore = map({
  username: "",
  isLoggedIn: false
});

export const displayName = computed(() =>
  userStore.username.val || "Guest"
);

export const syncSession = async () => {
  const user = await window.puter.auth.getUser();
  if (user) {
    userStore.set({ username: user.username, isLoggedIn: true });
    return true;
  }
  return false;
};
```

Then import from anywhere:

```javascript
// In a page — read the store
import { userStore, displayName, syncSession } from "@/stores/user.js";
h1(() => `Welcome, ${displayName.val}`);

// In the navbar — reset on logout
import { userStore } from "@/stores/user.js";
userStore.reset();
```

Both the page and the navbar reference the same reactive state. When one writes, the other updates.

---

## Route Overrides & Hooks

While pages are auto-registered, you can attach middleware and lifecycle hooks to any route in `src/routes.js`. Keys must match the route path derived from the folder structure (e.g., `/dashboard`, `/dashboard/profile`).

```javascript
// src/routes.js
import { authHook } from "./utils/auth.js";

export const routeOverrides = {
  // Protect /dashboard AND all nested children (/dashboard/profile, etc.)
  "/dashboard": {
    before: authHook,
    cascading: true
  },

  // Log 404 hits
  "/notfound": {
    after: () => console.warn("404: User hit an undefined route.")
  },

  // Prompt before leaving a page with unsaved work
  "/editor": {
    leave: (done) => {
      const confirmed = window.confirm("You have unsaved changes. Leave anyway?");
      done(confirmed);
    }
  }
};
```

### Cascading Hooks

Add `cascading: true` to any route override to automatically apply its hooks to **all** nested child routes. Parent hooks run first in the chain.

| Config | Effect |
| :--- | :--- |
| `"/dashboard": { before: authHook }` | Only `/dashboard` is protected. Child routes are unaffected. |
| `"/dashboard": { before: authHook, cascading: true }` | `/dashboard`, `/dashboard/profile`, `/dashboard/profile/edit`, etc. are all protected. |

A child route can still define its own hooks — they run **after** the cascading parent hooks. If a parent hook calls `done(false)`, the entire chain is blocked and the child hooks never execute.

```javascript
// Parent cascades authHook to all children
"/dashboard": { before: authHook, cascading: true },

// This child also logs after rendering (authHook still runs first)
"/dashboard/profile": { after: (params) => console.log("Profile viewed") },
```

Available Navigo hooks:

| Hook | Signature | Use Case |
| :--- | :--- | :--- |
| `before` | `(done, params) => {}` | Auth guards, redirects. Call `done()` to proceed or `done(false)` to block. |
| `after` | `(params) => {}` | Analytics, scroll-to-top, logging. |
| `leave` | `(done) => {}` | Unsaved changes prompts. Call `done(true)` to allow or `done(false)` to stay. |
| `already` | `(params) => {}` | Runs when the user navigates to the page they are already on. |

---

## Authentication

Authentication uses Puter's OAuth flow. The auth utility in `src/utils/auth.js` provides a Navigo `before` hook that redirects unauthenticated users.

**Protecting a route (and all its children):**

```javascript
// src/routes.js
import { authHook } from "./utils/auth.js";

export const routeOverrides = {
  "/dashboard": { before: authHook, cascading: true }
};
```

**Triggering login:**

```javascript
await window.puter.auth.signIn();       // Opens Puter OAuth dialog
window.router.navigate("/dashboard");   // Redirect on success
```

**Logging out:**

```javascript
await window.puter.auth.signOut();
userStore.reset();                       // Clear shared state
window.router.navigate("/");
```

The redirect target for unauthenticated users is set in `src/config.js` via `AUTH_REDIRECT`.

---

## SEO Metadata

### What it does

Each page can define a `.seo` property with `title`, `description`, and `keywords`. During navigation, the render engine merges these with the global defaults from `src/config.js` and updates the corresponding `<meta>` tags in the document head.

```javascript
// On a page component
Home.seo = {
  title: "VNP Stack | Home",
  description: "The Spartan Way to build web apps."
};
```

```javascript
// Global fallbacks in src/config.js
DEFAULT_SEO: {
  title: "VNP Forge",
  description: "Ultra-fast AI Site Builder",
  keywords: "vanjs, puter, spa"
}
```

If a page only specifies a `title`, the `description` and `keywords` fall back to the global defaults.

### Limitations

This is a client-side SPA. Meta tags are updated at runtime via JavaScript. This has practical consequences:

- **Google Search** can index the content, since Googlebot executes JavaScript.
- **Social media link previews** (Twitter/X, Facebook, LinkedIn, Slack) **will not** pick up per-page metadata. These scrapers read raw HTML without executing JavaScript, so every shared link will show the defaults from `index.html`.
- **With hash routing enabled** (`/#/page`), search engines treat all hash routes as a single URL. Only the home page is independently indexable.
- The generated **sitemap and robots.txt** are most useful when hash routing is disabled and path routing is configured with server-side catch-all redirects.

For apps, dashboards, and internal tools, these limitations are irrelevant — hash routing is the simpler choice. If per-page social previews or full search engine indexing of every route matters for your project, set `USE_HASH_ROUTING: false` and configure your server accordingly (see Routing Modes below).

### Sitemap & Robots.txt

Both are generated at build time via Vite plugins. Routes are **auto-discovered** from `src/pages/` — no manual listing required. The `notfound` page is excluded automatically.

Use `exclude` to keep specific routes (and all their children) out of the sitemap:

```javascript
SITE_MAP: {
  ENABLED: true,
  hostname: "https://your-domain.com",
  // Routes auto-discovered from src/pages/ at build time.
  exclude: ["/dashboard"]  // Also excludes /dashboard/profile, etc.
},

ROBOTS: {
  ENABLED: true,
  policies: [{
    userAgent: "*",
    allow: "/",
    disallow: ["/dashboard", "/assets/"]
  }]
}
```

Set `ENABLED: false` on either to skip generation entirely. Adding a new page folder to `src/pages/` will automatically include it in the next build's sitemap.

---

## Routing Modes

### Hash Routing (default)

URLs look like `yoursite.com/#/dashboard`. Works on any static host with zero server configuration.

```javascript
// src/config.js
USE_HASH_ROUTING: true
```

```javascript
// Navigate programmatically
window.router.navigate("/dashboard"); // Results in yoursite.com/#/dashboard
```

### Path Routing

URLs look like `yoursite.com/dashboard`. Every route is independently addressable and indexable, but requires server-side catch-all configuration.

```javascript
// src/config.js
USE_HASH_ROUTING: false
```

When a user refreshes or directly visits a sub-page like `yoursite.com/dashboard`, the server must return `index.html` instead of a 404. Once loaded, Navigo reads the URL path and renders the correct view.

**Server catch-all setup:**

| Host | Configuration |
| :--- | :--- |
| **Netlify** | Create `public/_redirects` containing `/* /index.html 200` |
| **Vercel** | Add `vercel.json`: `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }` |
| **Apache** | `.htaccess`: `FallbackResource /index.html` |
| **Nginx** | `try_files $uri $uri/ /index.html;` |
| **Puter** | Set the error/404 document to `/index.html` in hosting settings |

---

## CSS Modules

Every page and component uses a co-located `.module.css` file for scoped styles. Class names are locally scoped at build time, preventing collisions across the app.

```css
/* src/pages/Home/Home.module.css */
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.title {
  font-size: 2rem;
  color: #fff;
}
```

```javascript
// src/pages/Home/home.js
import s from "./Home.module.css";

const Home = () => {
  return div({ class: s.wrapper },
    h1({ class: s.title }, "Hello")
  );
};
```

Global styles and shared animations live in `src/style.css`.

---

## Navigation

Use `window.router.navigate()` for programmatic navigation. For links in templates, add the `data-navigo` attribute so Navigo handles clicks client-side instead of triggering a full page load:

```javascript
// Programmatic
window.router.navigate("/dashboard");

// In a VanJS template
a({ href: "/dashboard", "data-navigo": "" }, "Go to Dashboard")
```

---

## Build Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Development server with hot module reloading. |
| `npm run build` | Standard production build (no minification). |
| `npm run build:min` | Minified build with Gzip and Brotli compression. |
| `npm run build:obf` | Build with JavaScript obfuscation. |
| `npm run build:min-obf` | Minified, obfuscated, and compressed. |
| `npm run preview` | Preview the production build locally (port 4173). |
| `npm run clean` | Delete the `dist` folder. |

### Build Output

```
dist/
├── index.html (+.br, .gz)
├── sitemap.xml           (if enabled)
├── robots.txt            (if enabled)
└── assets/
    ├── js/main.js (+.br, .gz)
    └── css/screen.css (+.br, .gz)
```

When running `build:min-obf`, the pipeline executes in order:
1. **Minification** — Terser shrinks variable names and removes whitespace.
2. **Obfuscation** — Code logic is transformed to be unreadable.
3. **Compression** — Generates `.br` (Brotli) and `.gz` (Gzip) copies of all assets.

---

## Configuration Reference

All app-level settings live in `src/config.js`:

```javascript
export const APP_CONFIG = {
  USE_HASH_ROUTING: true,       // true = hash (#/) routing, false = path routing
  AUTH_REDIRECT: "/login",      // Where to send unauthenticated users

  SITE_MAP: {
    ENABLED: true,              // Generate sitemap.xml at build time
    hostname: "https://your-domain.com",
    // Routes auto-discovered from src/pages/ — no manual list needed.
    exclude: ["/dashboard"]     // Prefix match: also excludes children
  },

  ROBOTS: {
    ENABLED: true,              // Generate robots.txt at build time
    policies: [{
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/assets/"]
    }]
  },

  DEFAULT_SEO: {
    title: "VNP Forge",
    description: "Ultra-fast AI Site Builder",
    keywords: "vanjs, puter, spa"
  }
};
```

---

## Documentation Links

- [VanJS](https://vanjs.org/) — Reactivity, state, and DOM tags.
- [Navigo](https://github.com/krasimir/navigo) — Hooks, parameters, and route matching.
- [Puter API](https://docs.puter.com/) — Authentication, cloud storage, and hosting.
- [Vite](https://vitejs.dev/) — Bundling, plugins, and dev server.

---

Created by Christopher Ditfort. Licensed under ISC.
