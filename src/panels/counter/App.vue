<template>
  <div class="counter">
    <h1 class="counter__title">Counter: {{ count }}</h1>
    <div class="counter__buttons">
      <button @click="increase()">increase</button>
      <button @click="decrease()">decrease</button>
      <ui-code language="typescript">
        export const methods = {};

        export function data() {
        return {};
        }
      </ui-code>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Counter',
  setup() {
    const count = ref(0)

    const increase = () => {
      count.value++
    }

    const decrease = () => {
      count.value--
    }

    return {
      count,
      increase,
      decrease
    }
  }
})
</script>
