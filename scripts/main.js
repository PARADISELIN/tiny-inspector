const { resolve } = require('path')
const { build } = require('esbuild')

const isDev = process.env.NODE_ENV === 'development'

async function buildMain() {
  try {
    await build({
      entryPoints: [resolve(__dirname, '../src/main.ts')],
      outfile: 'dist/main.js',
      format: 'cjs',
      minify: !isDev
    })
  } catch (e) {
    console.log(e)
  }
}

buildMain().catch(e => {
  console.log(e)
  process.exit(1)
})
