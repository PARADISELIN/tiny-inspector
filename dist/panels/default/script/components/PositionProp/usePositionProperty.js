"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = usePositionProperty;

var _vue = require("vue");

var _utils = require("../../../../../utils");

var _constants = require("../../constants");

var _package = _interopRequireDefault(require("../../../../../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAllNodesPositionEqual(nodesInfo, dimension) {
  const allNodesPosition = nodesInfo.map(item => item[dimension]);
  return (0, _utils.isAllElementEqualArray)(allNodesPosition);
}

function usePositionProperty() {
  const position = (0, _vue.reactive)({
    x: 0,
    y: 0,
    z: 0
  });
  const nodesInfo = (0, _vue.ref)([]);
  const xInputRef = (0, _vue.ref)(null);
  const yInputRef = (0, _vue.ref)(null);
  const zInputRef = (0, _vue.ref)(null);

  const setPosition = () => {
    const nodesInfoValue = nodesInfo.value;

    if (nodesInfoValue.length === 0) {
      return;
    }

    const standardNodeInfo = nodesInfoValue[0];

    if (nodesInfoValue.length === 1) {
      position.x = standardNodeInfo.x;
      position.y = standardNodeInfo.y;
      position.z = standardNodeInfo.z;
    } else {
      const isAllXPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'x');
      const isAllYPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'y');
      const isAllZPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'z');
      position.x = isAllXPositionEqual ? standardNodeInfo.x : _constants.DASH_SYMBOL;
      position.y = isAllYPositionEqual ? standardNodeInfo.y : _constants.DASH_SYMBOL;
      position.z = isAllZPositionEqual ? standardNodeInfo.z : _constants.DASH_SYMBOL;
    } // hack: when value is string, 'reactive' doesn't work


    if (xInputRef.value) xInputRef.value.$input.value = position.x;
    if (yInputRef.value) yInputRef.value.$input.value = position.y;
    if (zInputRef.value) zInputRef.value.$input.value = position.z;
  };

  const updateNodeInfo = async uuid => {
    const nodesInfoValue = nodesInfo.value;
    const nodeInfo = nodesInfoValue.find(item => item.uuid === uuid);
    if (!nodeInfo) return;
    const node = await Editor.Message.request('scene', 'query-node', uuid);
    const {
      x,
      y,
      z
    } = node.position.value;
    nodeInfo.x = x;
    nodeInfo.y = y;
    nodeInfo.z = z;
  };

  const setNodesInfo = async uuids => {
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
      const nodeInfo = {
        uuid,
        x,
        y,
        z
      };
      temp.push(nodeInfo);
    }

    nodesInfo.value = temp;
  };

  const updatePosition = async uuids => {
    await setNodesInfo(uuids);
    setPosition();
  };

  const setNodePositionOnScene = async (nodeInfo, dimension, dimensionValue) => {
    nodeInfo[dimension] = dimensionValue;
    const {
      uuid,
      x,
      y,
      z
    } = nodeInfo;
    const position = {
      x,
      y,
      z
    };
    const executeSceneScriptOption = {
      name: _package.default.name,
      method: 'setNodePosition',
      args: [uuid, position]
    };
    await Editor.Message.request('scene', 'execute-scene-script', executeSceneScriptOption);
  };

  const onPositionChange = async (dimension, event) => {
    const nodesInfoValue = nodesInfo.value;
    if (nodesInfoValue.length === 0) return;
    const dimensionValue = event.target.value;

    for (const nodeInfo of nodesInfoValue) {
      position[dimension] = dimensionValue;
      await setNodePositionOnScene(nodeInfo, dimension, dimensionValue);
    }
  };

  return {
    position,
    nodesInfo,
    xInputRef,
    yInputRef,
    zInputRef,
    setNodesInfo,
    setPosition,
    updatePosition,
    updateNodeInfo,
    onPositionChange
  };
}