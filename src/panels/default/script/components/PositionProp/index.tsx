import { defineComponent, reactive, ref, watch, onMounted, onUnmounted, PropType } from 'vue'

import { isAllElementEqualArray } from '../../../../../utils'

const DASH_SYMBOL = '-'

export type Position = {
  x: number
  y: number
  z: number
}
export type NodeInfo = { uuid: string } & Position
type Dimension = 'x' | 'y' | 'z'
type InputEle = {
  $input: { value: number | string }
}
type IntegratedPosition = {
  ix: string | number
  iy: string | number
  iz: string | number
}

const PositionProp = defineComponent({
  name: 'position-item',
  props: {
    uuids: {
      type: Array as PropType<string[]>,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    const position = reactive({ x: 0, y: 0, z: 0 })
    const integratedPosition = reactive<IntegratedPosition>({
      ix: DASH_SYMBOL,
      iy: DASH_SYMBOL,
      iz: DASH_SYMBOL
    })
    const xInputRef = ref<InputEle | null>(null)
    const yInputRef = ref<InputEle | null>(null)
    const zInputRef = ref<InputEle | null>(null)
    const nodesInfo = ref<NodeInfo[]>([])

    watch(
      () => props.uuids,
      async () => {
        await handleUpdateNodesInfo()
      },
      {
        immediate: true
      }
    )

    onMounted(() => {
      initEventListener()
    })

    onUnmounted(() => {
      removeEventListener()
    })

    function initEventListener() {
      Editor.Message.addBroadcastListener('scene:change-node', updatePositionAfterChangeNode)
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('scene:change-node', updatePositionAfterChangeNode)
    }

    // handle 'ui-num-input' component change event
    async function onChange(dimension: Dimension, event: any) {
      const nodesInfoValue = nodesInfo.value

      if (nodesInfoValue.length === 0) return

      // set single node property
      if (nodesInfoValue.length === 1) {
        const nodeInfo = nodesInfoValue[0]
        const dimensionValue = event.target.value

        position[dimension] = dimensionValue
        await handleUpdateNodePosition(nodeInfo, dimension, dimensionValue)
      } else {
        const dimensionValue = event.target.value
        const key = ('i' + dimension) as keyof typeof integratedPosition

        if (Reflect.has(integratedPosition, key)) {
          integratedPosition[key] = dimensionValue
        }

        for (const nodeInfo of nodesInfoValue) {
          await handleUpdateNodePosition(nodeInfo, dimension, dimensionValue)
        }
      }
    }

    // update node information
    // trigger 'set-property' method in 'scene' extension
    async function handleUpdateNodePosition(
      nodeInfo: NodeInfo,
      dimension: Dimension,
      dimensionValue: number
    ) {
      nodeInfo[dimension] = dimensionValue

      const position = { x: nodeInfo.x, y: nodeInfo.y, z: nodeInfo.z }
      const executeSceneScriptOption = {
        name: 'tiny-inspector',
        method: 'setNodePosition',
        args: [nodeInfo.uuid, position]
      }
      await Editor.Message.request('scene', 'execute-scene-script', executeSceneScriptOption)
    }

    // update position(or integrated position) after 'change-node' in scene
    async function updatePositionAfterChangeNode(uuid: string) {
      const node = await Editor.Message.request('scene', 'query-node', uuid)
      const { x, y, z } = node.position.value
      const nodesInfoValue = nodesInfo.value

      nodesInfoValue.forEach((nodeInfo: NodeInfo) => {
        if (nodeInfo.uuid === uuid) {
          nodeInfo.x = x
          nodeInfo.y = y
          nodeInfo.z = z
        }
        setPositionInfo(nodesInfoValue)
      })
    }

    // when some nodes selected, this extension need to show nodes position
    async function handleUpdateNodesInfo() {
      const uuids = props.uuids

      if (uuids.length === 0) {
        nodesInfo.value = []
        return
      }

      const temp: NodeInfo[] = []
      for (const uuid of uuids) {
        const node = await Editor.Message.request('scene', 'query-node', uuid)
        const { x, y, z } = node.position.value
        const info = { uuid, x, y, z }
        temp.push(info)
      }
      nodesInfo.value = temp

      setPositionInfo(temp)
    }

    // set node information (position and integrated position)
    function setPositionInfo(nodesInfo: NodeInfo[]) {
      if (nodesInfo.length === 1) {
        // single selected node
        position.x = nodesInfo[0].x
        position.y = nodesInfo[0].y
        position.z = nodesInfo[0].z
      } else {
        // multiple selected nodes
        const isXAllEqual = isAllElementEqualArray(nodesInfo.map(item => item.x))
        const isYAllEqual = isAllElementEqualArray(nodesInfo.map(item => item.y))
        const isZAllEqual = isAllElementEqualArray(nodesInfo.map(item => item.z))

        integratedPosition.ix = isXAllEqual ? nodesInfo[0].x : DASH_SYMBOL
        integratedPosition.iy = isYAllEqual ? nodesInfo[0].y : DASH_SYMBOL
        integratedPosition.iz = isZAllEqual ? nodesInfo[0].z : DASH_SYMBOL

        setNumInputManually()
      }
    }

    // setting data directly is invalid, maybe is a bug
    // so we need a method to set value in UI by manually
    function setNumInputManually() {
      const DASH_SYMBOL = '-'

      if (xInputRef.value) {
        xInputRef.value.$input.value =
          integratedPosition.ix !== DASH_SYMBOL ? integratedPosition.ix : DASH_SYMBOL
      }
      if (yInputRef.value) {
        yInputRef.value.$input.value =
          integratedPosition.iy !== DASH_SYMBOL ? integratedPosition.iy : DASH_SYMBOL
      }
      if (zInputRef.value) {
        zInputRef.value.$input.value =
          integratedPosition.iz !== DASH_SYMBOL ? integratedPosition.iz : DASH_SYMBOL
      }
    }

    return () => (
      <div class="pos">
        <div class="pos__label">Position:</div>
        <ul class="pos__fields">
          <li class="pos__field">
            <span>x: </span>
            <ui-num-input
              class="pos__input"
              ref={xInputRef}
              preci="3"
              step="0.001"
              value={nodesInfo.value.length === 1 ? position.x : integratedPosition.ix}
              onchange={($event: any) => onChange('x', $event)}
            />
          </li>
          <li class="pos__field">
            <span>y: </span>
            <ui-num-input
              className="pos__input"
              ref={yInputRef}
              preci="3"
              step="0.001"
              value={nodesInfo.value.length === 1 ? position.y : integratedPosition.iy}
              onchange={($event: any) => onChange('y', $event)}
            />
          </li>
          <li class="pos__field">
            <span>z: </span>
            <ui-num-input
              className="pos__input"
              ref={zInputRef}
              preci="3"
              step="0.001"
              value={nodesInfo.value.length === 1 ? position.z : integratedPosition.iz}
              onchange={($event: any) => onChange('z', $event)}
            />
          </li>
        </ul>
      </div>
    )
  }
})

export default PositionProp
