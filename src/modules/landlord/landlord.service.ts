// removed unused import
import { prisma } from "../../lib/prisma";
import { IProperty, IUpdateProperties, IUpdateRental } from "./landlord.interface";


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
            images: imagesData
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


const getAllRentalRequest = async (propertyId: string, userId: string) => {

    const property = await prisma.properties.findFirst({
        where: {
            id: propertyId,
            landlordId: userId
        }
    })
    if (!property) {
        throw new Error("Property not found or unauthorized");

    }
    const requests = await prisma.rentalRequest.findMany({
        where: {
            propertyId: propertyId,
            properties: {
                landlordId: userId,
            },
        },
        include: {
            properties: {
                select: {
                    category: {
                        select: {
                            name: true,
                        }
                    },
                    title: true,
                    landlordId: true,
                    id: true
                },
            },
            tenant: {
                select: {
                    email: true,
                    name: true,
                    id: true
                }
            }
        },

    });

    return requests;
};

const updateLandlorRentalRequest = async (id: string, landlordId: string, payload: IUpdateRental) => {
    const { status } = payload;

    const landLord = await prisma.rentalRequest.findFirst({
        where: {
            id,
            properties: {
                landlordId
            }
        }
    })
    if (!landLord) {
        throw new Error("Unauthorized user");
    }

    const updateRental = await prisma.rentalRequest.update({
        where: {
            id: id
        },
        data: {
            status
        },
        include: {
            properties: {
                select: {
                    title: true,
                    landlordId: true,
                    id: true
                },
            },

            tenant: {
                select: {
                    email: true,
                    name: true,
                    id: true
                }
            },

        },

    })
    return updateRental;
}

export const landlordService = {
    createNewProperties,
    getLandlordRequest,
    updatelandlordProperties,
    deletelandlordProperties,
    getAllRentalRequest,
    updateLandlorRentalRequest
}