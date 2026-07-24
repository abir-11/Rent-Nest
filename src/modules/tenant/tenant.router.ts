import { Router } from "express";
import { tenantController } from "./tenant.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router=Router();

router.post("/register",tenantController.createUserDB);
router.get("/me",auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),tenantController.getMe);
router.put("/me/profile-update",auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),tenantController.updateMyProfiles);

export const tetantRouter=router;