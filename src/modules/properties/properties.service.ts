import { time } from "node:console";
import { PropertiesWhereInput } from "../../../prisma/generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IPropertiesQuery } from "./properties.interface"
import { title } from "node:process";

const getAllProperties = async (query: IPropertiesQuery) => {
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
const getPropertiesById=async(id:string)=>{
    const result=await prisma.properties.findUnique({
        where:{
            id:id
        }
    })
    return result;
}
export const propertiesService = {
    getAllProperties,
    getPropertiesById
}