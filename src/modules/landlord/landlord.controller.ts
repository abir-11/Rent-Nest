import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import { landlordService } from "./landlord.service";


const createNewProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = {
        ...req.body,
        landlordId: userId
    };

    const properties = await landlordService.createNewProperties(payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Propersites Create successfull",
        data: {
            properties
        }
    })
})

const getLandlordRequest = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const result = await landlordService.getLandlordRequest(userId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Landlord get successfull",
        data: result
    })
})
const updatelandlordProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const id = req.params?.id;
    const payload = req.body;
    const result = await landlordService.updatelandlordProperties(id as string, landlordId as string, payload, isAdmin)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Landlord Update successfull",
        data: result
    })
})
const  deletelandlordProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN";
    const id = req.params?.id;
    const result = await landlordService.deletelandlordProperties(id as string, landlordId as string, isAdmin)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Landlord deleted successfull",
        data: {

        }
    })
})

export const landlordContorller = {
    createNewProperties,
    getLandlordRequest,
    updatelandlordProperties,
    deletelandlordProperties
}