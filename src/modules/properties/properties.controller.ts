import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { propertiesService } from "./properties.service";

const getAllProperties=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result=await propertiesService.getAllProperties(req.query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties all get successfull",
        data:result.data,
        meta:{
            ...result.meta,
            total:result.meta.totalPage
        }
    })
})
const getPropertiesById=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const id=req.params?.id;
    const result=await propertiesService.getPropertiesById(id as string);
     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Properties  get by single id successfull",
        data:{
            result
        }
       
    })
})


export const propertiesContorller = {
 getAllProperties,
 getPropertiesById
}