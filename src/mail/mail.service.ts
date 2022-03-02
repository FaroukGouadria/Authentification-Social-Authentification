import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as Mailgun from 'mailgun-js';
import { IMailGunData } from "./interfaces/mail.interface";
@Injectable()
export class MailService{
    private mg :Mailgun.Mailgun;
    constructor(
        private readonly configService:ConfigService
    ){
        this.mg=Mailgun({
            apiKey:this.configService.get<string>('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'),
            domain:this.configService.get<string>("mydomain.com"),
        });
    }

    send(data:IMailGunData):Promise<Mailgun.messages.SendResponse>{
        return new Promise((res,rej)=>{
            this.mg.messages().send(data, function(error,body){
                if(error){
                    rej(error);
                }
                res(body);
            });
        });

    }
}