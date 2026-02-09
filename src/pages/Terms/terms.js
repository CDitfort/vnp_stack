import van from "vanjs-core";
import { Navbar } from "@/components/Navbar/navbar.js";
import { Footer } from "@/components/Footer/footer.js";
import s from "./terms.module.css";

const { div, h1, h2, p, section } = van.tags;

export const Terms = () => {
  return div({ class: s.page },
    Navbar({ logoText: "VNP Stack Official", linkText: "Back Home", linkTarget: "/" }),
    div({ class: s.container },
      h1({ class: s.title }, "Terms of Use"),
      section({ class: s.section },
        h2("1. Open Source Usage"),
        p("This template is provided under the MIT license.")
      )
    ),
    Footer()
  );
};