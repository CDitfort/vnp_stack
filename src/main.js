import 'normalize.css'; // Standardizes browser styles
import './style.css';    // Your custom styles 
import { updateSEO } from "./utils/seo.js"; 
import { APP_CONFIG } from "./config.js"; 
import Navigo from "navigo";
import { NotFound } from "./pages/notFound";


import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";

const router = new Navigo("/", { hash: true });

const app = document.getElementById("app");

const render = (page, seoConfig = {}) => {
  app.classList.add("fade-out");

  // Update SEO immediately when the route changes
  updateSEO({
    ...APP_CONFIG.DEFAULT_SEO,
    ...seoConfig
  });

  setTimeout(() => {
    app.replaceChildren(page());
    app.classList.remove("fade-out");
  }, 200);
};

router
  .on("/", () => render(Home, 
    { title: "Home" }))

  .on("/login", () => render(Login,  
    {title: "Login"}))

  .on("/dashboard", () => render(Dashboard, 
    { title: "Dashboard" }))

  .notFound(() => render(NotFound))
  
  .resolve();

window.router = router;
