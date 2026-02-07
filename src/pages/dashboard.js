import van from "vanjs-core";
import { Navbar } from "../components/navbar.js";

const { div, h1, p, span } = van.tags;

export const Dashboard = () => {
  const isReady = van.state(false);
  const username = van.state("");

  const syncUser = async () => {
    const user = await window.puter.auth.getUser();
    if (user) {
      username.val = user.username;
      isReady.val = true;
    } else {
      setTimeout(syncUser, 500);
    }
  };
  syncUser();

  return div({ class: "vnp-dash-page" }, 
    Navbar(),
    () => {
      if (!isReady.val) return div({ class: "vnp-dash-loading" }, div({ class: "vnp-spinner" }));

      return div({ class: "vnp-dash-container" },
        div({ class: "vnp-dash-card" },
          span({ class: "vnp-user-badge" }, "Secure Session"),
          h1(`Welcome, ${username.val}`),
          // Specific instruction as requested
          p("You are currently viewing a protected route. Use the icon in the header to logout.")
        )
      );
    }
  );
};