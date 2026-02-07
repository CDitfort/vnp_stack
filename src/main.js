import 'normalize.css';
import './style.css';
import { updateSEO } from "./utils/seo.js";
import { APP_CONFIG } from "./config.js";
import { routeOverrides } from "./routes.js";
import Navigo from "navigo";

/**
 * 🛠️ 1. ROUTER INSTANTIATION
 * We initialize and attach the router to 'window' immediately.
 * This prevents 'undefined' errors when hooks fire during registration.
 */
const router = new Navigo("/", { hash: APP_CONFIG.USE_HASH_ROUTING });
window.router = router;

const app = document.getElementById("app");

/**
 * 🤖 2. AUTOMATED PAGE IMPORTS
 */
const pageModules = import.meta.glob("./pages/*.js", { eager: true });
const Pages = {};

Object.entries(pageModules).forEach(([path, module]) => {
  const fileName = path.split('/').pop().replace('.js', '');
  const exportName = Object.keys(module).find(
    (key) => key.toLowerCase() === fileName.toLowerCase()
  );
  Pages[exportName || fileName] = module[exportName || fileName];
});

/**
 * 🎨 3. RENDER ENGINE
 */
const render = (page, seoConfig = {}) => {
  if (!page) {
    console.error("VNP Error: Component not found. Did you forget to export your page component?");
    return;
  }
  
  app.classList.add("fade-out");

  updateSEO({
    ...APP_CONFIG.DEFAULT_SEO,
    ...seoConfig
  });

  setTimeout(() => {
    app.replaceChildren(page());
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
  // Check if Puter SDK is available
  if (window.puter) {
    
    /**
     * 🛠️ URL SANITIZER (Anti-Frankenstein Logic)
     * Detects if the user landed on a path-based URL while Hash Routing is active.
     */
    if (window.location.pathname !== "/" && APP_CONFIG.USE_HASH_ROUTING) {
      const { pathname, search } = window.location;
      // Using replace ensures the 'back' button doesn't loop back to the messy URL
      window.location.replace(`/#${pathname}${search}`);
      return; 
    }

    console.log("🚀 Puter SDK Ready - VNP Stack Initialized");

    // Global Hooks
    router.hooks({
      after: () => {
        window.scrollTo(0, 0); 
      }
    });

    // Final Resolve: This kicks off the routing logic
    router.resolve(); 
  } else {
    setTimeout(initApp, 50);
  }
};

// Start the engine once the DOM is ready
window.addEventListener('DOMContentLoaded', initApp);