import van from "vanjs-core";

const { div, h1, p, button } = van.tags;

export const NotFound = () =>
  div(
    h1("404"),
    p("Page not found"),
    button(
      { onclick: () => router.navigate("/") },
      "Go Home"
    )
  );
