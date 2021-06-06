const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
const express = require('express')
const cors = require('cors')
const expressJwt = require('express-jwt')
const { ApolloServer } = require('apollo-server-express')
const config = require('./config')
const { check } = require('./health-check')

const PORT = config.get('port')
const JWT_SECRET = config.get('jwt.secret')
const JWT_ALGORITHM = config.get('jwt.algorithm')

const forwardHeaders = [
  // Forward any cookies that the backends set.
  "Set-Cookie",
  "Authorization"
];

const serviceList = config.get('serviceList').map(service => {
  return {
    name: service.name,
    url: `${service.url}/graphql`
  }
})

const gateway = new ApolloGateway({
  serviceList,
  __exposeQueryPlanExperimental: false,
  buildService({name, url}) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, response, context}) {
        request.http.headers.set("account", context.account ? JSON.stringify(context.account) : null )

        forwardHeaders.forEach(name => {
          if (context.req?.get(name) != null) {
            request.http.headers.set(name, context.req?.get(name));
          }
      });
      }
    })
  }
})

;(async () => {

  try {
    // await check()

    const app = express()

    // app.use(cors({methods: ["GET", "POST", "OPTIONS"]}))
    app.use(
      expressJwt({
        secret: JWT_SECRET,
        algorithms: [JWT_ALGORITHM],
        credentialsRequired: false
      })
    )

    const server = new ApolloServer({
      gateway,
      engine: false,
      subscriptions: false,
      introspection: true,
      playground: true,
      context: ({ req }) => {
        const account = req.user || null
        return  { req, account }
      }
    })

    server.applyMiddleware({ app })

    // await server.start()

    app.listen({ port: PORT }, () => {
      console.log(`🚀 v1 Server ready at http://localhost:${PORT}:${server.graphqlPath}`)
    })
    
  } catch (err) {
    console.log('Unable to start apollo server', err)
    throw err
  }
})()
