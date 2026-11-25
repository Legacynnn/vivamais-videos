const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [],
  plugins: [
    plugin(({ addVariant }) => {
      for (const on of ["ios", "native"]) addVariant(on, "&");
      for (const off of ["android", "web"]) addVariant(off, `&:where(.vms-${off})`);
    }),
  ],
};
