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
 *
 * 🔗 CASCADE MODE:
 * Add `cascading: true` to any route override to automatically apply
 * its hooks to ALL nested child routes. Parent hooks run first.
 * A parent calling done(false) blocks the entire chain.
 *
 *   "/dashboard": { before: authHook, cascading: true }
 *
 * This means /dashboard/profile and /dashboard/profile/edit will
 * both run authHook before their own hooks (if any).
 * Without `cascading: true`, each route must be overridden independently.
 * ------------------------------------------------------------------
 */
export const routeOverrides = {
  // 🔐 Protected Routes (cascading applies authHook to all /dashboard/* children)
  "/dashboard": {
    before: authHook,
    cascading: true
  },

  // 🛑 404 Configuration
  "/notfound": {
    after: () => console.warn("🛑 404: User landed on an undefined route.")
  },

  /* Example: Add an additional hook to a nested route (parent hooks still run first):
  "/dashboard/profile": {
    after: (params) => console.log("Profile page viewed")
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