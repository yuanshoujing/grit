import { dataProxy } from "../src/proxy";
import { EventDataChanged } from "../src/events";
import mitt from "mitt";
import debug from "debug";
debug.enable("*");

const { on, off, emit } = mitt();
const log = debug("proxy-test");

test("data-proxy-test", async () => {
  const data = {
    x: 1,
    y: 2,
  };

  const r = await new Promise((resolve) => {
    const dp = dataProxy(data, emit);
    on(EventDataChanged, ([value, prev, property]) => {
      log(`--> v: ${JSON.stringify(v)}, p: ${p}`);
      resolve(v);
    });
    dp.x = 11;
  });
  //   expect(r.x).toBe(11);
});
