import van from "vanjs-core";
import { userStore } from "@/stores/user.js";
import s from "./navbar.module.css";

const { nav, div, p, a } = van.tags;

export const Navbar = (props = {}) => {
  const {
    logoText = "VNP Stack",
    linkText = "Login",
    linkTarget = "/login",
    isLogout = false
  } = props;

  const handleLogout = async (e) => {
    e.preventDefault();
    await window.puter.auth.signOut();
    userStore.reset();
    window.router.navigate("/");
  };

  return nav({ class: s.navbar },
    div({ class: s.content },
      p({ class: s.logo }, logoText), 
      div({ class: s.links },
        isLogout 
          ? a({ class: s.navItem, onclick: handleLogout }, "Logout")
          : a({ 
              class: s.navItem, 
              href: linkTarget,   // 🛠️ SEO loves this
              "data-navigo": ""   // 🛠️ Navigo hijacks this
            }, linkText)
      )
    )
  );
};