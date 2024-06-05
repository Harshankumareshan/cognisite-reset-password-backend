import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import crypto from 'crypto'

// Define the User schema
const userSchema = new mongoose.Schema({
  name : {
      type: String,
      required: [true, 'Please enter name']
  },
  email:{
      type: String,
      required: [true, 'Please enter email'],
      unique: true,
      
  },
  password: {
      type: String,
      required: [true, 'Please enter password'],
  },
  role :{
      type: String,
      default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date,
  createdAt :{
      type: Date,
      default: Date.now
  }
})
  const generateJwtToken=(id)=>{
    return jwt.sign(
        {id},
        'secretkey'
    )
  }
  userSchema.methods.getResetToken = function(){
    //Generate Token
    const token = crypto.randomBytes(20).toString('hex');

    //Generate Hash and set to resetPasswordToken
   this.resetPasswordToken =  crypto.createHash('sha256').update(token).digest('hex');

   //Set token expire time
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 10000;

    return token
}
  
  const User = mongoose.model('User', userSchema);
  export {User, generateJwtToken}