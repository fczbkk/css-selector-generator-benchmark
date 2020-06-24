const {
  DEBUG,
  generatorName,
  libraries,
  tempPath,
  bundlePath,
  srcPath
} = require('./config.js')
const { createBundleFiles, getBundlePath } = require('./webpack.js')
const path = require('path')
const fs = require('fs').promises
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const puppeteer = require('puppeteer')
const { getServer } = require('./../server/index.js')

async function generateBundle ({ id, generator }) {
  console.log(generator)
  return ''
}

async function getLibraryPath (libraryId) {
  const packageLibraryPath = path.resolve(__dirname, `../node_modules/${libraryId}`)
  const packageJsonPath = path.resolve(packageLibraryPath, `package.json`)
  const fileContent = String(await fs.readFile(packageJsonPath))
  const fileData = JSON.parse(fileContent)
  return path.resolve(packageLibraryPath, fileData.main)
}

async function runBenchmark ({ page, libraryId }) {
  await page.addScriptTag({
    path: getBundlePath(libraryId)
  })

  if (DEBUG) {
    page.on('console', msg => console.log(msg.text()))
  }

  return await page.evaluate((generatorName) => {
    return ([...document.body.querySelectorAll('*')]).map((element) => {
      const startTime = Date.now()
      const selector = window[generatorName](element)
      const endTime = Date.now()
      const appliedSelector = document.body.querySelectorAll(selector)
      return {
        selector,
        isMatching: appliedSelector[0] === element,
        isUnique: appliedSelector.length === 1,
        duration: endTime - startTime
      }
    })
  }, generatorName)
}

async function getBenchmarkData ({ browser, port, libraryId, generator }) {
  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`, {})
  return await runBenchmark({ page, libraryId, generator })
}

(async () => {
  await mkdirp(srcPath)
  await mkdirp(bundlePath)

  await createBundleFiles(libraries)

  const { server, port } = await getServer()

  const browser = await puppeteer.launch({ devtools: DEBUG })

  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`, {})

  const results = {}

  for (let i = 0; i < libraries.length; i++) {
    const { libraryId, generator } = libraries[i]

    const benchmarkData = await getBenchmarkData({
      browser,
      port,
      libraryId,
      generator
    })

    const result = {
      slowest: -1,
      average: -1,
      median: -1,
      total: 0,
      longestSelector: '',
      nonUnique: 0,
      nonMatching: 0,
      // data: benchmarkData
    }

    benchmarkData.forEach(({ selector, isMatching, isUnique, duration }) => {
      result.total += duration
      if (result.slowest < duration) {
        result.slowest = duration
      }
      if (result.longestSelector.length < selector.length) {
        result.longestSelector = selector
      }
      if (!isUnique) {
        result.nonUnique += 1
      }
      if (!isMatching) {
        result.nonMatching += 1
      }
    })

    result.average = result.total / benchmarkData.length

    const sortedDurations = benchmarkData
      .map(({ duration }) => duration)
      .sort((a, b) => a - b)
    result.median = sortedDurations[Math.round(sortedDurations.length / 2)]

    results[libraryId] = result
  }

  console.log(JSON.stringify(results, null, '  '))

  await browser.close()
  server.close()

  await rimraf(tempPath)
})()
