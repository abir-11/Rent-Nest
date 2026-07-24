import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status';


const userLogin=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const user=await authService.userLogin(req.body);
     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User login successfull",
        data:{
            user
        }
    })
})


export const authController={
    userLogin
}