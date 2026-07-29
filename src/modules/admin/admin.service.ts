import { PropertiesWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IPropertiesQuery } from "./admin.interface";

const getAllUser = async (adminId: string) => {

    if (!adminId) {
        throw new Error("Admin ID is required");
    }

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    });

    if (!admin) {
        throw new Error("Admin user not found");
    }

    if (admin.role !== "ADMIN") {
        throw new Error(
            "You are not admin. Only admin can get all users"
        );
    }

    const users = await prisma.user.findMany({
        omit: {
            password: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return users;
};
const updateUserStatus = async (
    adminId: string,
    userId: string,
    status: "ACTIVE" | "BANNED"
) => {

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    });

    if (!admin) {
        throw new Error("Admin not found");
    }

    if (admin.role !== "ADMIN") {
        throw new Error(
            "You are not admin. Only admin can update user status"
        );
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (adminId === userId) {
        throw new Error("Admin cannot update own status");
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status
        },
        omit: {
            password: true
        }
    });

    return updatedUser;
};
const adminGetAllProperties = async (query: IPropertiesQuery,adminId:string) => {
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    });

    if (!admin) {
        throw new Error("Admin not found");
    }

    if (admin.role !== "ADMIN") {
        throw new Error(
            "You are not admin. Only admin can get user"
        );
    }






    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? query.sortBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";
    const addConditions: PropertiesWhereInput[] = [];
    if (query.searchTerm) {
        addConditions.push({
            OR: [
                {
                    title: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    },
                    location: {
                        contains: query.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
        })
    }

    if (query.title) {
        addConditions.push({
            title: query.title
        })
    }
    if (query.location) {
        addConditions.push({
            location: query.location
        })
    }
    if (query.price) {
        addConditions.push({
            price: Number(query.price)
        })
    }
    if (query.type) {
        addConditions.push({
            category: {
                is: {
                    name: query.type
                }
            }
        });
    }
    if (query.isAvailable) {
        addConditions.push({
            isAvailable: query.isAvailable
        })
    }
    if (query.amenities) {
        addConditions.push({
            amenities: query.amenities
        })
    }
    if (query.description) {
        addConditions.push({
            description: query.description
        })
    }
    if (query.categoryId) {
        addConditions.push({
            categoryId: query.categoryId
        })
    }
    if (query.id) {
        addConditions.push({
            id: query.id
        })
    }
    if (query.images) {
        addConditions.push({
            images: query.images
        })
    }
    if (query.landlord) {
        addConditions.push({
            landlord: query.landlord
        })
    }
    if (query.landlordId) {
        addConditions.push({
            landlordId: query.landlordId
        })
    }
    const result = await prisma.properties.findMany({
        where: {
            AND: addConditions
        },
        take: limit,
        skip: skip,
        orderBy: {
            [sortBy]: sortOrder
        },
        include: {
            category: true,
            landlord: {
                select: {
                    id: true,
                    email: true,
                    name: true
                }

            }
        }
    })
    const totalPropertiesCount = await prisma.properties.count({
        where: {
            AND: addConditions
        }
    })
    return {
        data: result,
        meta: {
            page: page,
            limit: limit,
            totalProterties: totalPropertiesCount,
            totalPage: Math.ceil(totalPropertiesCount / limit)
        }
    }
}
const getAllRentalRequestAdmin = async (adminId: string) => {

    if (!adminId) {
        throw new Error("Unauthorized. Please login first.");
    }

    // Check Admin
    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
        select: {
            id: true,
            role: true,
            status: true,
        },
    });

    if (!admin) {
        throw new Error("Admin not found");
    }

    if (admin.status === "BANNED") {
        throw new Error("Your account has been banned");
    }

    if (admin.role !== "ADMIN") {
        throw new Error("Only admin can access this resource");
    }

    // Admin can see all rental requests
    const result = await prisma.rentalRequest.findMany({
        include: {
            tenant: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            properties: {
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    landlord: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return result;
};

export const adminService={
    getAllUser,
    updateUserStatus,
    adminGetAllProperties,
    getAllRentalRequestAdmin
}