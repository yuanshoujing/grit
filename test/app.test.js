import debug from "debug";

import view from "../src/view";

debug.enable("*");

const log = debug("niba:app.test");

const frame = view({
  template: `
  <div>
    <header>header</header>
    <nb-gate></nb-gate>
  </div>
  `,
});

const nb = view({
  template: `<div>hello</div>`,
});

const nbs = view({
  template: `
    <div>
      <nb-hello />
      <nb-gate name="gate-1" />
      <nb-gate name="gate-2" />
    </div>
   `,

  children: {
    "nb-hello": nb, // TODO: nb 如果出现在列表中，需要多实例
  },
});

const routes = [
  {
    "/": frame,
  },
];
