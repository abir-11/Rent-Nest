import { Router } from "express";
import { rentalRequestController } from "./rental.controller";
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router=Router();

router.post('/',auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),rentalRequestController.createRentalRequest);
router.get('/',auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),rentalRequestController.getAllRentalRequestTenat);
router.get('/:id',auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),rentalRequestController.rentalRequestGetById);

export const rentalRequestRouter=router;