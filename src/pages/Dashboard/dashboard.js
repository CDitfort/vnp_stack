import van from "vanjs-core";
import { Navbar } from "@/components/Navbar/navbar.js";
import { Footer } from "@/components/Footer/Footer.js";
import s from "./Dashboard.module.css";

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

  return div({ class: s.page }, 
    // Pass the logout props we built earlier
    Navbar({ 
      logoText: "User Dashboard", 
      linkText: "Logout", 
      linkTarget: "/", 
      isLogout: true 
    }),

    // 🛠️ THE FIX: Wrap the dynamic content in the cardContainer
    div({ class: s.cardContainer }, 
      () => {
        if (!isReady.val) return div({ class: s.loadingContainer }, 
          div({ class: s.spinner }),
          p({ class: s.loadingText }, "ESTABLISHING SESSION...")
        );

        return div({ class: s.card },
          span({ class: s.userBadge }, "Secure Session"),
          h1(`Welcome, ${username.val}`),
          p("You are viewing a protected route. Use the link in the header to logout.")
        );
      }
    ),

    Footer()
  );
};