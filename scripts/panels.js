const { resolve, join } = require('path')
const { readdirSync } = require('fs')
const { build } = require('vite')
const vue = require('@vitejs/plugin-vue')
const vueJsx = require('@vitejs/plugin-vue-jsx')

const panelsPath = resolve(__dirname, '../src/panels')
const panels = readdirSync(panelsPath)
const isDev = process.env.NODE_ENV === 'development'

if (panels.length < 1) {
  return
}

const generateBuildInput = () => {
  const ret = {}

  panels.forEach(panel => {
    if (!Reflect.has(ret, panel)) {
      const inputPath = join(panelsPath, panel)
      Reflect.set(ret, panel, inputPath)
    }
  })

  return ret
}

async function buildPanels() {
  try {
    await build({
      plugins: [vue(), vueJsx()],
      build: {
        rollupOptions: {
          input: generateBuildInput(),
          external: ['vue'],
          output: {
            format: 'cjs',
            entryFileNames: 'panels/[name].js'
          }
        },
        minify: !isDev,
        emptyOutDir: false
      }
    })

    console.log('build panels success.')
  } catch (e) {
    console.log('build panels failed.')
    process.exit(1)
  }
}

buildPanels().catch(e => {
  console.error(e)
})
