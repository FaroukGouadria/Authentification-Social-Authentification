import { ApolloDriverConfig,ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
     MongooseModule.forRoot('mongodb://localhost/shopuim'),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    autoSchemaFile:true,
    driver: ApolloDriver,
  }),
  AuthModule,
  UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
