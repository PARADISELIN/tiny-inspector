"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _vue = require("vue");

var _App = _interopRequireDefault(require("./App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  const app = (0, _vue.createApp)(_App.default);

  app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ui-');

  return app;
}