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

const updateUserStatus = catchAsync(
    async (req: Request, res: Response) => {

        const adminId = req.user?.id as string;

        const { id } = req.params;

        const { status } = req.body;

        const result = await adminService.updateUserStatus(
            adminId,
            id as string,
            status
        );

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: `User status updated to ${status}`,
            data: result
        });
    }
);

const adminGetAllProperties=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const adminId=req.user?.id as string
    const result=await adminService.adminGetAllProperties(req.query,adminId);
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
});

const getAllRentalRequestAdmin = catchAsync(
    async (req: Request, res: Response) => {

        const adminId = req.user?.id as string;

        const result = await adminService.getAllRentalRequestAdmin(adminId);

        sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "All rental requests retrieved successfully",
            data: result,
        });
    }
);


export const adminController={
    getAllUser,
    updateUserStatus,
    adminGetAllProperties,
    getAllRentalRequestAdmin
}