import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { schema } from './schema';
import { createContext } from './context';

const IS_DEV = process.env.NODE_ENV === 'development';
const localOrigins = [/^http:\/\/localhost:\d{4}$/];
const prodOrigins = [/^https:\/\/.*\.domain\.com$/];

dotenv.config();

const port = 4000;

async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    context: createContext,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });
  await server.start();
  app.use(cookieParser());

  server.applyMiddleware({
    app,
    cors: {
      origin: IS_DEV ? localOrigins : prodOrigins,
      credentials: true,
    },
  });
  await new Promise<void>((resolve) => {
    httpServer.listen({ port }, () => {
      console.log(`Server started on port ${port}`);
      resolve();
    });
  });
}

startApolloServer();
