const fs = require('fs').promises
const { parse, stringify } = require('remark')
const inject = require('mdast-util-inject')
const { readmePath, benchmarkSectionName } = require('./config.js')

function updateMarkdownSection ({
  originalContent = '',
  sectionName = '',
  sectionContent = ''
}) {
  const parsedOriginalContent = parse(originalContent)
  const parsedSectionContent = parse(sectionContent)
  inject(sectionName, parsedOriginalContent, parsedSectionContent)
  return stringify(parsedOriginalContent)
}

function generateBenchmarksContent (results) {
  // TODO generate table
  return 'benchmarks content'
}

async function updateMarkdownFile ({ results, filePath }) {
  const originalContent = await fs.readFile(readmePath)

  const sectionContent = generateBenchmarksContent(results)
  const newContent = updateMarkdownSection({
    originalContent,
    sectionContent,
    sectionName: benchmarkSectionName
  })

  // TODO update notes for each library

  await fs.writeFile(readmePath, newContent)
}

module.exports = {
  updateMarkdownFile
}
