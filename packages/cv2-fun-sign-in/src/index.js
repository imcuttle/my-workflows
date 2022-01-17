/**
 * cv2.fun 签到
 * @author imcuttle
 */
const axios = require('axios')
const FormData = require('form-data')
const cookieParser = require('set-cookie-parser')
const SocksProxyAgent = require('socks-proxy-agent')

const proxy = process.env.socks_proxy || process.env.all_proxy

const client = axios.create({
  baseURL: 'https://cv2.fun/',
  httpsAgent: proxy ? new SocksProxyAgent(proxy) : undefined
})

function login(email, password) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('passwd', password)
  formData.append('remember_me', 'on')
  return client
    .post(`/auth/login`, formData, {
      headers: formData.getHeaders()
    })
    .then((res) => {
      if (res.data.ret === 1) {
        return res.headers['set-cookie'].map((x) => cookieParser.parseString(x, { decodeValues: false }))
      }
      throw new Error(`login failed\n${JSON.stringify(res.data, null, 2)}`)
    })
}

function signIn() {
  return client.post(`/user/checkin`).then((res) => {
    if (res.data.ret === 1) {
      return true
    }
    throw new Error(`signIn failed\n${JSON.stringify(res.data, null, 2)}`)
  })
}

module.exports = async function cv2FunSignIn(email, password) {
  try {
    const cookies = await login(email, password)
    const cookie = cookies.reduce((acc, cookie) => acc.concat(`${cookie.name}=${cookie.value}`), []).join('; ')
    client.defaults.headers['cookie'] = cookie
    await signIn()
  } catch (err) {
    err.message = `cv2FunSignIn failed email: ${email}\n${err.message}`
    throw err
  }
}

module.exports.client = client
