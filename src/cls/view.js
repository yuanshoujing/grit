import _ from "lodash";
import mitt from "mitt";
import debug from "debug";

import { bindDomEvents, EventDataChanged, unBindDomEvents } from "../events";
import { dataProxy } from "../proxy";

const log = debug("niba:view");

export default class View {
  template = null;
  name = null;
  tag = "div";

  data = {};

  #dataSource = null;
  #rendered = false;
  #childrenInstance = {};

  get gate() {
    return this.#rendered ? $("slot[role=gate]") : null;
  }

  render = () => {
    this.eventsUnBinders && unBindDomEvents(this.eventsUnBinders);

    let compile = null;
    if (_.isFunction(this.template)) {
      compile = this.template;
    } else if (_.isString(this.template)) {
      compile = _.template(this.template);
    }

    log("--> datasource: %O", this.#dataSource);
    this.root.innerHTML = compile({ ...this.#dataSource });

    this.eventsUnBinders = bindDomEvents(this);
    this.#rendered = true;

    this.#mountChildren();
  };

  mount = (element) => {
    this.#rendered || this.render();
    element.replaceChildren(this.root);

    this.on(EventDataChanged, _.debounce(this.render, 100));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.mounted();
      });
    });
  };

  mounted() {}

  #mountChildren = () => {
    // 子节点挂载点形如 <slot name='c-name' key="0"></slot>
    if (!this.children) {
      return;
    }

    for (const [slot, clazz] of Object.entries(this.children)) {
      const mnts = $$(`slot[name=${slot}]`);

      for (const mnt of mnts) {
        const key = mnt.getAttribute("key") || "";
        const uid = `${slot}^${key}`;

        const instance = this.#childrenInstance[uid];
        if (!instance) {
          instance = Reflect.construct(clazz);
          Object.assign(this.#childrenInstance, {
            [uid]: instance,
          });
        }

        instance.mount(mnt);
      }
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

    this.#dataSource = dataProxy(this.data, this.emit);
  }
}
