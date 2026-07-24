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


export const tenantController={
    createUserDB
}