import _ from "lodash";
import mitt from "mitt";

import { bindDomEvents, unBindDomEvents, EventDataChanged } from "./events";
import { dataProxy } from "./proxy";

function _render({ root, template, data = {} }) {
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

function reform({ children = {} }) {
  const result = {};
  for (const [slot, create] of Object.entries(children)) {
    result[slot] = create();
  }

  return {
    children: result,
  };
}

function _mount(context, node) {
  const { root, mounted, render, rendered = false } = context;
  rendered || render();
  node.replaceChildren(root);
  _.isFunction(mounted) && mounted.call(context);
}

function _mountChildren(context) {
  const { $, children = {} } = context;
  for (const [slot, child] of Object.entries(children)) {
    const mnt = $(`slot[name=${slot}]`);
    mnt && child.mount(mnt);
  }
}

async function create({
  template,
  data = {},
  children = {},
  className = null,
  name = null,
  prepare = null,
  tag = "div",
}) {
  const root = document.createElement(tag);
  root.id = _.uniqueId("niba-");
  name && root.setAttribute("name", name);
  className && (root.className = className);
  const $ = root.querySelector.bind(root);
  const $$ = root.querySelectorAll.bind(root);

  const result = mitt();

  let unBinders = null;
  const render = () => {
    unBinders && unBindDomEvents(unBinders);
    _render(result);
    unBinders = bindDomEvents(result);

    Object.assign(result, {
      rendered: true,
    });

    _mountChildren(result);
  };

  const rerender = _.debounce(() => {
    render();
  }, 100);

  const mount = (wrap) => {
    _mount(result, wrap);
  };

  const reformed = reform({ children });
  Object.assign(result, reformed);

  _.isFunction(prepare) && (await prepare.call(result));

  const dp = dataProxy({ ...data }, result.emit);

  Object.assign(result, {
    $,
    $$,
    root,
    template,
    data: dp,
    className,
    name,
    prepare,
    tag,
    render,
    mount,
  });
  return result;
}

export default function (args) {
  return async function () {
    return await create(args);
  };
}
