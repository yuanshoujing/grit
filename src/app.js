import debug from "debug";
import path from "path";

import { EventRouteChanged } from "./events";
import { RouteEvents } from "./router";

const log = debug("niba:app");

function findHandler(routes, paths = []) {
  for (const [path, value] of Object.entries(routes)) {
    if (route !== path) {
      continue;
    }

    if (_.isString(value) && _.has(context, value)) {
      const handle = context[value];
      if (_.isFunction(handle)) {
        handle.call(context);
        break;
      }
    }

    if (
      _.isPlainObject(value) &&
      _.has(value, "gid") &&
      _.has(value, "mount")
    ) {
      value.mount(mnt);
      break;
    }
  }
}

function create(mnt, routes = {}) {
  const result = {};

  RouteEvents.on(EventRouteChanged, (route) => {
    logger.info("--> route: ", route);
    const { state, search, from, to } = route;

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
