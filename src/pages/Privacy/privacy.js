import van from "vanjs-core";
import { Navbar } from "@/components/Navbar/navbar.js";
import { Footer } from "@/components/Footer/footer.js";
import s from "./privacy.module.css";

const { div, h1, h2, p, section } = van.tags;

export const Privacy = () => {
  return div({ class: s.page },
    Navbar({ logoText: "VNP Stack Official", linkText: "Back Home", linkTarget: "/" }),
    div({ class: s.container },
      h1({ class: s.title }, "Privacy Policy"),
      section({ class: s.section },
        h2("1. Data Handling"),
        p("VNP Stack is a demonstration tool. We do not store personal data.")
      )
    ),
    Footer()
  );
};