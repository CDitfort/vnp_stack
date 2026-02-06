import van from "vanjs-core";

const { div, h1, p } = van.tags;

export const Home = () => {
  return div(
    h1("Welcome to VNP Stack"),
    p("Ultra-lightweight and blazingly fast.")
  );
};