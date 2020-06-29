const path = require('path')

const tempPath = path.resolve(__dirname, '../temp')
const srcPath = path.resolve(tempPath, 'src')
const bundlePath = path.resolve(tempPath, 'bundle')
const readmePath = path.resolve(__dirname, '../README.md')

const benchmarkSectionName = 'Benchmarks'

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
  },
  {
    libraryId: '@medv/finder',
    generator: `
      import {finder} from '@medv/finder'
      window.${generatorName} = finder
    `
  },
  {
    libraryId: 'optimal-select',
    generator: `
      import { select } from 'optimal-select'
      window.${generatorName} = select
    `
  },
  {
    libraryId: 'selector-query',
    generator: `
      import selectorQuery from 'selector-query'
      window.${generatorName} = selectorQuery
    `
  },
  // TODO figure out what is the problem with module's export
  // {
  //   libraryId: 'domtalk',
  //   generator: `
  //     import { getSelectorFromElement } from 'domtalk'
  //     window.${generatorName} = getSelectorFromElement
  //   `
  // },
    {
      libraryId: 'get-query-selector',
      generator: `
        import getQuerySelector from 'get-query-selector'
        window.${generatorName} = getQuerySelector
      `
    }
]

module.exports = {
  DEBUG,
  tempPath,
  srcPath,
  bundlePath,
  readmePath,
  generatorName,
  libraries,
  benchmarkSectionName
}
