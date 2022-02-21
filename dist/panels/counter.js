"use strict";
var vue = require("vue");
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = vue.defineComponent({
  name: "Counter",
  setup() {
    const count = vue.ref(0);
    const increase = () => {
      count.value++;
    };
    const decrease = () => {
      count.value--;
    };
    return {
      count,
      increase,
      decrease
    };
  }
});
const _hoisted_1 = { class: "counter" };
const _hoisted_2 = { class: "counter__title" };
const _hoisted_3 = { class: "counter__buttons" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
    vue.createElementVNode("h1", _hoisted_2, "Counter: " + vue.toDisplayString(_ctx.count), 1),
    vue.createElementVNode("div", _hoisted_3, [
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.increase())
      }, "increase"),
      vue.createElementVNode("button", {
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.decrease())
      }, "decrease")
    ])
  ]);
}
var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
function createApp() {
  const app = vue.createApp(App);
  app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("ui-");
  return app;
}
const weakMap = /* @__PURE__ */ new WeakMap();
module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log("show");
    },
    hide() {
      console.log("hide");
    }
  },
  template: '<div id="app"></div>',
  $: {
    app: "#app"
  },
  ready() {
    if (this.$.app) {
      const app = createApp();
      app.mount(this.$.app);
      weakMap.set(this, app);
    }
  },
  beforeClose() {
  },
  close() {
    const app = weakMap.get(this);
    if (app) {
      app.unmount();
    }
  },
  methods: {}
});
