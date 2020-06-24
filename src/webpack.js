const path = require('path')
const fs = require('fs').promises
const webpack = require('webpack')
const { srcPath, bundlePath, DEBUG } = require('./config.js')

function sanitizeFileName (fileName) {
  return fileName.replace(/\//g, '_')
}

function getEntryFilePath (libraryId) {
  return path.resolve(srcPath, `${sanitizeFileName(libraryId)}.js`)
}

function getBundlePath (libraryId) {
  return path.resolve(bundlePath, `${sanitizeFileName(libraryId)}.js`)
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
    entry[sanitizeFileName(libraryId)] = getEntryFilePath(libraryId)
  })

  return {
    mode: DEBUG ? 'development' : 'production',
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
