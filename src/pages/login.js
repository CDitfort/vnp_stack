import van from "vanjs-core";

const { div, h1, p, button, span } = van.tags;

export const Login = () => {
  const handleLogin = async () => {
    try {
      const user = await window.puter.auth.signIn();
      console.log("Authenticated:", user.username);
      window.router.navigate("/dashboard");
    } catch (err) {
      console.error("Authentication cancelled or failed:", err);
    }
  };

  return div({ class: "vnp-login-page" },
    div({ class: "vnp-login-card" },
      div({ class: "vnp-login-header" },
        h1("Login or Register"),
        p({ class: "vnp-helper-text" }, 
          "We use Puter to handle secure authentication. To login or register click the button below."
        )
      ),
      
      div({ class: "vnp-login-body" },
        button({ 
          class: "vnp-puter-btn",
          onclick: handleLogin 
        }, [
          span({ class: "btn-icon" }, "P"), 
          "Continue with Puter"
        ])
      ),

      div({ class: "vnp-login-footer" },
        p("A secure pop-up will appear for authentication.")
      )
    )
  );
};

Login.seo = {
  title: "Login | VNP Stack",
  description: "Secure one-tap authentication."
};