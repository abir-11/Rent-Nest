import { Role } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IProperty } from "./properties.interface";


const createNewProperties = async (payload: IProperty) => {

    const {
        landlordId,
        categoryId,
        title,
        description,
        location,
        price,
        amenities,
        isAvailable,
    } = payload;

    const category=await prisma.category.findUnique({
        where:{
            id:categoryId
        }
    })


    const properties = await prisma.properties.create({
        data: {
            landlordId,
            categoryId,
            title,
            description,
            location,
            price,
            amenities,
            isAvailable,

        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    email: true
                }
            }
        }
    });

    return properties;
}


export const propertiesService = {
    createNewProperties
}