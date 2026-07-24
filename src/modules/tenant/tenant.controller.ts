import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { tenantService } from "./tenant.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status"

const createUserDB=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const result=await tenantService.createUserDB(req.body);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"User Create successfull",
        data:{
            result
        }
    })
})

const getMe=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.id;
    const user=await tenantService.getMe(userId as string);
     sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"User get me successfull",
        data:{
            user
        }
    })
    
})
const updateMyProfiles=catchAsync(async(req:Request,res:Response)=>{
    const updateMyProfiles=await tenantService.updateMyProfile(req.user?.id as string,req.body)

    sendResponse(res,{
         success: true,
        statusCode: httpStatus.OK,
        message: "User profile update successfully",
        data: {
            updateMyProfiles
        }
    })

})



export const tenantController={
    createUserDB,
    getMe,
    updateMyProfiles
}