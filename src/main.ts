import {NestFactory} from "@nestjs/core";
import session from "express-session";
import {AppModule} from "./app.module";
import connectRedis from "connect-redis";
import {redis} from "./redis";
import {ApolloServer} from "apollo-server-express";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
 
  await app.listen(3000, () => {
    console.log("server started on http://localhost:3000/graphql");
  });
} 
bootstrap();
