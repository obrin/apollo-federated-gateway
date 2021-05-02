
const axios = require('axios')
const promiseRetry = require('promise-retry')
const config = require('./config')

const checkConfig = {
  retries: 5,
  minTimeout: 1000
}

const serviceList = config.get('serviceList').map(service => {
  return `${service.url}/.well-known/apollo/server-health`
})

const check = () => {
  return Promise.all(
    serviceList.map(url => promiseRetry((retry) => axios.get(url).catch(retry), checkConfig))
  )
}

module.exports = {
  check
}
