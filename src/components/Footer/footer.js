import van from "vanjs-core";
import s from "./footer.module.css";

const { footer, div, p, a } = van.tags;

export const Footer = () => {
  return footer({ class: s.footer },
    div({ class: s.inner },
      p({ class: s.copy }, `© ${new Date().getFullYear()} VNP Stack`),
      div({ class: s.links },
        a({ href: "/privacy", "data-navigo": "" }, "Privacy Policy"),
        a({ href: "/terms", "data-navigo": "" }, "Terms of Use"),
        a({ href: "https://github.com/CDitfort/vnp_stack", target: "_blank" }, "Source")
      )
    )
  );
};