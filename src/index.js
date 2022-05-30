import debug from "debug";

import { EventRouteChanged } from "./events";
import { RouteEvents } from "./router";

const log = debug("niba:app");

function create(mnt, routes = {}) {
  const result = {};

  const routesHandler = (route) => {
    logger.info("--> route: ", route);
    const { state, search, from, to } = route;

    mnt.innerHTML = "";

    for (const [path, func] of Object.entries(routes)) {
      if (to !== path) {
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
  };

  RouteEvents.on(EventRouteChanged, routesHandler);

  return result;
}
