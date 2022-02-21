import { App } from 'vue'

import createApp from './createApp'

// @ts-ignore
import style from './style.scss?inline'

const weakMap = new WeakMap<any, App>()
/**
 * @zh 如果希望兼容 3.3 之前的版本可以使用下方的代码
 * @en You can add the code below if you want compatibility with versions prior to 3.3
 */
// Editor.Panel.define = Editor.Panel.define || function(options: any) { return options }
module.exports = Editor.Panel.define({
  listeners: {
    show() {
      console.log('show')
    },
    hide() {
      console.log('hide')
    }
  },
  template: '<div id="app"></div>',
  style: style,
  $: {
    app: '#app'
  },
  ready() {
    if (this.$.app) {
      const app = createApp()
      app.mount(this.$.app)
      weakMap.set(this, app)
    }
  },
  beforeClose() {},
  close() {
    const app = weakMap.get(this)
    if (app) {
      app.unmount()
    }
  },
  methods: {}
})
