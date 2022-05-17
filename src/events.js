export const EventPropsChanged = Symbol("evt-props-changed");
export const EventDataChanged = Symbol("evt-data-changed");
export const EventRouteChanged = Symbol("evt-route-changed");

export function bindDomEvents(context) {
  const unBinders = [];
  const { events, els } = context;
  if (!events) {
    return unBinders;
  }

  for (const [selector, eventMapping] of Object.entries(events)) {
    const nodes = els(selector);
    if (!nodes || nodes.length < 1) {
      continue;
    }

    for (const [event, handleName] of Object.entries(eventMapping)) {
      if (!Object.keys(context).includes(handleName)) {
        continue;
      }

      const handle = context[handleName].bind(context);
      for (const node of nodes.entries()) {
        node.addEventListener(event, handle);
        unBinders.push(() => {
          node.removeEventListener(event, handle);
        });
      }
    }
  }

  return unBinders;
}

export function unBindDomEvents(unBinders) {
  unBinders.forEach((unbind) => {
    unbind();
  });
}
