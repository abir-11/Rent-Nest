
import { RequestStatus, Role } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IProperty, IUpdateProperties, IUpdateRental } from "./landlord.interface";


const createNewProperties = async (
    userId: string,
    payload: IProperty
) => {
    const {
        categoryId,
        title,
        description,
        location,
        price,
        amenities,
        isAvailable,
        images,
    } = payload;


    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (
        user.role !== Role.ADMIN &&
        user.role !== Role.LANDLORD) {
        throw new Error("Unauthorized");
    }

    let imagesData: string[] | undefined = undefined;

    if (images !== undefined) {
        imagesData = Array.isArray(images) ? images : [images];
    }

    const category = await prisma.category.findFirst({
        where: {
            id: categoryId,
            landlordId: userId,
        },
    });

    if (!category) {
        throw new Error(
            "Category not found or you are not authorized to use this category."
        );
    }

    const property = await prisma.properties.create({
        data: {
            landlordId: userId,
            categoryId,
            title,
            description,
            location,
            price,
            amenities,
            isAvailable,
            images: imagesData,
        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return property;
};


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
        },
        orderBy:{
            createdAt:"desc"
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
        orderBy: {
            createdAt: "desc"
        }

    });

    return requests;
};

const updateLandlorRentalRequest = async (
    id: string,
    landlordId: string,
    payload: IUpdateRental
) => {
    const { status } = payload;

    const landLord = await prisma.rentalRequest.findFirst({
        where: {
            id,
            properties: {
                landlordId,
            },
        },
    });

    if (!landLord) {
        throw new Error("Unauthorized user");
    }

    if (landLord.status === RequestStatus.COMPLETED) {
        throw new Error("Completed rental request cannot be updated");
    }

    if (landLord.status === RequestStatus.ACTIVE) {
        throw new Error("Active rental request cannot be updated");
    }

    if (landLord.status !== RequestStatus.PENDING) {
        throw new Error("Rental request has already been processed");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updateRental = await tx.rentalRequest.update({
            where: {
                id,
            },
            data: {
                status,
                approvedAt:
                    status === RequestStatus.APPROVED ? new Date() : null,
                rejectedAt:
                    status === RequestStatus.REJECTED ? new Date() : null,
            },
            include: {
                properties: {
                    select: {
                        id: true,
                        title: true,
                        landlordId: true,
                    },
                },
                tenant: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (status === RequestStatus.APPROVED) {
            await tx.properties.update({
                where: {
                    id: landLord.propertyId,
                },
                data: {
                    isAvailable: false,
                },
            });
        }



        return updateRental;
    });

    return result;
};

export const landlordService = {
    createNewProperties,
    getLandlordRequest,
    updatelandlordProperties,
    deletelandlordProperties,
    getAllRentalRequest,
    updateLandlorRentalRequest
}