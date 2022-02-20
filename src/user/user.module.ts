import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports:[
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService : ConfigService) => {
        return {secret: "secret"};
      },
      inject: [ConfigService]
    }),
    ConfigModule,
     MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ])
  ],
  providers: [UserService, UserResolver,JwtStrategy],
  exports:[UserService]
})
export class UserModule {}
