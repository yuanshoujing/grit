import _ from "lodash";
import mitt from "mitt";

import { bindDomEvents, unBindDomEvents } from "./events";

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

async function _mount(context, node) {
  const { root, prepare, mounted, render, rendered = false } = context;
  _.isFunction(prepare) && (await prepare.call(context));
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

function create({ className, name, tag = "div" }) {
  const root = document.createElement(tag);
  root.id = _.uniqueId("grit-");
  name && root.setAttribute("name", name);
  className && (root.className = className);

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

  const mount = (wrap) => {
    _mount(result, wrap);
  };

  const reformed = reform(result);

  Object.assign(result, reformed, {
    render,
    mount,
  });
  return result;
}

export default function (args) {
  return function () {
    return create(args);
  };
}
