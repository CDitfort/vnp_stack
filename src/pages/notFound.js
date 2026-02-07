import van from "vanjs-core";

const { div, h1, p, button, a } = van.tags;

export const NotFound = () =>
  div(
    h1("404"),
    p("Page not found"),
    button(
      { onclick: () => window.router.navigate("/") },
      "Go Home"
    ),
    a({ href: "/" }, "Go Home"),
  );
