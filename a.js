((modules) => {
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

    return require('index.js');
  })({
    'index.js':function(module, exports, require) {
    const { hello } = require("./module.js");
const { hello2 } = require("./module2.js");

console.log(hello());
console.log(hello2());

  },'./module.js':function(module, exports, require) {
    function hello() {
  return "hello";
}

module.exports = { hello };

  },'./module2.js':function(module, exports, require) {
    function hello2() {
  return "hello2";
}

module.exports = { hello2 };

  }
  })
