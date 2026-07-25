import { Router } from "express";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { landlordContorller } from "./landlord.controller";


const router=Router();


router.post('/properties',auth(Role.LANDLORD,Role.ADMIN),landlordContorller.createNewProperties);
router.get('/properties',auth(Role.LANDLORD,Role.ADMIN),landlordContorller.getLandlordRequest);
router.put('/properties/:id',auth(Role.LANDLORD,Role.ADMIN),landlordContorller.updatelandlordProperties);
router.delete('/properties/:id',auth(Role.LANDLORD,Role.ADMIN),landlordContorller.deletelandlordProperties);


export const landlordRouter=router;