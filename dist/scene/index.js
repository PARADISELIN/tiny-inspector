module.paths.push(require("path").join(Editor.App.path, "node_modules"));
exports.load = function() {
};
exports.unload = function() {
};
exports.methods = {
  setNodePosition(uuid, position) {
    const node = globalThis.cce.Node.query(uuid);
    node.setPosition(position.x, position.y, position.z);
  }
};
