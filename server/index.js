const path = require('path')
const express = require('express')
const getPort = require('get-port')
const cors = require('cors')

async function getServer () {
  const port = await getPort()

  const app = express()
  app.use(cors())
  app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './index.html')))

  const server = app.listen(port, () => console.log(`Server listening on port ${port}!`))

  return { port, server }
}

module.exports = {
  getServer
}
