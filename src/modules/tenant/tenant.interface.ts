import { Gender } from "../../../prisma/generated/prisma/enums";

export interface IUser{
    name: string;
    email:string;
    password:string;
    profilePhoto?:string
    phoneNumber?:string
    gender?:Gender
}