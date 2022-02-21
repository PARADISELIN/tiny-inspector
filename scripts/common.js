const { resolve } = require('path')
const { build } = require('esbuild')

const isDev = process.env.NODE_ENV === 'development'

const entryPoints = [
  resolve(__dirname, '../src/main.ts'),
  resolve(__dirname, '../src/scene/index.ts')
]

async function buildCommon() {
  try {
    await build({
      entryPoints,
      outdir: 'dist',
      format: 'cjs',
      minify: !isDev
    })

    console.log('build common scripts success.')
  } catch (e) {
    console.error('build common scripts failed.')
  }
}

buildCommon().catch(e => {
  console.error(e)
  process.exit(1)
})
