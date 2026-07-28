import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import stripe from "../../lib/stripe";
import { ICreatePayment } from "./payment.interface";




const createPayment = async (
    userId: string,
    payload: ICreatePayment,
) => {

    const result = await prisma.$transaction(async (tx) => {

        const user = await tx.user.findUniqueOrThrow({
            where: {
                id: userId,
            },
        });



        const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
            where: {
                id: payload.rentalRequestId,
            },
            include: {
                properties: true
            }
        });
        const property = rentalRequest.properties;

        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: {
                userId: user.id,
            },
        });


        const session = await stripe.checkout.sessions.create({

            customer: customer.id,

            payment_method_types: [
                "card",
            ],

            mode: "payment",

            line_items: [
                {
                    price_data: {
                        currency: "bdt",
                        product_data: {
                            name: property.title,
                        },
                        unit_amount: property.price * 100,
                    },
                    quantity: 1,
                },
            ],


            success_url:
                `${config.app_url}/payment?success=true`,

            cancel_url:
                `${config.app_url}/payment?success=false`,


            metadata: {
                userId: user.id,
                rentalRequestId: rentalRequest.id,
            },

        });


        const payment = await tx.payment.create({

            data: {
                userId: user.id,
                rentalRequestId: rentalRequest.id,
                amount: property.price,
                method: "STRIPE",
                transactionId: session.id,
                status: "PENDING",
            },

        });


        return {
            payment,
            paymentUrl: session.url,
        };

    });


    return result;
};

const handleStripeWebhook = async (event: Stripe.Event) => {
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const transactionId = session.id;
        const rentalRequestId = session.metadata?.rentalRequestId;

        console.log("Transaction ID (Session):", transactionId);
        console.log("Rental Request ID (Metadata):", rentalRequestId);

        if (!transactionId || !rentalRequestId) {
            console.error(" Missing Stripe metadata. Cannot process payment.");
            return;
        }

        await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.findUnique({
                where: {
                    transactionId: transactionId,
                },
            });

            if (!payment) {
                console.error(` Payment not found for transactionId: ${transactionId}`);
                return;
            }

            if (payment.status === "PAID") {
                console.log("ℹPayment is already marked as PAID.");
                return;
            }

        
            await tx.payment.update({
                where: { transactionId },
                data: {
                    status: "PAID",
                    paidAt: new Date(),
                },
            });

        
            await tx.rentalRequest.update({
                where: { id: rentalRequestId },
                data: {
                    status: "ACTIVE",
                },
            });

            console.log(` Payment successful for Rental Request: ${rentalRequestId}`);
        });
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }
};




export const paymentService = {
    createPayment,
    handleStripeWebhook
}