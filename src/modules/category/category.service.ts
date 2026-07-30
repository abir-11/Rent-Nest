import { error } from "node:console";
import { prisma } from "../../lib/prisma";
import { ICategory } from "./category.interface";


const createCategory = async (
  landlordId: string,
  payload: ICategory
) => {
  const { name, description } = payload;

  const existingLandlord = await prisma.user.findUnique({
    where: {
      id: landlordId, 
    },
  });

  if (!existingLandlord) {
    throw new Error("Landlord does not exist");
  }

  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      landlordId,
    },
  });

  if (existingCategory) {
    throw new Error("A category with this name already exists");
  }

  const category = await prisma.category.create({
    data: {
      name,
      description,
      landlordId,
    },
  });

  return category;
};

const getAllCategoris = async (landlordId: string) => {
  const result = await prisma.category.findMany({
    where: {
      landlordId
    },
    include: {
      properties: true,
    },
    orderBy:{
        createdAt:"desc"
    }
  });

  return result;
};

export const categoryService = {
    createCategory,
    getAllCategoris
}