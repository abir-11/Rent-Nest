import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';


const userLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await authService.userLogin(req.body);
    const { accessToken, refresToken } = result;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refresToken", refresToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User login successfull",
        data: {
            accessToken,
            refresToken
        }
    })
})
const refreshToken=catchAsync(async(req:Request,res:Response)=>{
    const refreshToken=req.cookies.refreshToken;
    const {accessToken}=await authService.refreshToken(refreshToken);
    
    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"none",
        maxAge:1000*60*60*24
    })

    sendResponse(res,{
        success:true,
        statusCode:httpStatus.OK,
        message:"Token Refresh SuccessFully",
        data:{
            accessToken
        }
    })
})

export const authController = {
    userLogin,
    refreshToken
}