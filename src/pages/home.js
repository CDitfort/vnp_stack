import van from "vanjs-core";

const { div, h1, p, a, span } = van.tags;

export const Home = () => {
  return div({ class: "vnp-home-wrapper" },
    div({ class: "home-content" },
      span({ class: "vnp-badge" }, "v1.0.0"),
      h1({ class: "vnp-title" }, "VNP Stack"),
      p({ class: "vnp-subtitle" }, "Ultra-lightweight and blazingly fast."),
      div({ class: "vnp-actions" },
        a({ 
          href: "https://github.com/CDitfort/vnp_stack", 
          target: "_blank", 
          class: "vnp-github-btn" 
        }, "GitHub ↗") // Added a neat arrow icon
      )
    )
  );
};

Home.seo = {
  title: "VNP Stack | Home",
  description: "The Spartan Way to build web apps."
};