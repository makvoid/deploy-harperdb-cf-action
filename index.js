const core = require('@actions/core')
const glob = require('glob')

const main = async () => {
  try {
    // const adminUsername = core.getInput('admin_username', { required: true })
    // const adminPassword = core.getInput('admin_password', { required: true })
    const endpoint = core.getInput('hdb_endpoint', { required: true })
    const projectName = core.getInput('project_name', { required: true })

    console.log(endpoint, projectName)
    console.log(glob.GlobSync('*'))
  } catch (error) {
    core.setFailed(error.message)
  }
}
main()
