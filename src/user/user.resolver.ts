import { Query,Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput, UpdateUserInput } from './user-input.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import {Types}from 'mongoose';
import { CurrentUser } from './user.decorator';
import { GqlAuthGuard } from '../guards/uers.guard';
import { UseGuards } from '@nestjs/common';
import { redis } from '../redis';
@Resolver()
export class UserResolver {
    constructor(
        private userService:UserService,
        
    ){}

    @Mutation(()=>String)
  async createUser(@Args('createUserInput') createUserInput:CreateUserInput){
    try{  
      return await this.userService.createUser(createUserInput)
    }catch(err){
      console.log(err);
    }
  }

    


   @Mutation(()=>String)
   async login (
        @Args('email') email:string,
        @Args('password') password:string,
   ){
     try{
       return await this.userService
       .login({email,password});
     }catch(err){console.log(err)}
   }

   @Query(()=>[User])
 @UseGuards(GqlAuthGuard)
   async findAllUsers(){
     try{
       return await this.userService.findAll()
     }catch(err){console.log(err)}
   }

    @Mutation(() => User)
     @UseGuards(GqlAuthGuard)
  async UpdateUserPass(
    @CurrentUser() user: User,
    @Args('currPass') currPass: string,
    @Args('newPass') newPass: string,
  ) {
    try {
      return await this.userService.updatePassword(user._id, currPass, newPass);
    } catch (err) {
      console.error(err);
    }
  }

  @Query(() => User)
@UseGuards(GqlAuthGuard)
  async findOne(@Args('_id', { type: () => String }) _id: Types.ObjectId) {
    return await this.userService.findOne(_id);
  }
@Mutation(() => User)
 @UseGuards(GqlAuthGuard)
  async UpdateUserInput(
    @CurrentUser() user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    try {
      return await this.userService.updateUser(user._id, updateUserInput);
    } catch (err) {
      console.error(err);
    }
  }
  @Mutation(() => User)
@UseGuards(GqlAuthGuard)
  async removeUser(@Args('_id') _id: string) {
    try {
      return await this.userService.remove(_id);
    } catch (err) {
      console.error(err);
    }
  }

  @Query(() => User)
 @UseGuards(GqlAuthGuard)
  async CurrentUser(@CurrentUser() user: User) {
    try {
      return await this.userService.findOne(user._id);
    } catch (err) {
      console.error(err);
    }
  }
  @Mutation(() => Boolean)
  async confirmUser(@Args("token")token : string,_id):Promise<boolean> {
    try {
        let userId = await redis.get(token);
        const user=await this.userService.findOne(_id);
        console.log(token);
      if(!userId){
          return false;
      }
      
      await this.userService.updateUser({_id:token},{isEmailConfirmed:true});
      await redis.del(token);
      return true;
    } catch (err) {
      console.log(err);
    }
  }
}
