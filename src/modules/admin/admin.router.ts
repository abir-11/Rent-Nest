import { Router } from "express";
import { adminController } from "./admin.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";




const router=Router();

router.get("/users",auth(Role.ADMIN),adminController.getAllUser);

export const adminRouter=router;