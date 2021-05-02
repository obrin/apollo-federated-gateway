
const dotenv = require('dotenv')
const convict = require('convict');

dotenv.config()

// Define a schema
const config = convict({
  serviceList: {
    env: 'SERVICE_LIST',
    format: '*',
    default: [{"name":"account","url":"http://account-service.account-service.svc.cluster.local"}]
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 4000,
    env: 'PORT',
    arg: 'port'
  },
  jwt: {
    secret: {
      format: String,
      env: 'JWT_SECRET',
      default: 'secret'
    },
    algorithm: {
      format: String,
      env: 'JWT_ALGORITHM',
      default: 'HS256'
    }
  }
});

// parse json string
if (typeof config.get('serviceList') === 'string') {
config.set('serviceList', JSON.parse(config.get('serviceList')))
}

config.validate({ allowed: 'strict' })

module.exports = config