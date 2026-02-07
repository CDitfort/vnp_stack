// src/config.js
export const APP_CONFIG = {
  USE_HASH_ROUTING: true, 
  AUTH_REDIRECT: "/login",

  // 🗺️ Sitemap Control
  SITE_MAP: {
    ENABLED: true, // 🛠️ Toggle sitemap generation
    hostname: "https://your-domain.com", 
    routes: ["/", "/login", "/privacy", "/terms"],
    exclude: ["/dashboard"]
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