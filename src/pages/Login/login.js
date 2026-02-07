import van from "vanjs-core";
import s from "./Login.module.css";

const { div, h1, p, button, span } = van.tags;

export const Login = () => {
  const handleLogin = async () => {
    try {
      await window.puter.auth.signIn();
      window.router.navigate("/dashboard");
    } catch (err) { console.error(err); }
  };

  return div({ class: s.page },
    div({ class: s.card },
      h1("Login or Register"),
      p({ class: s.helperText }, "We use Puter to handle secure authentication."),
      button({ class: s.puterBtn, onclick: handleLogin }, 
        span({ class: s.btnIcon }, "P"), 
        "Continue with Puter"
      )
    )
  );
};