/**
 * cv2.fun 签到
 * @author imcuttle
 */
const core = require('@actions/core')
const main = require('./index')

async function run() {
  const email = core.getInput('email', { required: true })
  const password = core.getInput('password', { required: true })
  await main(email, password)
  core.info('签到成功')
}

run().catch((err) => {
  // console.error('err', err)
  core.setFailed(err)
})
