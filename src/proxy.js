import _ from "lodash";

import { EventDataChanged } from "./events";

export function dataProxy(data, emit) {
  return new Proxy(data, {
    set(target, property, value) {
      const prev = target[property];
      target[property] = value;

      if (!_.isEqual(prev, value)) {
        emit(EventDataChanged, { value, prev });
      }

      return true;
    },
  });
}
