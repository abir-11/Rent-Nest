
import { NextFunction, Request, Response } from 'express';
import { catchAsync } from './../../utils/catchAsync';
import { categoryService } from './category.service';
import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';


const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId=req.user?.id as string
    const category = await categoryService.createCategory(landlordId,req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Categorty Create successfull",
        data: {
            category
        }
    })
})

const  getAllCategoris=catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const result=await categoryService.getAllCategoris(req.params?.landlordId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categorty all get successfull",
        data: {
            result
        }
    })
})

export const categoryController = {
    createCategory,
    getAllCategoris
}