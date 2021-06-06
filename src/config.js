
const dotenv = require('dotenv')
const convict = require('convict');

dotenv.config()

// Define a schema
const config = convict({
  serviceList: {
    env: 'SERVICE_LIST',
    format: '*',
    default: [
      {"name":"account","url":"http://sample-account-service.sample-account-service.svc.cluster.local"},
      {"name":"product","url":"http://sample-product-service.sample-product-service.svc.cluster.local"},
      {"name":"inventory","url":"http://sample-inventory-service.sample-inventory-service.svc.cluster.local"},
      {"name":"review","url":"http://sample-review-service.sample-review-service.svc.cluster.local"}
    ]
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