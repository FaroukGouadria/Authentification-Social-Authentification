import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "./user.entity";
import {Model, Types} from "mongoose";
import {CreateUserInput, CreateUserInputSocial, UpdateUserInput} from "./user-input.dto";
import {GraphQLError} from "graphql";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {sendEmail} from "../mail/sendEmail";
import {createConfirmUrl} from "../mail/createConfirmUrl";
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name)private UserModel : Model<UserDocument>, private jwtService : JwtService) {}
  async createUser(createUserInput : CreateUserInput) {
    const isUser = await this.UserModel.findOne({email: createUserInput.email});
    try {
      if (isUser) {
        throw new GraphQLError("Nah bro you already exist");
      } else {
        createUserInput.password = await bcrypt.hash(createUserInput.password, 10).then((r) => r);

        const user= await new this.UserModel(createUserInput).save();
        await sendEmail(createUserInput.email, await createConfirmUrl(user._id.toString()));
        return "sign up success";
      }
    } catch (err) {
      console.error(err);
    }
    
  }
  async createUserSocial(CreateUserInputSocial : CreateUserInputSocial) {
    try {
      const isUser = await this.UserModel.findOne({email: CreateUserInputSocial.email});
      if (isUser) {
        throw new GraphQLError("Nah bro you already exist");
      } else {
        return await new this.UserModel(CreateUserInputSocial).save();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async login({password, email}) {
    try {
      const user = await this.UserModel.findOne({email});
      if (!user.isEmailConfirmed) {
        return "confirm your account please";
      }
      return user && (await bcrypt.compare(password, user.password))
        ? await this.jwtService.signAsync({email, _id: user._id})
        : new GraphQLError("Nah homie, wrong password/email");
    } catch (err) {
      console.error(err);
    }
  }

  async findAll() {
    try {
      return await this.UserModel.find().exec();
    } catch (err) {
      console.error(err);
    }
  }
  async updateUser(_id, updateUserInput : UpdateUserInput) {
    try {
      return await this.UserModel.findByIdAndUpdate(_id, updateUserInput, {new: true}).exec();
    } catch (err) {
      console.error(err);
    }
  }

  async updatePassword(_id, currPass, newPass) {
    try {
      const User = await this.UserModel.findById(_id);
      if (await bcrypt.compare(currPass, User.password)) {
        User.password = await bcrypt.hash(newPass, 10);
        return await new this.UserModel(User).save();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async findOne(_id : Types.ObjectId) {
    try {
      return await this.UserModel.findById(_id);
    } catch (err) {
      console.error(err);
    }
  }
  async findOneByEmail(email : string) {
    try {
      return await this.UserModel.findOne({email});
    } catch (err) {
      console.error(err);
    }
  }
  async remove(_id : string) {
    try {
      return await this.UserModel.findByIdAndRemove(_id);
    } catch (err) {
      console.error(err);
    }
    
  }

  async confirmUser(){
    const user= await this.UserModel.findOne()
  }


}
