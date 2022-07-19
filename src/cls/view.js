import _ from "lodash";

import { bindDomEvents, unBindDomEvents } from "../events";
import { dataProxy } from "../proxy";

class View {
  template = null;
  name = null;
  tag = "div";

  data = {};

  render = () => {
    this.eventsUnBinders && unBindDomEvents(this.eventsUnBinders);

    this.eventsUnBinders = bindDomEvents(this);
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
