import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./reviews.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus from 'http-status';


const createReviews=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.user?.id;
    console.log(userId);
    const payload=req.body
    const reviews=await reviewService.createReviews(payload,userId as string);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"Review create successfully",
        data:{
            reviews
        }
    })
})

const getByPropertyIdReviews=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const propertyId=req.params?.id;
    const result=await reviewService.getByPropertyIdReviews(propertyId as string);
    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Reviews get by productId retrieved successfully",
        data:{
            count:result.length,
            reviewData:result
        }
    })

})

export const reviewController={
    createReviews,
    getByPropertyIdReviews
}