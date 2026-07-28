import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentService } from './payment.service';
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';
import Stripe from "stripe";
import config from "../../config";

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await paymentService.createPayment(userId as string, req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Payment Create Successfully",
        data: {
            result
        }
    })
})
const stripe = new Stripe(config.stripe_secret_key as string, {
});
const handleStripeWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            config.stripe_webhook_secret as string
        );
    } catch (error: any) {
        console.error(" WEBHOOK SIGNATURE ERROR:", error.message);
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        console.log(" WEBHOOK EVENT RECEIVED:", event.type);

        if (event.type === "checkout.session.completed") {
            await paymentService.handleStripeWebhook(event);
        }

        res.status(200).json({ received: true });

    } catch (error: any) {
        console.error(" WEBHOOK PROCESSING ERROR:", error.message);
        res.status(500).json({ message: "Webhook processing failed" });
    }
};
export const paymentController = {
    createPayment,
    handleStripeWebhook
}