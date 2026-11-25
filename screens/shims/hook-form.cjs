const real = require("react-hook-form");

module.exports = {
  ...real,
  useForm: (options = {}) => real.useForm({ ...options, defaultValues: { ...options.defaultValues, ...globalThis.__vmsFixture?.form } }),
};
