"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _usePositionProperty = _interopRequireDefault(require("./usePositionProperty"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PositionProp = (0, _vue.defineComponent)({
  name: 'PositionProp',
  props: {
    uuids: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  setup(props) {
    const {
      position,
      xInputRef,
      yInputRef,
      zInputRef,
      nodesInfo,
      updatePosition,
      updateNodeInfo,
      setPosition,
      onPositionChange
    } = (0, _usePositionProperty.default)();
    (0, _vue.watch)(() => props.uuids, async () => {
      await updatePosition(props.uuids);
    }, {
      immediate: true
    });
    (0, _vue.onMounted)(() => {
      initEventListener();
    });
    (0, _vue.onUnmounted)(() => {
      removeEventListener();
    });

    async function changeNodeHandler(uuid) {
      if (nodesInfo.value.length === 0) {
        return updatePosition([uuid]);
      }

      await updateNodeInfo(uuid);
      setPosition();
    }

    function initEventListener() {
      Editor.Message.addBroadcastListener('scene:change-node', changeNodeHandler);
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('scene:change-node', changeNodeHandler);
    }

    return () => (0, _vue.createVNode)("div", {
      "class": "pos"
    }, [(0, _vue.createVNode)("div", {
      "class": "pos__label"
    }, [(0, _vue.createTextVNode)("Position:")]), (0, _vue.createVNode)("ul", {
      "class": "pos__fields"
    }, [(0, _vue.createVNode)("li", {
      "class": "pos__field"
    }, [(0, _vue.createVNode)("span", null, [(0, _vue.createTextVNode)("x: ")]), (0, _vue.createVNode)((0, _vue.resolveComponent)("ui-num-input"), {
      "class": "pos__input",
      "ref": xInputRef,
      "step": "0.1",
      "value": position.x,
      "onchange": $event => onPositionChange('x', $event)
    }, null)]), (0, _vue.createVNode)("li", {
      "class": "pos__field"
    }, [(0, _vue.createVNode)("span", null, [(0, _vue.createTextVNode)("y: ")]), (0, _vue.createVNode)((0, _vue.resolveComponent)("ui-num-input"), {
      "className": "pos__input",
      "ref": yInputRef,
      "step": "0.1",
      "value": position.y,
      "onchange": $event => onPositionChange('y', $event)
    }, null)]), (0, _vue.createVNode)("li", {
      "class": "pos__field"
    }, [(0, _vue.createVNode)("span", null, [(0, _vue.createTextVNode)("z: ")]), (0, _vue.createVNode)((0, _vue.resolveComponent)("ui-num-input"), {
      "className": "pos__input",
      "ref": zInputRef,
      "step": "0.1",
      "value": position.z,
      "onchange": $event => onPositionChange('z', $event)
    }, null)])])]);
  }

});
var _default = PositionProp;
exports.default = _default;