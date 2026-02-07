import van from "vanjs-core";

// 🛠️ FIX: Added 'a' back to the tags
const { nav, div, p, span, a } = van.tags;

const LogOutIcon = () => span({ 
  class: "vnp-nav-logout-icon-inner",
  innerHTML: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>`
});

export const Navbar = () => {
  const isLoggedIn = van.state(false);

  const checkStatus = async () => {
    const status = await window.puter.auth.isSignedIn();
    if (isLoggedIn.val !== status) isLoggedIn.val = status;
    setTimeout(checkStatus, 1000);
  };
  checkStatus();

  return nav({ class: "vnp-navbar" },
    div({ class: "vnp-nav-content" },
      // Logo as a 'p' tag for a non-link aesthetic
      p({ class: "vnp-nav-logo" }, "Protected page example"),
      
      div({ class: "vnp-nav-links" },
        // Dashboard link logic
        () => (isLoggedIn.val && window.location.hash !== "#/dashboard") ? a({ 
          class: "vnp-nav-item", 
          onclick: (e) => { e.preventDefault(); window.router.navigate("/dashboard"); } 
        }, "dashboard") : null,
        
        // Logout icon trigger
        () => isLoggedIn.val ? a({ 
          class: "vnp-nav-logout-trigger",
          onclick: async () => {
            await window.puter.auth.signOut();
            window.router.navigate("/");
          }
        }, LogOutIcon()) : a({ 
          class: "vnp-nav-item",
          onclick: () => window.router.navigate("/login")
        }, "login")
      )
    )
  );
};