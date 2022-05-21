import _ from "lodash";
import debug from "debug";

import { EventDataChanged } from "./events";

const logger = debug("proxy");

export function dataProxy(data, emit) {
  return new Proxy(data, {
    set(target, property, value) {
      logger(JSON.stringify(target));
      const prev = target[property];
      logger(JSON.stringify(prev));
      const prevObj = { ...target };
      logger(JSON.stringify(prevObj));
      target[property] = value;
      const current = { ...target };
      logger(JSON.stringify(current));

      if (!_.isEqual(prev, value)) {
        emit(EventDataChanged, [value, prev, property]);
      }

      return true;
    },
  });
}
