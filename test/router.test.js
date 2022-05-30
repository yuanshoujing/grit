import debug from "debug";

import { RouteEvents, boot, push, urlParser } from "../src/router";
import { EventRouteChanged } from "../src/events";

debug.enable("*");
const log = debug("niba:router-test");

RouteEvents.on(EventRouteChanged, (route) => {
  log("--> route: %O", route);
});

test("router-url-parser", () => {
  let result = urlParser("/home/abc");
  expect(result.path).toBe("home/abc");
  result = urlParser("#/home/abc");
  expect(result.hash).toBe("home/abc");
});

test("route-url-lstrip", () => {
  const r = /^(#\/)/;
  let u = "#/home/abc";
  u.match();
});

test("router-boot-test", async () => {
  boot();

  push("#/home/abc");

  push("#/home");
});
