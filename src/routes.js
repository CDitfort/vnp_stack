// src/routes.js
import { authHook } from "./utils/auth.js";

/**
 * 🛠️ Route Overrides & Middleware
 * ------------------------------------------------------------------
 * Use this object to "hijack" a page's default behavior.
 *
 * 📝 RULES:
 * 1. The KEY must match the route path derived from the folder structure in /pages.
 *    Routes are built from the folder hierarchy, NOT the filename.
 *    Example: 'pages/Dashboard/dashboard.js'             -> Use "/dashboard"
 *    Example: 'pages/Dashboard/Profile/profile.js'       -> Use "/dashboard/profile"
 *    Example: 'pages/Dashboard/Profile/Edit/edit.js'     -> Use "/dashboard/profile/edit"
 *    Example: 'pages/NotFound/notfound.js'               -> Use "/notfound"
 * 2. Ensure your folder paths are unique to avoid routing conflicts.
 *
 * ⚓ NAVIGO HOOKS:
 * You can use any standard Navigo hook here:
 * - 'before': (done, params) => {} | Best for Auth guards/Redirects.
 * - 'after': (params) => {}        | Best for Analytics/Scroll logic.
 * - 'leave': (done) => {}          | Best for "Unsaved Changes" prompts.
 * - 'already': (params) => {}      | Runs if user is already on the page.
 * ------------------------------------------------------------------
 */
export const routeOverrides = {
  // 🔐 Protected Routes
  "/dashboard": { 
    before: authHook 
  },

  // 🛑 404 Configuration
  "/notfound": { 
    after: () => console.warn("🛑 404: User landed on an undefined route.") 
  },

  /* Example: Protect a nested route with auth:
  "/dashboard/profile": {
    before: authHook
  },
  */

  /* Example of a 'leave' hook:
  "/editor": {
    leave: (done) => {
      const confirm = window.confirm("You have unsaved changes. Leave anyway?");
      done(confirm);
    }
  }
  */
};