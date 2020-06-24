const path = require('path')
const fs = require('fs').promises
const webpack = require('webpack')
const { srcPath, bundlePath } = require('./config.js')

function getEntryFilePath (libraryId) {
  return path.resolve(srcPath, `${libraryId}.js`)
}

function getBundlePath (libraryId) {
  return path.resolve(bundlePath, `${libraryId}.js`)
}

async function createEntryFile ({ libraryId, generator }) {
  await fs.writeFile(getEntryFilePath(libraryId), generator)
}

async function createEntryFiles (libraries) {
  return Promise.all(libraries.map(createEntryFile))
}

function createWebpackConfig (libraries) {
  const entry = {}

  libraries.forEach(({libraryId}) => {
    entry[libraryId] = getEntryFilePath(libraryId)
  })

  return {
    mode: 'development',
    entry,
    output: {
      filename: '[name].js',
      path: path.resolve(bundlePath)
    }
  }
}

async function createBundleFiles (libraries) {
  await createEntryFiles(libraries)
  const webpackConfig = createWebpackConfig(libraries)
  await webpack(webpackConfig).run()
}

module.exports = {
  createBundleFiles,
  getBundlePath
}
