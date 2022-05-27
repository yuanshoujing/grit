import factory from "../src/factory";

import debug from "debug";
debug.enable("*");

const log = debug("niba:factory.test");

const nb = {
  template: "<div>Hello, <%- x %>!</div>",

  data: {
    x: "world",
  },
};

const pnb = {
  template: "<div><%- x %></div><slot name='c1'></slot>",

  children: {
    c1: factory(nb),
  },

  data: {
    x: "c1",
  },
};

test("factory-test", async () => {
  const create = factory(nb);
  const instance = await create();
  log("--> niba instance: %O", instance);

  const wrap = document.createElement("div");
  instance.mount(wrap);
  log("--> wrap: %s", wrap.outerHTML);
  expect(instance.root.innerHTML).toBe("<div>Hello, world!</div>");

  const el = instance.$("div");
  expect(el.innerHTML).toBe("Hello, world!");

  const r = await new Promise((resolve) => {
    instance.data.x = "abc";

    setTimeout(() => {
      const el1 = instance.$("div");
      resolve(el1.innerHTML);
    }, 1000);
  });
  expect(r).toBe("Hello, abc!");
});

test("children-test", async () => {
  const create = factory(pnb);
  const instance = await create();
  log("--> niba instance: %O", instance);

  const wrap = document.createElement("div");
  instance.mount(wrap);
  log("--> wrap: %s", wrap.innerHTML);
  expect(instance.root.innerHTML).toBe(
    `<div>c1</div><slot name="c1"><div id="niba-3"><div>Hello, world!</div></div></slot>`
  );
});
