import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";
import { RequestStatus } from './../../../prisma/generated/prisma/enums';
import { title } from 'node:process';


const createRentalRequest = async (payload: IRentalRequest, tenantId: string) => {

    const properties = await prisma.properties.findUnique({
        where: {
            id: payload.propertyId,
        }
    })

    if (!properties) {
        throw new Error(
            "Property not found"
        );
    }

    if (!properties.isAvailable) {
        throw new Error(
            "Property is not available"
        );
    }
    if (properties.landlordId === tenantId) {
        throw new Error(
            "You cannot rent your own property"
        );
    }
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(
            "Invalid date time"
        );
    }

    if (startDate >= endDate) {
        throw new Error(
            "End date must be after start  date time"
        );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
        throw new Error("Started Date Cannot be In the past");
    };


    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            tenantId,
            propertyId: String(payload.propertyId),

            status: {
                in: [
                    RequestStatus.PENDING,
                    RequestStatus.APPROVED
                ]
            }
        }
    });

    if (existingRequest) {
        throw new Error(
            "You have already requested this property. Cancel and Approved the request first."
        );
    };

    const overLoppingRental = await prisma.rentalRequest.findFirst({
        where: {
            propertyId: payload.propertyId,
            status: RequestStatus.APPROVED,
            AND: [
                {
                    startDate: {
                        lte: endDate
                    },

                },
                {
                    endDate: {
                        gte: startDate
                    }
                }
            ]
        }
    })
    if (overLoppingRental) {
        throw new Error("Property is already Booked for the selected dates");

    }

    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            tenantId,
            propertyId: payload.propertyId,
            message: payload.message,
            startDate,
            endDate,

        },
        include: {
            properties: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,

                        }
                    },
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    })



    return rentalRequest;

}

const getAllRentalRequestTenat = async (tenantId: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id:tenantId
        }
    })
    if (!user) {
        throw new Error("User not found")
    }
    const result = await prisma.rentalRequest.findMany({
        where: {
           tenant:{
            id:tenantId
           }
        },
        include: {
            properties: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,

                        }
                    },
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }
        }
    })
    return result
}

const rentalRequestGetById = async (id: string) => {

    const result = await prisma.rentalRequest.findUnique({
        where: {
            id: id
        },
        include: {
            properties: {
                select: {
                    category: {
                        select: {
                            name: true
                        },
                        title: true,

                    },
                    landlord: {
                        select: {
                            role: true,
                            email: true,
                            name: true,

                        }
                    }
                }
            },

        }
    })
    return result;
}

export const renatalRequestService = {
    createRentalRequest,
    getAllRentalRequestTenat,
    rentalRequestGetById
}