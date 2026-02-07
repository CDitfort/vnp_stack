import { APP_CONFIG } from "../config.js";

/**
 * 🛡️ Auth Middleware (Navigo Hook)
 * Prevents navigation to a route if the user is not signed in.
 */
export const authHook = (done, params) => {
  if (window.puter.auth.isSignedIn()) {
    done(); // ✅ User is logged in, allow the route to resolve
  } else {
    console.warn("🔐 Access Denied. Redirecting...");
    window.router.navigate(APP_CONFIG.AUTH_REDIRECT);
    done(false); // 🛑 Stop the current navigation
  }
};