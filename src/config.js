// src/config.js
export const APP_CONFIG = {
  USE_HASH_ROUTING: true, 
  AUTH_REDIRECT: "/login",

  // 🗺️ Sitemap Control (routes auto-discovered from src/pages/ at build time)
  SITE_MAP: {
    ENABLED: true, // 🛠️ Toggle sitemap generation
    hostname: "https://your-domain.com",
    exclude: ["/dashboard"] // Prefix match: also excludes /dashboard/profile, etc.
  },

  // 🤖 Robots Control
  ROBOTS: {
    ENABLED: true, // 🛠️ Toggle robots.txt generation
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/assets/"]
      }
    ]
  },

  DEFAULT_SEO: {
    title: "VNP Forge",
    description: "Ultra-fast AI Site Builder",
    keywords: "vanjs, puter, spa"
  }
};