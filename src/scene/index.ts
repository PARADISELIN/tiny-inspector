import type { Position } from '../panels/default/script/components/PositionProp/usePositionProperty'

module.paths.push(require('path').join(Editor.App.path, 'node_modules'))

exports.load = function () {}

exports.unload = function () {}

exports.methods = {
  setNodePosition(uuid: string, position: Position) {
    const node = (globalThis as any).cce.Node.query(uuid)
    node.setPosition(position.x, position.y, position.z)
  }
}
