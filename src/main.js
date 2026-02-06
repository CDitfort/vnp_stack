import 'normalize.css'; // Standardizes browser styles
import './style.css';    // Your custom styles (loads after normalize)
import Navigo from "navigo";
import { NotFound } from "./pages/notFound";


import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { Dashboard } from "./pages/dashboard";

const router = new Navigo("/", { hash: true });

const app = document.getElementById("app");

const render = (page) => {
  app.classList.add("fade-out");

  setTimeout(() => {
    app.replaceChildren(page());
    app.classList.remove("fade-out");
  }, 200);
};


router
  .on("/", () => render(Home))
  .on("/login", () => render(Login))
  .on("/dashboard", () => render(Dashboard))
  .notFound(() => render(NotFound))
  .resolve();

window.router = router;
