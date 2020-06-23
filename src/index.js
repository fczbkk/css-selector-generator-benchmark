const path = require('path')
const fs = require('fs').promises
const puppeteer = require('puppeteer')
const { getServer } = require('./../server/index.js')

const libraries = [
  {
    id: 'css-selector-generator',
    generator: '__generateCssSelector = CssSelectorGenerator.getCssSelector'
  }
]

async function getLibraryPath (libraryId) {
  const packageLibraryPath = path.resolve(__dirname, `../node_modules/${libraryId}`)
  const packageJsonPath = path.resolve(packageLibraryPath, `package.json`)
  const fileContent = String(await fs.readFile(packageJsonPath))
  const fileData = JSON.parse(fileContent)
  return path.resolve(packageLibraryPath, fileData.main)
}

async function runBenchmark ({ page, libraryId, generator }) {
  const libraryPath = await getLibraryPath(libraryId)
  await page.addScriptTag({
    path: libraryPath
  })

  page.on('console', msg => console.log(msg.text()))

  page.evaluate(generator)

  return await page.evaluate((generator) => {
    eval(generator)
    return ([...document.body.querySelectorAll('*')]).map((element) => {
      const startTime = Date.now()
      const selector = __generateCssSelector(element)
      const endTime = Date.now()
      const appliedSelector = document.body.querySelectorAll(selector)
      return {
        selector,
        isMatching: appliedSelector[0] === element,
        isUnique: appliedSelector.length === 1,
        duration: endTime - startTime
      }
    })
  }, generator)
}

async function getBenchmarkData ({ browser, port, libraryId, generator }) {
  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`, {})
  return await runBenchmark({ page, libraryId, generator })
}

(async () => {
  const { server, port } = await getServer()

  const browser = await puppeteer.launch()

  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`, {})

  const results = {}

  for (let i = 0; i < libraries.length; i++) {
    const {id: libraryId, generator} = libraries[i]
    const benchmarkData = await getBenchmarkData({ browser, port, libraryId, generator })

    const result = {
      slowest: -1,
      average: -1,
      median: -1,
      total: 0,
      longestSelector: '',
      allUnique: true,
      allMatching: true
    }

    benchmarkData.forEach(({selector, isMatching, isUnique, duration}) => {
      result.total += duration
      if (result.slowest < duration) {
        result.slowest = duration
      }
      if (result.longestSelector.length < selector.length) {
        result.longestSelector = selector
      }
      if (!isUnique) {
        result.allUnique = false
      }
      if (!isMatching) {
        result.allMatching = false
      }
    })

    result.average = result.total / benchmarkData.length

    const sortedDurations = benchmarkData
      .map(({duration}) => duration)
      .sort((a, b) => a - b)
    result.median = sortedDurations[Math.round(sortedDurations.length / 2)]

    results[libraryId] = result
  }

  console.log(results)

  await browser.close()
  server.close()
})()
