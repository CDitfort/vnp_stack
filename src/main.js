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

  // Only register files whose name matches their parent folder (skip helpers/utils)
  const parentFolder = segments[segments.length - 1];
  if (!parentFolder || fileName.toLowerCase() !== parentFolder.toLowerCase()) return;

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
let pendingRender = null;

const render = (page, seoConfig = {}) => {
  if (!page) {
    console.error("VNP Error: Component not found.");
    return;
  }

  if (pendingRender) clearTimeout(pendingRender);

  app.classList.add("fade-out");

  updateSEO({
    ...APP_CONFIG.DEFAULT_SEO,
    ...seoConfig
  });

  pendingRender = setTimeout(() => {
    pendingRender = null;
    // Standardize: If it's a function, call it; if it's already a node, use it.
    const content = typeof page === 'function' ? page() : page;
    app.replaceChildren(content);
    app.classList.remove("fade-out");
    router.updatePageLinks();
  }, 200);
};

/**
 * 🔗 4. CASCADING HOOK RESOLVER
 * ------------------------------------------------------------------
 * Merges hooks from cascading ancestor routes with a route's own hooks.
 * Parent hooks run first. A parent calling done(false) blocks the chain.
 * Only routes with `cascading: true` in routeOverrides propagate to children.
 */
const resolveHooks = (route) => {
  const cascadingAncestors = Object.entries(routeOverrides)
    .filter(([parentRoute, config]) => {
      if (!config.cascading) return false;
      return route === parentRoute || route.startsWith(parentRoute + '/');
    })
    .sort(([a], [b]) => a.length - b.length);

  const ownOverrides = routeOverrides[route] || {};
  const hookTypes = ['before', 'after', 'leave', 'already'];
  const merged = {};

  for (const type of hookTypes) {
    const chain = [];

    for (const [, config] of cascadingAncestors) {
      if (config[type]) chain.push(config[type]);
    }

    if (ownOverrides[type]) {
      const alreadyIncluded = cascadingAncestors.some(([p]) => p === route);
      if (!alreadyIncluded) chain.push(ownOverrides[type]);
    }

    if (chain.length === 0) continue;
    if (chain.length === 1) { merged[type] = chain[0]; continue; }

    if (type === 'before') {
      merged.before = (done, params) => {
        let i = 0;
        const next = (proceed) => {
          if (proceed === false) { done(false); return; }
          if (++i < chain.length) chain[i](next, params);
          else done();
        };
        chain[0](next, params);
      };
    } else if (type === 'leave') {
      merged.leave = (done) => {
        let i = 0;
        const next = (proceed) => {
          if (proceed === false) { done(false); return; }
          if (++i < chain.length) chain[i](next);
          else done(true);
        };
        chain[0](next);
      };
    } else {
      merged[type] = (params) => chain.forEach((fn) => fn(params));
    }
  }

  return merged;
};

/**
 * 🤖 5. UNIFIED REGISTRATION ENGINE
 * ------------------------------------------------------------------
 * Routes are keyed by their full path (e.g. "/dashboard/profile").
 * Hooks are resolved via resolveHooks() which handles cascading.
 */
Object.entries(Pages).forEach(([route, { component, name }]) => {
  const hooks = resolveHooks(route);

  if (name.toLowerCase() === "notfound") {
    router.notFound(() => render(component, component.seo || {}), hooks);
  } else {
    router.on(route, () => render(component, component.seo || {}), hooks);
  }
});

/**
 * 🚀 5. INITIALIZATION GATEKEEPER
 */
const PUTER_TIMEOUT = 5000;

const initApp = () => {
  const start = Date.now();

  const boot = (hasPuter) => {
    if (hasPuter && window.location.pathname !== "/" && APP_CONFIG.USE_HASH_ROUTING) {
      const { pathname, search } = window.location;
      window.location.replace(`/#${pathname}${search}`);
      return;
    }

    console.log(hasPuter
      ? "🚀 Puter SDK Ready - VNP Stack Initialized"
      : "⚠️ Puter SDK unavailable - VNP Stack Initialized without Puter"
    );

    router.hooks({
      after: () => {
        window.scrollTo(0, 0);
      }
    });

    router.resolve();
  };

  const poll = () => {
    if (window.puter) {
      boot(true);
    } else if (Date.now() - start > PUTER_TIMEOUT) {
      boot(false);
    } else {
      setTimeout(poll, 50);
    }
  };

  poll();
};

window.addEventListener('DOMContentLoaded', initApp);