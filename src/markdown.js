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

const tableHeaderAligns = {
  left: ':---',
  center: ':---:',
  right: '---:',
  none: '---'
}

function getTableHeaderAlign (align) {
  return tableHeaderAligns[align] || tableHeaderAligns['none']
}

function getTableHeader (data = []) {
  return [
    getTableRow(data.map(({header}) => header)),
    getTableRow(data.map(({align}) => getTableHeaderAlign(align)))
  ].join('\n')
}

function getTableBody (data = [[]], columns = []) {
  return data.map((rowData) => {
    const rowItems = columns.map(({content}) => content(rowData))
    return getTableRow(rowItems)
  }).join('\n')
}

function getTableRow (data = []) {
  return '| ' + data.join(' | ') + ' |'
}

function getLink (content, url) {
  return `[${content}](${url})`
}

function formatDate (input) {
  const date = new Date(input)
  return [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  ].join('-')
}

function formatBoolean (input) {
  return input
    ? '✅'
    : '❌'
}

const columns = [
  {
    header: 'library',
    align: 'left',
    content: (data) => getLink(data.packageInfo.id, data.packageInfo.homepage)
  },
  {
    header: 'unique',
    align: 'center',
    content: (data) => formatBoolean(data.benchmark.nonUnique === 0)
  },
  {
    header: 'matching',
    align: 'center',
    content: (data) => formatBoolean(data.benchmark.nonMatching === 0)
  },
  {
    header: 'average speed',
    align: 'right',
    content: (data) => data.benchmark.average.toFixed(3) + 'ms'
  },
  {
    header: 'longest selector',
    align: 'right',
    content: (data) => data.benchmark.longestSelector.length
  },
  {
    header: 'version',
    align: 'left',
    content: (data) => data.packageInfo.version
  },
  {
    header: 'last update',
    align: 'left',
    content: (data) => formatDate(data.packageInfo.lastUpdate)
  },
  // {
  //   header: 'license',
  //   align: 'left',
  //   content: (data) => data.packageInfo.license
  // }
]

function generateBenchmarksContent (results) {
  return [
    getTableHeader(columns),
    getTableBody(Object.values(results), columns)
  ].join('\n')
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
