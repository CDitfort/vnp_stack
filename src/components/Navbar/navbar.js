import van from "vanjs-core";
import s from "./Navbar.module.css";

const { nav, div, p, a } = van.tags;

export const Navbar = (props = {}) => {
  const { 
    logoText = "VNP Stack",
    linkText = "Login", 
    linkTarget = "/login",
    isLogout = false 
  } = props;

  // We still use a small handler for Logout because it involves an API call
  const handleLogout = async (e) => {
    e.preventDefault();
    await window.puter.auth.signOut();
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