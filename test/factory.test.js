import factory from "../src/factory";

import debug from "debug";
debug.enable("*");

const log = debug("factory-test");

const nb = {
  template: "<div>Hello, <%- x %>!</div>",

  data: {
    x: "world",
  },
};

test("factory-test", async () => {
  const create = factory(nb);
  const instance = await create();
  log(instance);
  instance.render();
  expect(instance.root.innerHTML).toBe("<div>Hello, world!</div>");
  const el = instance.$("div");
  expect(el.innerHTML).toBe("Hello, world!");
});
