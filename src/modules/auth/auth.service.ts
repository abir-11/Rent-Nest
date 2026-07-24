import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { iDbUser } from "./auth.interface";
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";


const userLogin=async(payload:iDbUser)=>{
   const {email,password}=payload;
   const users=await prisma.user.findUniqueOrThrow({
    where:{
        email
    }

   })

   const isPasswordMase=await bcrypt.compare(password,users.password);
   if(!isPasswordMase){
    throw new Error("User password invalid!!")
   }

   const JwtPayload={
    id:users.id,
    name:users.name,
    email:users.email,
    role:users.role
   }

   const accessToken=jwtUtils.createToken(
    JwtPayload,
    config.jwt_access_secret,
    config.jwt_access_exprires_in as SignOptions
   )
   const refresToken=jwtUtils.createToken(
    JwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_exprires_in as SignOptions
   )
   return {
    accessToken,
    refresToken
   }
}
const refreshToken=async(refreshToken:string)=>{
const verifyRefreshToken=jwtUtils.verifyToken(refreshToken,config.jwt_refresh_secret);

if(!verifyRefreshToken.success){
 throw new Error(verifyRefreshToken.error)
}

const {id}=verifyRefreshToken.data as JwtPayload;

const user=await prisma.user.findUniqueOrThrow({
   where:{
      id
   }

})
if(user.status==="BANNED"){
   throw new Error("user has been banned");

}
const JwtPayload={
   id,
   name:user.name,
   email:user.email,
   role:user.role
}
const accessToken=jwtUtils.createToken(
   JwtPayload,
   config.jwt_access_secret,
   config.jwt_access_exprires_in as SignOptions
)
return {
   accessToken
}
}
export const authService={
    userLogin,
    refreshToken
}