// src/config.js
export const APP_CONFIG = {
  // Set to 'true' for AppSumo SaaS (easy setup, no server config)
  // Set to 'false' for Small Business/SEO (clean URLs, requires server config)
  USE_HASH_ROUTING: true, 

  // 🚪 Default landing spot for unauthenticated users on protected pages/routes
  AUTH_REDIRECT: "/login",

  // Default SEO fallback
  DEFAULT_SEO: {
    title: "VNP Forge",
    description: "Ultra-fast AI Site Builder",
    keywords: "vanjs, puter, spa"
  }
};