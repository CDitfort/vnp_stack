import van from "vanjs-core";
import s from "./Navbar.module.css";

const { nav, div, p, a } = van.tags;

export const Navbar = (props = {}) => {
  // 1. Destructure all the props we need with defaults
  const { 
    logoText = "Protected Route Example",
    linkText = "Login",       // Default text
    linkTarget = "/login",    // Default destination
    isLogout = false          // New flag to handle sign-out logic
  } = props;
  
  const handleClick = async (e) => {
    e.preventDefault(); // Prevent standard browser behavior
    
    if (isLogout) {
      // If this is a logout link, clear the session first
      await window.puter.auth.signOut();
      window.router.navigate("/");
    } else {
      // Otherwise, just go to the target page
      window.router.navigate(linkTarget);
    }
  };

  return nav({ class: s.navbar },
    div({ class: s.content },
      p({ class: s.logo }, logoText), 
      
      div({ class: s.links },
        // 2. Use the variables from props here!
        a({ 
          class: s.navItem, 
          onclick: handleClick 
        }, linkText)
      )
    )
  );
};