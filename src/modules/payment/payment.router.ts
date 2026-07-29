import { Router } from "express";
import { paymentController } from './payment.controller';
import { auth } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";


const router = Router();
router.post("/create", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), paymentController.createPayment);
router.post("/confirm",
    paymentController.handleStripeWebhook);

router.get('/',auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),paymentController.getPaymentUser)
router.get('/:id',auth(Role.ADMIN,Role.LANDLORD,Role.TENANT),paymentController.getSinglePayment)

export const paymentRouter = router;