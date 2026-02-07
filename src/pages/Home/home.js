import van from "vanjs-core";
import { Navbar } from "@/components/Navbar/navbar.js";
import { Footer } from "@/components/Footer/Footer.js";
import s from "./Home.module.css";

const { div, h1, p, a, span } = van.tags;

export const Home = () => {
  return div({ class: s.wrapper },
    Navbar({ logoText: "VNP Stack Official" }), div({ class: s.content },
      span({ class: s.badge }, "v1.0.0"),
      h1({ class: s.title }, "VNP Stack"),
      p({ class: s.subtitle }, "Ultra-lightweight and blazingly fast."),
      div(
        a({
          href: "https://github.com/CDitfort/vnp_stack",
          target: "_blank",
          class: s.githubBtn
        }, "GitHub ↗")
      )
    ),
    Footer() // 🛠️ Added Footer
  );
};

Home.seo = {
  title: "VNP Stack | Home",
  description: "The Spartan Way to build web apps."
};