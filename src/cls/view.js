class View {
  template = null;

  constructor({ name, tag = "div" }) {
    this.name = name;
    this.tag = tag;

    const root = document.createElement(this.tag);
    root.id = _.uniqueId("niba-");
    this.name && root.setAttribute("name", this.name);

    this.$ = root.querySelector.bind(root);
    this.$$ = root.querySelectorAll.bind(root);
    this.root = root;

    const { on, off, emit } = mitt();
    this.on = on;
    this.off = off;
    this.emit = emit;
  }
}
