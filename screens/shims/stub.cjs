const deep = new Proxy(function () {}, {
  get(_, key) {
    if (key === Symbol.toPrimitive) return () => "";
    if (key === Symbol.iterator) return function* () {};
    if (typeof key === "symbol" || key === "then" || key === "$$typeof" || key === "toJSON") return undefined;
    if (key === "length") return 0;
    return deep;
  },
  apply: () => deep,
  construct: () => deep,
});

const REACT_KEYS = new Set(["$$typeof", "prototype", "defaultProps", "propTypes", "displayName", "contextTypes", "contextType", "childContextTypes", "getDerivedStateFromProps", "getDerivedStateFromError", "render", "then"]);

function named(name) {
  if (/^use[A-Z]/.test(name)) return () => deep;
  if (/^[A-Z]/.test(name)) {
    const Stub = ({ children }) => (typeof children === "function" ? null : (children ?? null));
    return new Proxy(Stub, {
      get: (target, key) => (key in target ? target[key] : typeof key !== "string" || REACT_KEYS.has(key) ? undefined : /^([A-Z]|use[A-Z])/.test(key) ? named(key) : deep),
    });
  }
  return deep;
}

function withFallback(known = {}) {
  const cache = { ...known };
  const mod = new Proxy(cache, {
    get(target, key) {
      if (key === "__esModule" || key === "__vmsShim") return true;
      if (key === "default") return "default" in target ? target.default : mod;
      if (typeof key === "symbol") return undefined;
      if (!(key in target)) target[key] = named(key);
      return target[key];
    },
    has: () => true,
  });
  return mod;
}

module.exports = { deep, named, withFallback };
