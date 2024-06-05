import jwt from "jsonwebtoken"
import { User } from "../userSchema/userSchema.js";

const isAuthendicated = async (req,res,next)=>{
    let token ;
    if(req.headers){
        try {
            token = req.headers["token"];
            const decode = jwt.verify(token,'secretkey');
            req.user = await User.findById(decode.id).select("_id name");
            next()
        } catch (error) {
            return res.status(400).json({message:"invalid authorization"})
        }
    }
    if(!token){
        return res.status(400).json({message:"access Denied"})
    }
}

export {isAuthendicated}