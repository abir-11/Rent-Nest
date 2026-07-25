import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";


const createCategory = async (payload: ICategory) => {

    const { name, description } = payload;
    const exsiting = await prisma.category.findUnique({
        where: {
            name
        }
    })

    if (exsiting) {
        throw new Error("Category all ready exists")
    }

    const category = await prisma.category.create({
        data: {
            name,
            description
        },

    })
    return category
}

export const categoryService = {
    createCategory
}