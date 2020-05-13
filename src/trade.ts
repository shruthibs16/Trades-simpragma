import { Request, Response } from "express";
//import { loggerMiddleware } from "./logger.middleware"
import * as mongoose from "mongoose";
import { Decimal128 } from "mongodb";

const uri: string = "mongodb://127.0.0.1:27017";

mongoose.connect(uri,  { useNewUrlParser: true,useUnifiedTopology:true },(err: any) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Successfully Connected!");
  }
});
const Schema = mongoose.Schema;


 const UserSchema = new Schema(
  {  
    "name": { type: String, required: true }
  })

 const TradeSchema = new Schema(
  {   
      "type": { type: String,enum: ["buy", "sell"], required: true },
      "user": { type:Schema.Types.ObjectId ,ref :"User",required: true},
      "symbol": { type: String, required: true },
      "shares": { type: Number, required: true },
      "price": { type: Decimal128, min: 130.42, max: 195.65 , required: true },
      "timestamp": { type: Date, required: true},
  })

export const Trade = mongoose.model("Trade",TradeSchema)
export const User = mongoose.model("User",UserSchema)

exports.default = {
  Trade: Trade ,
  User: User
}