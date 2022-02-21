import { defineComponent, onMounted, onUnmounted, ref } from 'vue'

import PositionProp from './components/PositionProp'

const App = defineComponent({
  name: 'App',

  components: {
    PositionProp
  },

  setup() {
    const uuids = ref<string[]>([])

    onMounted(async () => {
      initSelectedNodesUUIDList()
      initEventListener()
    })

    onUnmounted(() => {
      removeEventListener()
    })

    function initEventListener() {
      Editor.Message.addBroadcastListener('selection:select', updateUUIDList)
      Editor.Message.addBroadcastListener('selection:unselect', updateUUIDList)
    }

    function removeEventListener() {
      Editor.Message.removeBroadcastListener('selection:select', updateUUIDList)
      Editor.Message.removeBroadcastListener('selection:unselect', updateUUIDList)
    }

    // initialize selected nodes uuid list
    function initSelectedNodesUUIDList() {
      updateUUIDList()
    }

    function updateUUIDList() {
      uuids.value = Editor.Selection.getSelected('node')
    }

    return () => (
      <div class="inspector">
        <header class="inspector__header">Tiny Node Inspector</header>
        {uuids.value.length > 0 ? (
          <main class="inspector__content">
            <PositionProp uuids={uuids.value} />
          </main>
        ) : (
          <div class="inspector__none">You did not select any nodes</div>
        )}
      </div>
    )
  }
})

export default App
