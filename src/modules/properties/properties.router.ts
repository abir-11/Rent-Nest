import { Router } from "express";
import { propertiesContorller } from "./properties.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router=Router();


router.post('/properties',auth(Role.LANDLORD,Role.ADMIN),propertiesContorller.createNewProperties);


export const propertiesRouter=router;