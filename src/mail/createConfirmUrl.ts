import { v4 } from "uuid";
import { redis } from "../redis";

export const createConfirmUrl= async (userId:string)=> {
const token=v4();
redis.set(token,userId,"ex",60*60*24);//1 day expiration

// console.log(token);
 return `http://localhost:3000/${userId}/confirm/${token}`;
}
