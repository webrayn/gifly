const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/scripts/scripts.js",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "scripts.js"
  }
};
