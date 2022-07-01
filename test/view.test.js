import view from "../src/view";
import CView from "../src/cview";

import debug from "debug";
debug.enable("*");

const log = debug("niba:view.test");

const nb = view({
  template: "<div>Hello, <%- x %>!</div>",

  data: {
    x: "world",
  },
});

const pnb = view({
  template: "<div><%- x %></div><slot name='c1'></slot>",

  children: {
    c1: nb,
  },

  data: {
    x: "c1",
  },
});

test("view-test", async () => {
  const instance = await nb();
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
  const instance = await pnb();
  log("--> niba instance: %O", instance);

  const wrap = document.createElement("div");
  instance.mount(wrap);
  log("--> wrap: %s", wrap.innerHTML);
  expect(instance.root.innerHTML).toBe(
    `<div>c1</div><slot name="c1"><div id="niba-3"><div>Hello, world!</div></div></slot>`
  );
});

test("view-class-test", () => {
  const v = new CView({});
  log(Object.keys(v));
  log(v.data);
  v.data.a = 2;
  log(v instanceof CView);
  log(typeof v);
  log(typeof v.data);
});
