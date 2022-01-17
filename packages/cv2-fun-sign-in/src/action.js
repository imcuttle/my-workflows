/**
 * cv2.fun 签到
 * @author imcuttle
 */
const core = require('@actions/core')
const main = require('./index')

async function run() {
  const emails = core.getMultilineInput('emails', { required: true })
  const passwords = core.getMultilineInput('passwords', { required: true })

  await Promise.all(emails.map((email, i) => main(email, passwords[i])))
  core.info('签到成功')
}

run().catch((err) => {
  // console.error('err', err)
  core.setFailed(err)
})
