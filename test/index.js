const { main } = require("../src/index.js");
const { resolve } = require("path");

main({
  entry: resolve(__dirname, "./sample/index.js"),
  output: resolve(__dirname, "./output"),
});
