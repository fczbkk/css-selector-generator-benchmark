const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function getPackageInfo (packageId) {
  const command = `npm view ${packageId} --json`
  const { stdout, stderr } = await exec(command)
  if (stderr) {
    throw stderr
  } else {
    const data = JSON.parse(stdout)
    const [, username, email] = /(.*) <(.*)>/.exec(data._npmUser)
    return {
      id: data.name,
      version: data.version,
      lastUpdate: data.time[data.version],
      homepage: data.homepage,
      license: data.license,
      description: data.description,
      username,
      email
    }
  }
}

module.exports = {
  getPackageInfo
}
