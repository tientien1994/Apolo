require('dotenv').config()

import express from 'express'
import _ from 'lodash'
import { ApolloServer } from 'apollo-server-express'
import path from 'path'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import cors from 'cors'
import { createServer } from 'http'
import mongoConnector from './mongoConnector'

const PORT = process.env.PORT
const graphqlEndpoint = '/g'
const subscriptionsEndpoint = '/subscriptions'

async function start() {

  console.log('----------------------------')
  console.log('Server started')
  console.log('----------------------------')

  const { mongo } = await mongoConnector()

  const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './schema')))
  const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers')))
  const executableSchema = makeExecutableSchema({ typeDefs, resolvers })

  const app = express()
  app.use(express.json())
  app.use(cors({ credentials: true, origin: '*' }))

  const httpServer = createServer(app)

  const apolloServer = new ApolloServer({
    schema: executableSchema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        endpoint: graphqlEndpoint,
        subscriptionEndpoint: subscriptionsEndpoint
      }),
    ],
    context: async ({ req }) => {
      return {
        mongo,
      }
    }
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    path: graphqlEndpoint,
    cors: true
  })

  const subscriptionServer = SubscriptionServer.create({
    schema: executableSchema,
    execute,
    subscribe,
    async onConnect({ }) {
      return {
        mongo,
      }
    }
  }, {
    server: httpServer,
    path: subscriptionsEndpoint,
  })

  process.on('uncaughtException', function (err) {
    console.log('process.on handler')
    console.log(err)
  })

  process.on('SIGTERM', function () {
    subscriptionServer.close()
    process.exit(1)
  })

  process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)")
    subscriptionServer.close()
    process.exit(1)
  })

  await new Promise(resolve => httpServer.listen(PORT, resolve))
  console.log(`API is running on localhost:${PORT}`)
}

start()