import debug from "debug";

import { RouteEvents, boot, push } from "../src/router";
import { EventRouteChanged } from "../src/events";

debug.enable("*");
const log = debug("niba:router-test");

test("router-boot-test", async () => {
  let r = null;

  RouteEvents.on(EventRouteChanged, (route) => {
    log("--> route: %O", route);
    r = route;
  });

  let p = new Promise((resolve) => {
    boot();

    setTimeout(() => {
      resolve();
    }, 200);
  });

  await p;
  expect(r.to).toBe("/");

  p = new Promise((resolve) => {
    push("/home/abc");

    setTimeout(() => {
      resolve();
    }, 200);
  });

  await p;
  expect(r.from).toBe("/");
  expect(r.to).toBe("/home/abc");

  p = new Promise((resolve) => {
    push("/ttt");

    setTimeout(() => {
      resolve();
    }, 200);
  });

  await p;
  expect(r.from).toBe("/home/abc");
  expect(r.to).toBe("/ttt");
});
