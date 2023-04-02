const async = require('async')
const core = require('@actions/core')
const { randomUUID } = require('crypto')
const fs = require('fs/promises')
const glob = require('glob')
const https = require('https')
const fetch = require('node-fetch')
const tar = require('tar-stream')
const pack = tar.pack()

const main = async () => {
  try {
    // Grab all the inputs we need
    const adminUsername = core.getInput('admin_username', { required: true })
    const adminPassword = core.getInput('admin_password', { required: true })
    const endpoint = core.getInput('hdb_endpoint', { required: true })
    const projectName = core.getInput('project_name', { required: true })
    const cfDirectory = core.getInput('cf_directory', { required: true })
    let rejectUnauthorizedCerts = core.getInput('reject_unauthorized_certs', { required: true })
    rejectUnauthorizedCerts = rejectUnauthorizedCerts.toLowerCase() === 'true'
    const ENCODED_CREDENTIALS = Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64')

    // Change working directory
    process.chdir(cfDirectory)

    // Find all files (no directories) within the Custom Functions directory
    const files = await glob.glob('**/*.*', { nodir: true })
    console.log('Found a total of', files.length, 'files to add to the archive.')

    // Iterate through each file and add it to the archive
    await async.each(files, async (name) => {
      // Read the file contents
      pack.entry({ name }, await fs.readFile(name, 'utf-8'))
    })

    // Craft the deployment request
    const operation = {
      operation: 'deploy_custom_function_project',
      project: projectName,
      // `file` is required for HDB <4.0
      file: `/tmp/${randomUUID()}.tar`,
      payload: pack.read().toString('base64')
    }

    // Attempt to upload the package
    console.log('Deploying the project to HarperDB, please wait...')
    const request = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(operation),
      headers: {
        Authorization: `Basic ${ENCODED_CREDENTIALS}`,
        'Content-Type': 'application/json'
      },
      agent: new https.Agent({
        rejectUnauthorized: rejectUnauthorizedCerts
      })
    })
    const result = await request.json()

    // Display results of operation
    console.log(`Deployment has finished - ${result.error ? result.error : result.message}`)
    process.exit(result.error ? 1 : 0)
  } catch (error) {
    core.setFailed(error.message)
  }
}
main()
