import van from "vanjs-core";
import { Navbar } from "@/components/Navbar/navbar.js";
import { Footer } from "@/components/Footer/Footer.js";
import { userStore, syncSession } from "@/stores/user.js";
import s from "./Dashboard.module.css";

const { div, h1, p, span } = van.tags;

export const Dashboard = () => {
  const isReady = van.state(false);

  syncSession().then((ok) => {
    if (ok) isReady.val = true;
  });

  return div({ class: s.page },
    Navbar({
      logoText: "User Dashboard",
      linkText: "Logout",
      linkTarget: "/",
      isLogout: true
    }),

    div({ class: s.cardContainer },
      () => {
        if (!isReady.val) return div({ class: s.loadingContainer },
          div({ class: s.spinner }),
          p({ class: s.loadingText }, "ESTABLISHING SESSION...")
        );

        return div({ class: s.card },
          span({ class: s.userBadge }, "Secure Session"),
          h1(`Welcome, ${userStore.username.val}`),
          p("You are viewing a protected route. Use the link in the header to logout.")
        );
      }
    ),

    Footer()
  );
};
