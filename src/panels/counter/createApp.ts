import { createApp } from 'vue'

import App from './App.vue'

export default function () {
  const app = createApp(App)
  app.config.compilerOptions.isCustomElement = tag => tag.startsWith('ui-')
  return app
}
