import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import {ConfigModule, ConfigService} from "@nestjs/config";
import { GoogleStrategy } from '../auth/strategy/google.strategy';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { ConfirmUserResolver } from './confirmRegister';

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
    ]),
  ],
  providers: [UserService, UserResolver,JwtStrategy,ConfirmUserResolver],
  exports:[UserService,UserModule]
})
export class UserModule {}
