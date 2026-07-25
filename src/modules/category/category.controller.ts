
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from './../../utils/catchAsync';
import { categoryService } from './category.service';
import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const category = await categoryService.createCategory(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Create successfull",
        data: {
            category
        }
    })
})

export const categoryController = {
    createCategory
}