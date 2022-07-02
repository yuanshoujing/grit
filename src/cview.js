import mitt from "mitt";
import _ from "lodash";
import debug from "debug";

import { dataProxy } from "./proxy";
import { bindDomEvents, unBindDomEvents } from "./events";

const log = debug("niba:view");

const { on, off, emit } = mitt();

export default class View {
  on = on;
  off = off;
  emit = emit;

  data = {};

  #rendered = false;
  #unBinders = null;

  render = () => {
    this.#unBinders && unBindDomEvents(this.#unBinders);
  };

  constructor({ tag = "div", className = null, name = null }) {
    this.root = document.createElement(tag);
    this.root.id = _.uniqueId("niba-");

    this.name = name;
    name && this.root.setAttribute("name", name);

    className && (this.root.className = className);

    this.$ = this.root.querySelector.bind(this.root);
    this.$$ = this.root.querySelectorAll.bind(this.root);

    this.data = dataProxy(this.data, this.emit);
  }
}
