import 'normalize.css';
import './style.css';
import { updateSEO } from "./utils/seo.js";
import { APP_CONFIG } from "./config.js";
import { routeOverrides } from "./routes.js";
import Navigo from "navigo";

/**
 * 🛠️ 1. ROUTER INSTANTIATION
 */
const router = new Navigo("/", { hash: APP_CONFIG.USE_HASH_ROUTING });
window.router = router;

const app = document.getElementById("app");

/**
 * 🤖 2. AUTOMATED PAGE IMPORTS (Nested Folder Support)
 * ------------------------------------------------------------------
 * Routes are derived from the folder hierarchy under /pages.
 *   pages/Home/home.js                     → /
 *   pages/Dashboard/dashboard.js           → /dashboard
 *   pages/Dashboard/Profile/profile.js     → /dashboard/profile
 *   pages/Dashboard/Profile/Edit/edit.js   → /dashboard/profile/edit
 * Any depth of nesting is supported automatically.
 */
const pageModules = import.meta.glob("./pages/**/*.js", { eager: true });
const Pages = {};

Object.entries(pageModules).forEach(([path, module]) => {
  const relativePath = path.replace('./pages/', '');
  const segments = relativePath.split('/');
  const fileName = segments.pop().replace('.js', '');

  const exportName = Object.keys(module).find(
    (key) => key.toLowerCase() === fileName.toLowerCase()
  );

  const finalName = exportName || fileName;

  // Build route from folder hierarchy (not the filename)
  let route = '/' + segments.map(s => s.toLowerCase()).join('/');

  // "Home" folder maps to root
  if (route === '/home') route = '/';

  Pages[route] = { component: module[finalName], name: finalName };
});

/**
 * 🎨 3. RENDER ENGINE (UPGRADED)
 */
const render = (page, seoConfig = {}) => {
  if (!page) {
    console.error("VNP Error: Component not found.");
    return;
  }
  
  app.classList.add("fade-out");

  updateSEO({
    ...APP_CONFIG.DEFAULT_SEO,
    ...seoConfig
  });

  setTimeout(() => {
    // Standardize: If it's a function, call it; if it's already a node, use it.
    const content = typeof page === 'function' ? page() : page;
    app.replaceChildren(content);
    app.classList.remove("fade-out");
  }, 200);
};

/**
 * 🤖 4. UNIFIED REGISTRATION ENGINE
 * ------------------------------------------------------------------
 * Routes are now keyed by their full path (e.g. "/dashboard/profile").
 * Override any route in routes.js using the same path as the key.
 */
Object.entries(Pages).forEach(([route, { component, name }]) => {
  const hooks = routeOverrides[route] || {};

  if (name.toLowerCase() === "notfound") {
    router.notFound(() => render(component, component.seo || {}), hooks);
  } else {
    router.on(route, () => render(component, component.seo || {}), hooks);
  }
});

/**
 * 🚀 5. INITIALIZATION GATEKEEPER
 */
const initApp = () => {
  if (window.puter) {
    if (window.location.pathname !== "/" && APP_CONFIG.USE_HASH_ROUTING) {
      const { pathname, search } = window.location;
      window.location.replace(`/#${pathname}${search}`);
      return; 
    }

    console.log("🚀 Puter SDK Ready - VNP Stack Initialized");

    router.hooks({
      after: () => {
        window.scrollTo(0, 0); 
      }
    });

    router.resolve(); 
  } else {
    setTimeout(initApp, 50);
  }
};

window.addEventListener('DOMContentLoaded', initApp);