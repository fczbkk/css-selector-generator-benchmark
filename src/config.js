const path = require('path')

const tempPath = path.resolve(__dirname, '../temp')
const srcPath = path.resolve(tempPath, 'src')
const bundlePath = path.resolve(tempPath, 'bundle')

const DEBUG = false

const generatorName = '__generateCssSelector'

const libraries = [
  {
    libraryId: 'css-selector-generator',
    generator: `
      import getCssSelector from 'css-selector-generator'; 
      window.${generatorName} = getCssSelector;
    `
  },
  {
    libraryId: 'simmerjs',
    generator: `
      import Simmer from 'simmerjs'
      window.${generatorName} = new Simmer()
    `
  }
]

module.exports = {
  DEBUG,
  tempPath,
  srcPath,
  bundlePath,
  generatorName,
  libraries
}
