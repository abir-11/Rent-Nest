import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { propertiesService } from "./properties.service";


const createNewProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId=req.user?.id as string;
    const payload = {
        ...req.body,
        landlordId: userId
    };

    const properties = await propertiesService.createNewProperties(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Create successfull",
        data: {
            properties
        }
    })
})

export const propertiesContorller = {
    createNewProperties
}