import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {config} from "dotenv";
import {Strategy, VerifyCallBack} from "passport-google-oauth20";
config();
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor() {
    super({
      clientID: "971297163470-g50jvmb569bqq192v6gd232ic4k8tag5.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      scope: ["email", "profile"]
    });
  }
  async validate(accessToken : string, refreshToken : string, profile : any, done : VerifyCallBack): Promise<any> {
    const {name, emails, photos} = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken
    };

    done(null, user);
  }
}
