import { Router } from "express";
import { adminController } from "./admin.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";




const router=Router();

router.get("/users",auth(Role.ADMIN),adminController.getAllUser);
router.patch("/users/:id",auth(Role.ADMIN),adminController.updateUserStatus);
router.get("/properties",auth(Role.ADMIN),adminController.adminGetAllProperties);
router.get("/rentals",auth(Role.ADMIN),adminController.getAllRentalRequestAdmin
);
export const adminRouter=router;