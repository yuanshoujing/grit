import _ from "lodash";

import { bindDomEvents, EventDataChanged, unBindDomEvents } from "../events";
import { dataProxy } from "../proxy";

class View {
  template = null;
  name = null;
  tag = "div";

  data = {};

  #rendered = false;
  #childrenInstance = {};

  render = () => {
    this.eventsUnBinders && unBindDomEvents(this.eventsUnBinders);

    let compile = null;
    if (_.isFunction(this.template)) {
      compile = this.template;
    } else if (_.isString(this.template)) {
      compile = _.template(this.template);
    }

    this.root.innerHTML = compile({ ...data });

    this.eventsUnBinders = bindDomEvents(this);
    this.#rendered = true;

    // TODO: mount children
    this.#mountChildren();
  };

  mount = (element) => {
    this.#rendered || this.render();
    element.replaceChildren(this.root);

    this.on(EventDataChanged, _.debounce(this.render, 100));

    this.mounted();
  };

  mounted() {}

  #mountChildren = () => {
    for (const [slot, child] of Object.entries(children)) {
      log("--> child: %O", child);
      const mnt = $(`slot[name=${slot}]`);
      mnt && child.mount(mnt);
    }
  };

  constructor() {
    const root = document.createElement(this.tag);
    root.id = _.uniqueId("nb-");
    this.name && root.setAttribute("name", this.name);

    this.$ = root.querySelector.bind(root);
    this.$$ = root.querySelectorAll.bind(root);
    this.root = root;

    const { on, off, emit } = mitt();
    this.on = on;
    this.off = off;
    this.emit = emit;

    this.data = dataProxy({ ...this.data }, this.emit);
  }
}
