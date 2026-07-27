import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { renatalRequestService } from "./rental.service";
import { sendResponse } from "../../utils/sendResponse";
import  httpStatus  from 'http-status';


const  createRentalRequest=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const tenantId=req.user?.id
    const payload={
        ...req.body,
        tenantId
    }
    const result=await renatalRequestService.createRentalRequest(payload,tenantId as string);

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.CREATED,
        message:"rental Request  Create successfull",
        data:{
            result
        }
    })
})
const getAllRentalRequestTenat=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const tenantId=req.user?.id;
const rentalRequest=await renatalRequestService.getAllRentalRequestTenat(tenantId as string);

 sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Rental request retrieved successfully",
        data:{
            rentalRequest
        }
    })
});
const rentalRequestGetById=catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

const id=req.params?.id;
const rentalRequest=await renatalRequestService.rentalRequestGetById(id as string);

 sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Rental request get by id retrieved successfully",
        data:{
            rentalRequest
        }
    })
});


export const rentalRequestController={
    createRentalRequest,
    getAllRentalRequestTenat,
    rentalRequestGetById
}
