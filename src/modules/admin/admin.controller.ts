import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import  httpStatus  from 'http-status';
import { sendResponse } from "../../utils/sendResponse";

const getAllUser=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const adminId=req.user?.id;
    console.log(adminId)
    const user=await adminService.getAllUser(adminId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All user get successfull",
        data:user
    })
})


export const adminController={
    getAllUser
}