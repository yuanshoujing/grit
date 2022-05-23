import _ from "lodash";

function mount(context, node) {}

const createInstance = () => {
  const _children = context.children || {};
  const _routes = context.routes || {};

  Object.entries(_children).forEach(([name, create]) => {
    _children[name] = create();
  });

  Object.entries(_routes).forEach(([name, create]) => {
    if (_.isFunction(create) && create.name === "niba") {
      _routes[name] = create();
    }
  });

  Object.assign(context, {
    children: _children,
    routes: _routes,
  });
};

const prepare = _.once(() => {
  createInstance();
  context.render();

  context.on(EventDataChanged, rerender);

  if (context.routes) {
    RouteEvents.on(
      EventRouteChanged,
      routeHandle
      // context._routeChangeHandle.bind(context)
    );
  }
});

const mount = (wrap) => {
  prepare();
  wrap.replaceChildren(context.root);

  if (_.isFunction(context.mounted)) {
    context.mounted();
  }
};

const render = () => {
  if (!_.isFunction(context.template)) {
    return;
  }

  unbindEvents();

  context.root.innerHTML = context.template(context.data);

  bindEvents();

  if (context.children) {
    Object.entries(context.children).forEach(([slot, child]) => {
      const mnt = context.el(`slot[name=${slot}]`);
      if (!mnt) {
        return;
      }

      child.mount(mnt);
    });
  }

  if (context.routes && context.route) {
    routeHandle(context.route);
  }
};
