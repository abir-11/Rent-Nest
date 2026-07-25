import { prisma } from "../../lib/prisma";
import { IRentalRequest } from "./rental.interface";
import { RequestStatus } from './../../../prisma/generated/prisma/enums';


const createRentalRequest = async (payload: IRentalRequest) => {
    const {
        propertyId,
        message,
        tenantId,
    } = payload;
    const existingRequest = await prisma.rentalRequest.findFirst({
        where: {
            propertyId: String(propertyId),
            tenantId,
            status: {
                in: ["PENDING"]
            }
        }
    });

    if (existingRequest) {
        throw new Error(
            "You have already requested this property. Cancel and Approved the request first."
        );
    }
    const rentalRequest = await prisma.rentalRequest.create({
        data: {
            propertyId: String(propertyId),
            message: String(message),
            tenantId: String(tenantId),
        },
        include: {
            properties: true,
            tenant: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true
                }
            }
        }
    })



    return rentalRequest;

}

const getAllRentalRequestTenat = async (tenantId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            id: tenantId
        }
    })
    if (!user) {
        throw new Error("User not found")
    }
    const result = await prisma.rentalRequest.findMany({
        where: {
            tenantId: tenantId
        },
        include: {
            properties: true,
            tenant: {
                select: {
                    role: true,
                    email: true,
                    name: true,
                    id: true
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
            properties: true,
            tenant: {
                select: {
                    role: true,
                    email: true,
                    name: true,
                    id: true
                }
            }
        }
    })
    return result;
}

export const renatalRequestService = {
    createRentalRequest,
    getAllRentalRequestTenat,
    rentalRequestGetById
}