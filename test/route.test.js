import factory from "../src/factory";

const nb0 = factory({
  template: "<div>NB 0!</div>",
});

const nb1 = factory({
  template: "<div>NB 1!</div>",
});

const routes = {
  "": nb0,
  nb1: nb1,
};
