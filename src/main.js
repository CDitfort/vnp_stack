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
 * 🤖 2. AUTOMATED PAGE IMPORTS
 */
const pageModules = import.meta.glob("./pages/**/*.js", { eager: true });
const Pages = {};

Object.entries(pageModules).forEach(([path, module]) => {
  const parts = path.split('/');
  const fileName = parts.pop().replace('.js', '');
  
  const exportName = Object.keys(module).find(
    (key) => key.toLowerCase() === fileName.toLowerCase()
  );
  
  const finalName = exportName || fileName;
  Pages[finalName] = module[finalName];
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
 */
Object.keys(Pages).forEach((name) => {
  const component = Pages[name];
  const path = name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;
  const hooks = routeOverrides[path] || {};

  if (name.toLowerCase() === "notfound") {
    router.notFound(() => render(component, component.seo || {}), hooks);
  } else {
    router.on(path, () => render(component, component.seo || {}), hooks);
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