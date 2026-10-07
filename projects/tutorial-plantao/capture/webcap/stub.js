const React = require('react');
const noop = () => {};
const Null = () => null;
const handler = {
  get(target, prop) {
    if (prop === '__esModule') return true;
    if (prop === 'default') return proxy;
    if (prop in target) return target[prop];
    return proxy;
  },
  apply() { return undefined; },
};
const proxy = new Proxy(function Stub() { return null; }, handler);
module.exports = proxy;
