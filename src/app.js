import debug from "debug";

import { EventRouteChanged } from "./events";
import { RouteEvents } from "./router";

const log = debug("niba:app");

function findHandler(routes, route) {
  for (const [path, value] of Object.entries(routes)) {
    if (route.indexOf(path) !== 0) {
      continue;
    }

    const sub_route = route.substring(path.length);
    findHandler(routes, sub_route);

    // TODO: 递归返回值
  }
}

function create(mnt, routes = {}) {
  const result = {};

  RouteEvents.on(EventRouteChanged, (route) => {
    logger.info("--> route: ", route);
    const { state, search, from, to } = route;
    findHandler(routes, to);

    mnt.innerHTML = "";

    for (const [target, handle] of Object.entries(routes)) {
      if (to !== target) {
        continue;
      }

      (async () => {
        const obj = await handle();
        if (_.has(obj, "root") && _.has(obj, "mount")) {
          obj.mount(mnt);
        }
      })();
    }
  });

  return result;
}
