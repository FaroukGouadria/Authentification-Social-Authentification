import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategy/google.strategy';
import { UserModule } from '../user/user.module';

@Module({ imports:[UserModule],
  providers: [AuthService,GoogleStrategy],
  controllers: [AuthController],
  exports:[UserModule],
})
export class AuthModule {}
