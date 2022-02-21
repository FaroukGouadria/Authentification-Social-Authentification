import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import {Model, Types} from "mongoose";
import { CreateUserInputSocial } from '../user/user-input.dto';
@Injectable()
export class AuthService {
    constructor(
         @Inject(forwardRef(() => UserService)) private userService: UserService,
    ){}
    async googleLogin(req) {
     if (!req.user) {
      return "no user from google ";
    }
   return await this.userService.createUserSocial(req.user)
}
}
