import {Query, Args, Mutation, Resolver} from "@nestjs/graphql";
import {CreateUserInput, UpdateUserInput} from "./user-input.dto";
import {User} from "./user.entity";
import {UserService} from "./user.service";
import {Types} from "mongoose";
import {CurrentUser} from "./user.decorator";
import {GqlAuthGuard} from "../guards/uers.guard";
import {forwardRef, Inject, UseGuards} from "@nestjs/common";
import {AuthService} from "../auth/auth.service";
import { redis } from "../redis";
import  { User as user}  from "./user.entity";

@Resolver()
export class ConfirmUserResolver {
  constructor(private userService : UserService) {}

  @Mutation(() => Boolean)
  async confirmUser(@Args("token")token : string):Promise<boolean> {
    
    try {
        const userId=await redis.get(token);
       console.log(token)
      if(!userId){
          return false;
      }
      
      await this.userService.updateUser({_id:userId},{isEmailConfirmed:true});
      await redis.del(token);
      return true;
    } catch (err) {
      console.log(err);
    }
    
  }
  
}
