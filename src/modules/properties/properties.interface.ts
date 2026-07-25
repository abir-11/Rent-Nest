import { Role } from "../../../prisma/generated/prisma/enums";

export interface IProperty {
    landlordId:string;
    categoryId: string;
    title: string;
    description: string;
    location: string;
    price: number;
    amenities: string[];
    isAvailable?: boolean;
}