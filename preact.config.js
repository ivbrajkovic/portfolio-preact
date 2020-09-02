const path = require("path");

export default (config, env, helpers) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    ["@app"]: path.resolve(__dirname, "./src"),
    ["@lib"]: path.resolve(__dirname, "./src/lib"),
    ["@vendor"]: path.resolve(__dirname, "./src/vendor"),
    ["@components"]: path.resolve(__dirname, "./src/components"),
  };
};
