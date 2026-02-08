import van from "vanjs-core";

/** atom — reactive primitive with reset and functional update */
export const atom = (initial) => {
  const s = van.state(initial);
  s.reset = () => { s.val = initial; };
  s.update = (fn) => { s.val = fn(s.val); };
  return s;
};

/** map — reactive object where each key becomes a van.state */
export const map = (initial) => {
  const store = {};
  const _keys = Object.keys(initial);

  for (const key of _keys) store[key] = van.state(initial[key]);

  store.get = () => Object.fromEntries(_keys.map(k => [k, store[k].val]));
  store.set = (update) => {
    for (const [k, v] of Object.entries(update)) {
      if (store[k]) store[k].val = v;
    }
  };
  store.reset = () => { for (const k of _keys) store[k].val = initial[k]; };

  return store;
};

/** computed — derived state that auto-updates when dependencies change */
export const computed = (fn) => van.derive(fn);
