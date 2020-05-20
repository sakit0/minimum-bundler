const { promises, readFileSync } = require("fs");
const { join, dirname, basename } = require("path");
const parser = require("@babel/parser");
const { default: traverse } = require("@babel/traverse");

function mainTemp(entryName, modules) {
  return `((modules) => {
    const installedModules = {};
    function require(moduleName) {
      if(installedModules[moduleName]){
        return installedModules[moduleName].exports;
      }
      installedModules[moduleName] = {exports:{}};
      const module = installedModules[moduleName];
      modules[moduleName](module,module.exports, require);

      return module.exports;
    }

    return require('${entryName}');
  })({
    ${Object.entries(modules)
      .map(([fileName, code]) => {
        return `'${fileName}':${moduleTemp(code)}`;
      })
      .join(",")}
  })`;
}

function moduleTemp(code) {
  return `function(module, exports, require) {
    ${code}
  }`;
}

async function main({ entry, output }) {
  const data = await promises.readFile(entry, "utf-8");
  const bathPath = dirname(entry);
  const entryName = basename(entry);
  const res = {};
  res[entryName] = data;

  walk(data);

  function walk(code) {
    const ast = parser.parse(code);
    traverse(ast, {
      CallExpression({ node }) {
        if (
          node.callee.name === "require" &&
          node.callee.type === "Identifier"
        ) {
          const key = node.arguments[0].value;
          const c = readFileSync(join(bathPath, key), "UTF-8");
          res[key] = c;
          walk(c);
        }
      },
    });
  }
  console.log(mainTemp(entryName, res));
}

module.exports = {
  main,
};
