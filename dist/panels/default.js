"use strict";
var vue = require("vue");
function isAllElementEqualArray(data) {
  if (data.length === 0)
    return false;
  if (data.length === 1)
    return true;
  return data.every((item) => item === data[0]);
}
const DASH_SYMBOL = "-";
const package_version = 2;
const version = "1.0.0";
const name = "tiny-inspector";
const description = "i18n:tiny-inspector.description";
const main = "./dist/main.js";
const dependencies = {
  "fs-extra": "^10.0.0",
  vue: "^3.2.29"
};
const devDependencies = {
  "@types/fs-extra": "^9.0.5",
  "@types/node": "^16.0.1",
  "@vitejs/plugin-vue": "^2.2.2",
  "@vitejs/plugin-vue-jsx": "^1.3.7",
  "@vue/babel-plugin-jsx": "^1.1.1",
  "@vue/devtools": "^6.0.12",
  "cross-env": "^7.0.3",
  esbuild: "^0.14.23",
  prettier: "^2.5.1",
  rimraf: "^3.0.2",
  sass: "^1.49.8",
  typescript: "^4.3.4",
  vite: "^2.8.4"
};
const panels = {
  "default": {
    title: "tiny-inspector Default Panel",
    type: "dockable",
    main: "dist/panels/default.js",
    size: {
      "min-width": 400,
      "min-height": 300,
      width: 600,
      height: 600
    }
  },
  counter: {
    title: "tiny-inspector Counter Panel",
    type: "dockable",
    main: "dist/panels/counter.js",
    size: {
      "min-width": 400,
      "min-height": 300,
      width: 800,
      height: 600
    }
  }
};
const contributions = {
  menu: [
    {
      path: "i18n:menu.panel/tiny-inspector",
      label: "i18n:tiny-inspector.open_panel",
      message: "open-panel"
    }
  ],
  messages: {
    "open-panel": {
      methods: [
        "openPanel"
      ]
    }
  },
  scene: {
    script: "dist/scene/index.js"
  }
};
const author = "Cocos Creator";
const editor = ">=3.4.0";
const scripts = {
  "panels:build": "cross-env NODE_ENV=development node scripts/panels.js",
  "common:build": "cross-env NODE_ENV=development node scripts/common.js"
};
var packageJSON = {
  package_version,
  version,
  name,
  description,
  main,
  dependencies,
  devDependencies,
  panels,
  contributions,
  author,
  editor,
  scripts
};
function isAllNodesPositionEqual(nodesInfo, dimension) {
  const allNodesPosition = nodesInfo.map((item) => item[dimension]);
  return isAllElementEqualArray(allNodesPosition);
}
function usePositionProperty() {
  const position = vue.reactive({ x: 0, y: 0, z: 0 });
  const nodesInfo = vue.ref([]);
  const xInputRef = vue.ref(null);
  const yInputRef = vue.ref(null);
  const zInputRef = vue.ref(null);
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
      const isAllXPositionEqual = isAllNodesPositionEqual(nodesInfoValue, "x");
      const isAllYPositionEqual = isAllNodesPositionEqual(nodesInfoValue, "y");
      const isAllZPositionEqual = isAllNodesPositionEqual(nodesInfoValue, "z");
      position.x = isAllXPositionEqual ? standardNodeInfo.x : DASH_SYMBOL;
      position.y = isAllYPositionEqual ? standardNodeInfo.y : DASH_SYMBOL;
      position.z = isAllZPositionEqual ? standardNodeInfo.z : DASH_SYMBOL;
    }
    if (xInputRef.value)
      xInputRef.value.$input.value = position.x;
    if (yInputRef.value)
      yInputRef.value.$input.value = position.y;
    if (zInputRef.value)
      zInputRef.value.$input.value = position.z;
  };
  const updateNodeInfo = async (uuid) => {
    const nodesInfoValue = nodesInfo.value;
    const nodeInfo = nodesInfoValue.find((item) => item.uuid === uuid);
    if (!nodeInfo)
      return;
    const node = await Editor.Message.request("scene", "query-node", uuid);
    const { x, y, z } = node.position.value;
    nodeInfo.x = x;
    nodeInfo.y = y;
    nodeInfo.z = z;
  };
  const setNodesInfo = async (uuids) => {
    if (uuids.length === 0) {
      nodesInfo.value = [];
      return;
    }
    const temp = [];
    for (const uuid of uuids) {
      const node = await Editor.Message.request("scene", "query-node", uuid);
      const { x, y, z } = node.position.value;
      const nodeInfo = { uuid, x, y, z };
      temp.push(nodeInfo);
    }
    nodesInfo.value = temp;
  };
  const updatePosition = async (uuids) => {
    await setNodesInfo(uuids);
    setPosition();
  };
  const setNodePositionOnScene = async (nodeInfo, dimension, dimensionValue) => {
    nodeInfo[dimension] = dimensionValue;
    const { uuid, x, y, z } = nodeInfo;
    const position2 = { x, y, z };
    const executeSceneScriptOption = {
      name: packageJSON.name,
      method: "setNodePosition",
      args: [uuid, position2]
    };
    await Editor.Message.request("scene", "execute-scene-script", executeSceneScriptOption);
  };
  const onPositionChange = async (dimension, event) => {
    const nodesInfoValue = nodesInfo.value;
    if (nodesInfoValue.length === 0)
      return;
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
const PositionProp = vue.defineComponent({
  name: "PositionProp",
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
    } = usePositionProperty();
    vue.watch(() => props.uuids, async () => {
      await updatePosition(props.uuids);
    }, {
      immediate: true
    });
    vue.onMounted(() => {
      initEventListener();
    });
    vue.onUnmounted(() => {
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
      Editor.Message.addBroadcastListener("scene:change-node", changeNodeHandler);
    }
    function removeEventListener() {
      Editor.Message.removeBroadcastListener("scene:change-node", changeNodeHandler);
    }
    return () => vue.createVNode("div", {
      "class": "pos"
    }, [vue.createVNode("div", {
      "class": "pos__label"
    }, [vue.createTextVNode("Position:")]), vue.createVNode("ul", {
      "class": "pos__fields"
    }, [vue.createVNode("li", {
      "class": "pos__field"
    }, [vue.createVNode("span", null, [vue.createTextVNode("x: ")]), vue.createVNode("ui-num-input", {
      "class": "pos__input",
      "ref": xInputRef,
      "step": "0.1",
      "value": position.x,
      "onchange": ($event) => onPositionChange("x", $event)
    }, null)]), vue.createVNode("li", {
      "class": "pos__field"
    }, [vue.createVNode("span", null, [vue.createTextVNode("y: ")]), vue.createVNode("ui-num-input", {
      "className": "pos__input",
      "ref": yInputRef,
      "step": "0.1",
      "value": position.y,
      "onchange": ($event) => onPositionChange("y", $event)
    }, null)]), vue.createVNode("li", {
      "class": "pos__field"
    }, [vue.createVNode("span", null, [vue.createTextVNode("z: ")]), vue.createVNode("ui-num-input", {
      "className": "pos__input",
      "ref": zInputRef,
      "step": "0.1",
      "value": position.z,
      "onchange": ($event) => onPositionChange("z", $event)
    }, null)])])]);
  }
});
const App = vue.defineComponent({
  name: "App",
  components: {
    PositionProp
  },
  setup() {
    const uuids = vue.ref([]);
    vue.onMounted(async () => {
      initSelectedNodesUUIDList();
      initEventListener();
    });
    vue.onUnmounted(() => {
      removeEventListener();
    });
    function initEventListener() {
      Editor.Message.addBroadcastListener("selection:select", updateUUIDList);
      Editor.Message.addBroadcastListener("selection:unselect", updateUUIDList);
    }
    function removeEventListener() {
      Editor.Message.removeBroadcastListener("selection:select", updateUUIDList);
      Editor.Message.removeBroadcastListener("selection:unselect", updateUUIDList);
    }
    function initSelectedNodesUUIDList() {
      updateUUIDList();
    }
    function updateUUIDList() {
      uuids.value = Editor.Selection.getSelected("node");
    }
    return () => vue.createVNode("div", {
      "class": "inspector"
    }, [vue.createVNode("header", {
      "class": "inspector__header"
    }, [vue.createTextVNode("Tiny Node Inspector")]), uuids.value.length > 0 ? vue.createVNode("main", {
      "class": "inspector__content"
    }, [vue.createVNode(PositionProp, {
      "uuids": uuids.value
    }, null)]) : vue.createVNode("div", {
      "class": "inspector__none"
    }, [vue.createTextVNode("You did not select any nodes")])]);
  }
});
function createApp() {
  const app = vue.createApp(App);
  return app;
}
var style = ".pos__item{display:flex}.pos__label{margin-right:10px}.pos__fields{display:flex}.pos__field{margin-right:10px}.pos__input{width:60px}\n";
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
  style,
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
