const path = require('path')
const puppeteer = require('puppeteer')
const { getServer } = require('./../server/index.js');

(async () => {
  const { server, port } = await getServer()

  const browser = await puppeteer.launch()

  const page = await browser.newPage()
  await page.goto(`http://localhost:${port}`, {})

  await page.addScriptTag({
    // TODO resolve path based on package.json content of "main"
    path: path.resolve(__dirname, '../node_modules/css-selector-generator/build/index.js')
  })

  const result = await page.evaluate(() => {
    const startTime = Date.now()

    const results = ([...document.body.querySelectorAll('*')]).map((element) => {
      const selector = CssSelectorGenerator.getCssSelector(element)
      const appliedSelector = document.body.querySelectorAll(selector)
      return {
        selector,
        isMatching: appliedSelector[0] === element,
        isUnique: appliedSelector.length === 1
      }
    })

    const endTime = Date.now()

    return {
      startTime,
      endTime,
      results
    }
  })

  console.log('result', result)

  await browser.close()
  server.close()
})()
