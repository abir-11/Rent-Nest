import { Router } from "express";
import { reviewController } from "./reviews.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router=Router();

router.post("/",auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),reviewController.createReviews);
router.get("/:id",reviewController.getByPropertyIdReviews)

export const reviewsRouter=router;