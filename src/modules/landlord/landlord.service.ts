// removed unused import
import { prisma } from "../../lib/prisma";
import { IProperty, IUpdateProperties } from "./landlord.interface";


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
        images
    } = payload;


    let imagesData: any = undefined;
    if (images !== undefined) {
        imagesData = typeof images === "string" ? [images] : images;
    }

    const category = await prisma.category.findUnique({
        where: {
            id: categoryId
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
            images:imagesData
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

const getLandlordRequest = async (userId: string) => {

    const result = await prisma.properties.findMany({
        where: {
            landlordId: userId
        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }

    });
    return result;
}

const updatelandlordProperties = async (id: string, landlordId: string, payload: IUpdateProperties, isAdmin: boolean) => {
    const { title,
        description,
        location,
        price,
        amenities,
        isAvailable,
        images
    } = payload
    const properties = await prisma.properties.findUnique({
        where: {
            id: id
        }
    })

    if (!isAdmin && properties?.landlordId !== landlordId) {
        throw new Error("You Cannot update the post");
    }

    // normalize images to the expected array/input shape for Prisma
    let imagesData: any = undefined;
    if (images !== undefined) {
        imagesData = typeof images === "string" ? [images] : images;
    }

    const updateProperties = await prisma.properties.update({
        where: {
            id: id
        },
        data: {
            title,
            description,
            location,
            price,
            amenities,
            isAvailable,
            images: imagesData
        }
    });

    return updateProperties;
}

const deletelandlordProperties = async (id: string, landlordId: string, isAdmin: boolean) => {

    const properties = await prisma.properties.findUnique({
        where: {
            id: id
        }
    })

    if (!isAdmin && properties?.landlordId !== landlordId) {
        throw new Error("You Cannot delete the post");
    }

    const deleteProperties = await prisma.properties.delete({
        where: {
            id: id
        }
    });

    return deleteProperties;
}

export const landlordService = {
    createNewProperties,
    getLandlordRequest,
    updatelandlordProperties,
    deletelandlordProperties
}