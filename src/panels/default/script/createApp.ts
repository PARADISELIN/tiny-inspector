import { createApp } from 'vue'

import App from './App'

export default function () {
  const app = createApp(App)
  app.config.compilerOptions.isCustomElement = tag => tag.search('ui-') > -1
  return app
}
