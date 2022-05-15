function bindDomEvents(context) {
  const { events } = context;
  if (!events) {
    return;
  }

  for (const [selector, event] of Object.entries(events)) {
  }
}

const bindEvents = () => {
  if (!context.events) {
    return;
  }

  Object.entries(context.events).forEach(([selector, evtHandles]) => {
    const nodes = context.els(selector);
    if (!nodes || nodes.length < 1) {
      return;
    }

    Object.entries(evtHandles).forEach(([evt, handleName]) => {
      const handle = context[handleName].bind(context);

      nodes.forEach((n) => {
        n.addEventListener(evt, handle);

        eventsUnbinder.push(() => {
          n.removeEventListener(evt, handle);
        });
      });
    });
  });
};
