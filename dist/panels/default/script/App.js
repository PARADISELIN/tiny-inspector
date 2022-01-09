"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _PositionProp = _interopRequireDefault(require("./components/PositionProp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const App = (0, _vue.defineComponent)({
  name: 'App',
  components: {
    PositionProp: _PositionProp.default
  },

  setup() {
    const uuids = (0, _vue.ref)([]);
    (0, _vue.onMounted)(async () => {
      initSelectedNodesUUIDList();
      initEventListener();
    });
    (0, _vue.onUnmounted)(() => {
      removeEventListener();
    });

    function initEventListener() {
      Editor.Message.addBroadcastListener('selection:select', updateUUIDList);
      Editor.Message.addBroadcastListener('selection:unselect', updateUUIDList);
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('selection:select', updateUUIDList);
      Editor.Message.removeBroadcastListener('selection:unselect', updateUUIDList);
    } // initialize selected nodes uuid list


    function initSelectedNodesUUIDList() {
      updateUUIDList();
    }

    function updateUUIDList() {
      uuids.value = Editor.Selection.getSelected('node');
    }

    return () => (0, _vue.createVNode)("div", {
      "class": "inspector"
    }, [(0, _vue.createVNode)("header", {
      "class": "inspector__header"
    }, [(0, _vue.createTextVNode)("Tiny Node Inspector")]), uuids.value.length > 0 ? (0, _vue.createVNode)("main", {
      "class": "inspector__content"
    }, [(0, _vue.createVNode)(_PositionProp.default, {
      "uuids": uuids.value
    }, null)]) : (0, _vue.createVNode)("div", {
      "class": "inspector__none"
    }, [(0, _vue.createTextVNode)("You did not select any nodes")])]);
  }

});
var _default = App;
exports.default = _default;