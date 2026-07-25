import { Router } from "express";
import { propertiesContorller } from "./properties.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router=Router();


router.get('/',propertiesContorller.getAllProperties);
router.get('/:id',propertiesContorller.getPropertiesById);


export const propertiesRouter=router;