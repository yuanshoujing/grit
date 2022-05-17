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
  for (const [name, create] of Object.entries(children)) {
    result[name] = create();
  }
  return result;
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
  };

  return result;
}

export default function (args) {
  return function () {
    return create(args);
  };
}
