import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import express from "express";
import fs from "fs";
import path from "path";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";

import createSeed from "./seeds";
import resolvers from "./resolvers";
import { getDynamicContext, getUserId } from "./utils";

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const prisma = new PrismaClient();
export const pubsub = new PubSub();

async function main() {
  await createSeed(prisma);

  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/subscription",
  });

  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx) => {
        const userAuth = await getDynamicContext({ ...prisma.user }, ctx);

        return {
          userAuth,
          pubsub,
        };
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: async ({ req }) => {
      const user =
        req && req.headers.authorization && (await getUserId(prisma.user, req));
      return {
        ...req,
        prisma,
        pubsub,
        userId: user ? user.userId : null,
        userRole: user ? user.userRole : null,
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  await new Promise((resolve) =>
    httpServer.listen({ port: process.env.PORT || 4001 }, resolve)
  );
  console.log(`???? Server ready at http://localhost:4001${server.graphqlPath}`);
}

main();
