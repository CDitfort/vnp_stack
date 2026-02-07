import van from "vanjs-core";
import s from "./NotFound.module.css";

const { div, h1, p, a } = van.tags;

export const NotFound = () =>
  div({ class: s.wrapper },
    h1({ class: s.errorCode }, "404"),
    p({ class: s.msg }, "This route exists only in the void."),
    a({ 
      class: s.homeBtn, 
      onclick: (e) => { e.preventDefault(); window.router.navigate("/"); } 
    }, "Return to Reality")
  );