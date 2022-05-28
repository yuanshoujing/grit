import _ from "lodash";
import mitt from "mitt";
import debug from "debug";

import { bindDomEvents, unBindDomEvents, EventDataChanged } from "./events";
import { dataProxy } from "./proxy";

const log = debug("niba:view");

function _render(root, template, data = {}) {
  let compile = null;
  if (typeof template === "function") {
    compile = template;
  } else if (typeof template === "string") {
    compile = _.template(template);
  } else {
    return;
  }

  root.innerHTML = compile({ ...data });
}

async function _reformChildren(children = {}) {
  const result = {};
  for (const [slot, create] of Object.entries(children)) {
    result[slot] = await create();
  }

  return result;
}

function _mountChildren(children = {}, $) {
  for (const [slot, child] of Object.entries(children)) {
    log("--> child: %O", child);
    const mnt = $(`slot[name=${slot}]`);
    mnt && child.mount(mnt);
  }
}

async function create(args) {
  const { template, tag = "div", className = null, name = null } = args;

  const root = document.createElement(tag);
  root.id = _.uniqueId("niba-");
  name && root.setAttribute("name", name);
  className && (root.className = className);
  const $ = root.querySelector.bind(root);
  const $$ = root.querySelectorAll.bind(root);

  const { on, off, emit } = mitt();
  const result = Object.assign({ ...args }, { $, $$, root, on, off, emit });

  const children = await _reformChildren(result.children);
  const data = dataProxy({ ...result.data }, result.emit);
  Object.assign(result, { children, data });

  let rendered = false;
  let unBinders = null;
  const render = () => {
    unBinders && unBindDomEvents(unBinders);
    _render(root, template, data);
    unBinders = bindDomEvents(result);
    rendered = true;

    _mountChildren(children, $);
  };

  const rerender = _.debounce(() => {
    render();
    log("--> rendered");
  }, 100);

  const mount = (wrap) => {
    rendered || render();
    wrap.replaceChildren(root);

    on(EventDataChanged, rerender);

    const { mounted } = result;
    _.isFunction(mounted) && mounted.call(result);
  };

  Object.assign(result, { mount });

  return result;
}

export default function (args) {
  return async function () {
    const { prepare = null } = args;
    _.isFunction(prepare) && (await prepare.call(args));
    return await create(args);
  };
}
