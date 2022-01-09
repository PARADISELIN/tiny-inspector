"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unload = exports.methods = exports.load = void 0;

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//@ts-ignore

/**
 * @en
 * @zh 为扩展的主进程的注册方法
 */
const methods = {
  openPanel() {
    Editor.Panel.open(_package.default.name);
  }

};
/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */

exports.methods = methods;

const load = function () {};
/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */


exports.load = load;

const unload = function () {};

exports.unload = unload;