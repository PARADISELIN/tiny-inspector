import { defineComponent, watch, onMounted, onUnmounted, PropType } from 'vue'

import usePositionProperty from './usePositionProperty'

const PositionProp = defineComponent({
  name: 'PositionProp',
  props: {
    uuids: {
      type: Array as PropType<string[]>,
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
    } = usePositionProperty()

    watch(
      () => props.uuids,
      async () => {
        await updatePosition(props.uuids)
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

    async function changeNodeHandler(uuid: string) {
      if (nodesInfo.value.length === 0) {
        return updatePosition([uuid])
      }

      await updateNodeInfo(uuid)
      setPosition()
    }

    function initEventListener() {
      Editor.Message.addBroadcastListener('scene:change-node', changeNodeHandler)
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('scene:change-node', changeNodeHandler)
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
              step="0.1"
              value={position.x}
              onchange={($event: any) => onPositionChange('x', $event)}
            />
          </li>
          <li class="pos__field">
            <span>y: </span>
            <ui-num-input
              className="pos__input"
              ref={yInputRef}
              step="0.1"
              value={position.y}
              onchange={($event: any) => onPositionChange('y', $event)}
            />
          </li>
          <li class="pos__field">
            <span>z: </span>
            <ui-num-input
              className="pos__input"
              ref={zInputRef}
              step="0.1"
              value={position.z}
              onchange={($event: any) => onPositionChange('z', $event)}
            />
          </li>
        </ul>
      </div>
    )
  }
})

export default PositionProp
