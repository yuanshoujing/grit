import mitt from "mitt";
import debug from "debug";

import { EventRouteChanged } from "./events";

const log = debug("niba:router");

export const RouteEvents = mitt();

const options = {
  mode: "hash",
  context: null,
};

const prevRoute = {
  state: null,
  from: null,
  to: null,
  search: null,
};

const searchParser = (url) => {
  const result = {};
  for (const [k, v] of url.searchParams.entries()) {
    result[k] = v;
  }

  return result;
};

const urlParser = (dest, origin = location.origin) => {
  const url = new URL(dest, origin);
  const path = url.pathname.length > 0 ? url.pathname : null;
  const search = searchParser(url);

  const hashUrl = new URL(url.hash.slice(1), origin);
  const hash = hashUrl.pathname.length > 0 ? hashUrl.pathname : null;
  Object.assign(search, searchParser(hashUrl));

  return {
    path,
    hash,
    search,
  };
};

const stateChanged = (evt) => {
  let pathInfo = null;
  if (evt.type === "popstate") {
    pathInfo = urlParser(location.href);
  } else if (evt.to) {
    pathInfo = urlParser(evt.to);
  } else {
    return;
  }

  const route = {
    state: evt.state,
    search: pathInfo.search,
    from: prevRoute.to,
    to: options.mode === "history" ? pathInfo.path : pathInfo.hash,
  };

  if (prevRoute.to !== route.to) {
    RouteEvents.emit(EventRouteChanged, route);
    Object.assign(prevRoute, route);
  }
};

export const boot = (opts) => {
  Object.assign(options, opts);
  window.removeEventListener("popstate", stateChanged);
  window.addEventListener("popstate", stateChanged);
  stateChanged({
    type: "popstate",
    state: null,
  });
};

function clean(url = "") {
  const r = /^(#\/|#|\/)+/;
  const _url = url.replace(r, "");
  const { mode } = options;

  return mode === "hash" ? "#/" + _url : "/" + _url;
}

export const push = (url, state = null) => {
  log("--> push: ", url);
  const to = clean(url);

  history.pushState(state, null, to);
  stateChanged({
    state,
    to,
  });
};

export const replace = (url, state = null) => {
  log("--> push: ", url);
  const to = clean(url);

  history.replaceState(state, null, to);
  stateChanged({
    state,
    to,
  });
};
