import { Gender } from "../../../prisma/generated/prisma/enums";

export interface IUser{
    name: string;
    email:string;
    password:string;
    profilePhoto?:string
    phoneNumber?:string
    gender?:Gender
}

export interface IProfileUpdate{
    name?:string,
    profilePhoto?:string,
    bio?:string,
    address?:string,
    phoneNumber?:string
}