import { Router } from "express";
import { categoryController } from "./category.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import { auth } from "../../middleware/auth";


const router=Router();


router.post('/category',auth(Role.LANDLORD,Role.ADMIN),categoryController.createCategory);
router.get('/category',auth(Role.LANDLORD,Role.ADMIN),categoryController.getAllCategoris);


export const catagoryRouter=router;