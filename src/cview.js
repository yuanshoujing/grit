import mitt from "mitt";
import _ from "lodash";
import debug from "debug";

import { dataProxy } from "./proxy";

const log = debug("niba:view");

const { on, off, emit } = mitt();

export default class View {
  on = on;
  off = off;
  emit = emit;

  data = {
    a: 1,
  };

  constructor({ tag = "div", className = null, name = null }) {
    log(Object.keys(this));
    this.root = document.createElement(tag);
    this.root.id = _.uniqueId("niba-");

    this.name = name;
    name && this.root.setAttribute("name", name);

    className && (this.root.className = className);

    this.$ = this.root.querySelector.bind(this.root);
    this.$$ = this.root.querySelectorAll.bind(this.root);
    log(typeof this.data);
    this.data = dataProxy(this.data, this.emit);
  }
}
