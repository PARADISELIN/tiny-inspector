"use strict";

var _fsExtra = require("fs-extra");

var _path = require("path");

var _createApp = _interopRequireDefault(require("./createApp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const weakMap = new WeakMap();
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }

module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log('show');
    },

    hide() {
      console.log('hide');
    }

  },
  template: (0, _fsExtra.readFileSync)((0, _path.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
  style: (0, _fsExtra.readFileSync)((0, _path.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
  $: {
    app: '#app'
  },

  ready() {
    if (this.$.app) {
      const app = (0, _createApp.default)();
      app.mount(this.$.app);
      weakMap.set(this, app);
    }
  },

  beforeClose() {},

  close() {
    const app = weakMap.get(this);

    if (app) {
      app.unmount();
    }
  },

  methods: {}
});