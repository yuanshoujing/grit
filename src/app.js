import debug from "debug";

import { EventRouteChanged } from "./events";
import { RouteEvents } from "./router";

const log = debug("niba:app");

function findHandles(routes, route, result = []) {
  const r = routes.find(({ path }) => {
    return route.indexOf(path) >= 0;
  });

  if (!r) {
    return;
  }

  const { path, view, children } = r;
  result.push(view);

  const sub_route = route.substring(path.length);
  if (!sub_route) {
    return;
  }

  return findHandles(children, sub_route, result);
}

function create(mnt, routes = {}) {
  const result = {};

  let prevHandles = [];

  RouteEvents.on(EventRouteChanged, (route) => {
    logger.info("--> route: ", route);
    const { state, search, from, to } = route;
    const handles = [];
    findHandles(routes, to, handles);

    // TODO: 依次挂载 handles，已挂载过的不再次挂载？

    mnt.innerHTML = "";

    (async () => {
      for (const h of handles) {
      }
    })();

    // for (const view of handles) {
    //   (async () => {
    //     const obj = await handle();
    //     if (_.has(obj, "root") && _.has(obj, "mount")) {
    //       obj.mount(mnt);
    //     }
    //   })();
    // }
  });

  return result;
}
