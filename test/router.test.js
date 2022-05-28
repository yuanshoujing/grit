import view from "../src/view";

const nb0 = view({
  template: "<div>NB 0!</div>",
});

const nb1 = view({
  template: "<div>NB 1!</div>",
});

const routes = {
  "": nb0,
  nb1: nb1,
};
