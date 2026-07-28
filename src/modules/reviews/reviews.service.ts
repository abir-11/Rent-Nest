import { prisma } from "../../lib/prisma";
import { IReviews } from "./reviews.interface";


const createReviews = async (payload: IReviews, userId: string) => {
   const rental = await prisma.rentalRequest.findFirst({
  where: {
    tenantId: userId,
    propertyId: payload.propertyId,
    status: "COMPLETED",
  },
});

if (!rental) {
  throw new Error(
    "You can only review a property after completing its rental."
  );
}

const review = await prisma.review.create({
  data: {
    rating: payload.rating,
    comment: payload.comment,
    propertyId: payload.propertyId,
    userId,
  },
});

return review;
}


const getByPropertyIdReviews=async(propertyId:string)=>{
    const result=await prisma.review.findMany({
        where:{
            properties:{
                id:propertyId
            }
        },
        include:{
            properties:{
                select:{
                    id:true,
                    title:true,
                    category:{
                        select:{
                            name:true
                        }
                    }
                }
            }
        }
    });
    return result;
}


export const reviewService = {
    createReviews,
    getByPropertyIdReviews
}
