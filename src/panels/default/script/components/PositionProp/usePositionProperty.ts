import { reactive, ref } from 'vue'

import { isAllElementEqualArray } from '../../../../../utils'
import { DASH_SYMBOL } from '../../constants'

import packageJSON from '../../../../../../package.json'

type Dimension = 'x' | 'y' | 'z'
type DimensionValue = number | string
type InputElement = { $input: { value: number | string } }
type Position = Record<Dimension, DimensionValue>
type NodeInfo = { uuid: string } & Position

function isAllNodesPositionEqual(nodesInfo: NodeInfo[], dimension: Dimension): boolean {
  const allNodesPosition = nodesInfo.map(item => item[dimension])
  return isAllElementEqualArray(allNodesPosition)
}

export default function usePositionProperty() {
  const position = reactive<Position>({ x: 0, y: 0, z: 0 })
  const nodesInfo = ref<NodeInfo[]>([])

  const xInputRef = ref<InputElement | null>(null)
  const yInputRef = ref<InputElement | null>(null)
  const zInputRef = ref<InputElement | null>(null)

  const setPosition = () => {
    const nodesInfoValue = nodesInfo.value
    if (nodesInfoValue.length === 0) {
      return
    }

    const standardNodeInfo = nodesInfoValue[0]

    if (nodesInfoValue.length === 1) {
      position.x = standardNodeInfo.x
      position.y = standardNodeInfo.y
      position.z = standardNodeInfo.z
    } else {
      const isAllXPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'x')
      const isAllYPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'y')
      const isAllZPositionEqual = isAllNodesPositionEqual(nodesInfoValue, 'z')

      position.x = isAllXPositionEqual ? standardNodeInfo.x : DASH_SYMBOL
      position.y = isAllYPositionEqual ? standardNodeInfo.y : DASH_SYMBOL
      position.z = isAllZPositionEqual ? standardNodeInfo.z : DASH_SYMBOL
    }

    // hack: when value is string, 'reactive' doesn't work
    if (xInputRef.value) xInputRef.value.$input.value = position.x
    if (yInputRef.value) yInputRef.value.$input.value = position.y
    if (zInputRef.value) zInputRef.value.$input.value = position.z
  }

  const updateNodeInfo = async (uuid: string) => {
    const nodesInfoValue = nodesInfo.value
    const nodeInfo = nodesInfoValue.find(item => item.uuid === uuid)

    if (!nodeInfo) return

    const node = await Editor.Message.request('scene', 'query-node', uuid)
    const { x, y, z } = node.position.value
    nodeInfo.x = x
    nodeInfo.y = y
    nodeInfo.z = z
  }

  const setNodesInfo = async (uuids: string[]) => {
    if (uuids.length === 0) {
      nodesInfo.value = []
      return
    }

    const temp: NodeInfo[] = []
    for (const uuid of uuids) {
      const node = await Editor.Message.request('scene', 'query-node', uuid)
      const { x, y, z } = node.position.value
      const nodeInfo: NodeInfo = { uuid, x, y, z }
      temp.push(nodeInfo)
    }
    nodesInfo.value = temp
  }

  const updatePosition = async (uuids: string[]) => {
    await setNodesInfo(uuids)
    setPosition()
  }

  const setNodePositionOnScene = async (
    nodeInfo: NodeInfo,
    dimension: Dimension,
    dimensionValue: DimensionValue
  ) => {
    nodeInfo[dimension] = dimensionValue

    const { uuid, x, y, z } = nodeInfo
    const position: Position = { x, y, z }
    const executeSceneScriptOption = {
      name: packageJSON.name,
      method: 'setNodePosition',
      args: [uuid, position]
    }
    await Editor.Message.request('scene', 'execute-scene-script', executeSceneScriptOption)
  }

  const onPositionChange = async (dimension: Dimension, event: any) => {
    const nodesInfoValue = nodesInfo.value

    if (nodesInfoValue.length === 0) return

    const dimensionValue = event.target.value
    for (const nodeInfo of nodesInfoValue) {
      position[dimension] = dimensionValue
      await setNodePositionOnScene(nodeInfo, dimension, dimensionValue)
    }
  }

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
  }
}
