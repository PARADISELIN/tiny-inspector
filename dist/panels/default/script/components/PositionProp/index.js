"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _vue = require("vue");

var _utils = require("../../../../../utils");

const DASH_SYMBOL = '-';
const PositionProp = (0, _vue.defineComponent)({
  name: 'position-item',
  props: {
    uuids: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  setup(props) {
    const position = (0, _vue.reactive)({
      x: 0,
      y: 0,
      z: 0
    });
    const integratedPosition = (0, _vue.reactive)({
      ix: DASH_SYMBOL,
      iy: DASH_SYMBOL,
      iz: DASH_SYMBOL
    });
    const xInputRef = (0, _vue.ref)(null);
    const yInputRef = (0, _vue.ref)(null);
    const zInputRef = (0, _vue.ref)(null);
    const nodesInfo = (0, _vue.ref)([]);
    (0, _vue.watch)(() => props.uuids, async () => {
      await handleUpdateNodesInfo();
    }, {
      immediate: true
    });
    (0, _vue.onMounted)(() => {
      initEventListener();
    });
    (0, _vue.onUnmounted)(() => {
      removeEventListener();
    });

    function initEventListener() {
      Editor.Message.addBroadcastListener('scene:change-node', updatePositionAfterChangeNode);
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('scene:change-node', updatePositionAfterChangeNode);
    } // handle 'ui-num-input' component change event


    async function onChange(dimension, event) {
      const nodesInfoValue = nodesInfo.value;
      if (nodesInfoValue.length === 0) return; // set single node property

      if (nodesInfoValue.length === 1) {
        const nodeInfo = nodesInfoValue[0];
        const dimensionValue = event.target.value;
        position[dimension] = dimensionValue;
        await handleUpdateNodePosition(nodeInfo, dimension, dimensionValue);
      } else {
        const dimensionValue = event.target.value;
        const key = 'i' + dimension;

        if (Reflect.has(integratedPosition, key)) {
          integratedPosition[key] = dimensionValue;
        }

        for (const nodeInfo of nodesInfoValue) {
          await handleUpdateNodePosition(nodeInfo, dimension, dimensionValue);
        }
      }
    } // update node information
    // trigger 'set-property' method in 'scene' extension


    async function handleUpdateNodePosition(nodeInfo, dimension, dimensionValue) {
      nodeInfo[dimension] = dimensionValue;
      const position = {
        x: nodeInfo.x,
        y: nodeInfo.y,
        z: nodeInfo.z
      };
      const executeSceneScriptOption = {
        name: 'tiny-inspector',
        method: 'setNodePosition',
        args: [nodeInfo.uuid, position]
      };
      await Editor.Message.request('scene', 'execute-scene-script', executeSceneScriptOption);
    } // update position(or integrated position) after 'change-node' in scene


    async function updatePositionAfterChangeNode(uuid) {
      const node = await Editor.Message.request('scene', 'query-node', uuid);
      const {
        x,
        y,
        z
      } = node.position.value;
      const nodesInfoValue = nodesInfo.value;
      nodesInfoValue.forEach(nodeInfo => {
        if (nodeInfo.uuid === uuid) {
          nodeInfo.x = x;
          nodeInfo.y = y;
          nodeInfo.z = z;
        }

        setPositionInfo(nodesInfoValue);
      });
    } // when some nodes selected, this extension need to show nodes position


    async function handleUpdateNodesInfo() {
      const uuids = props.uuids;

      if (uuids.length === 0) {
        nodesInfo.value = [];
        return;
      }

      const temp = [];

      for (const uuid of uuids) {
        const node = await Editor.Message.request('scene', 'query-node', uuid);
        const {
          x,
          y,
          z
        } = node.position.value;
        const info = {
          uuid,
          x,
          y,
          z
        };
        temp.push(info);
      }

      nodesInfo.value = temp;
      setPositionInfo(temp);
    } // set node information (position and integrated position)


    function setPositionInfo(nodesInfo) {
      if (nodesInfo.length === 1) {
        // single selected node
        position.x = nodesInfo[0].x;
        position.y = nodesInfo[0].y;
        position.z = nodesInfo[0].z;
      } else {
        // multiple selected nodes
        const isXAllEqual = (0, _utils.isAllElementEqualArray)(nodesInfo.map(item => item.x));
        const isYAllEqual = (0, _utils.isAllElementEqualArray)(nodesInfo.map(item => item.y));
        const isZAllEqual = (0, _utils.isAllElementEqualArray)(nodesInfo.map(item => item.z));
        integratedPosition.ix = isXAllEqual ? nodesInfo[0].x : DASH_SYMBOL;
        integratedPosition.iy = isYAllEqual ? nodesInfo[0].y : DASH_SYMBOL;
        integratedPosition.iz = isZAllEqual ? nodesInfo[0].z : DASH_SYMBOL;
        setNumInputManually();
      }
    } // setting data directly is invalid, maybe is a bug
    // so we need a method to set value in UI by manually


    function setNumInputManually() {
      const DASH_SYMBOL = '-';

      if (xInputRef.value) {
        xInputRef.value.$input.value = integratedPosition.ix !== DASH_SYMBOL ? integratedPosition.ix : DASH_SYMBOL;
      }

      if (yInputRef.value) {
        yInputRef.value.$input.value = integratedPosition.iy !== DASH_SYMBOL ? integratedPosition.iy : DASH_SYMBOL;
      }

      if (zInputRef.value) {
        zInputRef.value.$input.value = integratedPosition.iz !== DASH_SYMBOL ? integratedPosition.iz : DASH_SYMBOL;
      }
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
      "preci": "3",
      "step": "0.001",
      "value": nodesInfo.value.length === 1 ? position.x : integratedPosition.ix,
      "onchange": $event => onChange('x', $event)
    }, null)]), (0, _vue.createVNode)("li", {
      "class": "pos__field"
    }, [(0, _vue.createVNode)("span", null, [(0, _vue.createTextVNode)("y: ")]), (0, _vue.createVNode)((0, _vue.resolveComponent)("ui-num-input"), {
      "className": "pos__input",
      "ref": yInputRef,
      "preci": "3",
      "step": "0.001",
      "value": nodesInfo.value.length === 1 ? position.y : integratedPosition.iy,
      "onchange": $event => onChange('y', $event)
    }, null)]), (0, _vue.createVNode)("li", {
      "class": "pos__field"
    }, [(0, _vue.createVNode)("span", null, [(0, _vue.createTextVNode)("z: ")]), (0, _vue.createVNode)((0, _vue.resolveComponent)("ui-num-input"), {
      "className": "pos__input",
      "ref": zInputRef,
      "preci": "3",
      "step": "0.001",
      "value": nodesInfo.value.length === 1 ? position.z : integratedPosition.iz,
      "onchange": $event => onChange('z', $event)
    }, null)])])]);
  }

});
var _default = PositionProp;
exports.default = _default;