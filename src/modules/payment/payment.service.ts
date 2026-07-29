import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma"
import stripe from "../../lib/stripe";
import { ICreatePayment, IPaymentQuery } from "./payment.interface";



const createPayment = async (
    userId: string,
    payload: ICreatePayment,
) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId },
    });

    const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
        where: { id: payload.rentalRequestId },
        include: { properties: true },
    });

    const property = rentalRequest.properties;

    const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
    });

    const session = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: { name: property.title },
                    unit_amount: property.price * 100,
                },
                quantity: 1,
            },
        ],
        success_url: `${config.app_url}/payment?success=true`,
        cancel_url: `${config.app_url}/payment?success=false`,
        metadata: {
            userId: user.id,
            rentalRequestId: rentalRequest.id,
        },
    });


    const payment = await prisma.payment.create({
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
};
const handleStripeWebhook = async (event: Stripe.Event) => {
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;

        const transactionId = session.id;
        const rentalRequestId = session.metadata?.rentalRequestId;


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
                console.log("Payment is already marked as PAID.");
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

        });
    } else {
        console.log(`Unhandled event type: ${event.type}`);
    }
};


const getPayment = async (
    userId: string,
    query: IPaymentQuery
) => {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const skip = (page - 1) * limit;

    const where: any = {
        rentalRequest: {
            tenantId: userId,
        },
    };

    if (query.status) {
        where.status = query.status;
    }

    const payments = await prisma.payment.findMany({

        where: {
            rentalRequest: {
                tenantId: userId,
            },
        },

        include: {
            rentalRequest: {
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,

                    properties: {
                        select: {
                            id: true,
                            title: true,



                        },
                    },
                },
            },
        },

        orderBy: {
            createdAt: "desc",
        },

        skip,
        take: limit,

    });

    const total = await prisma.payment.count({
        where,
    });

    const formattedPayments = payments.map((payment) => ({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
        rentalRequest: payment.rentalRequest,
    }));

    return {
        meta: {
            page,
            limit,
            total,
        },
        data: formattedPayments,
    };

};

const getSinglePayment = async (
    tenantId: string,
    paymentId: string
) => {

    const payment = await prisma.payment.findUnique({
        where: {
            id: paymentId,
        },
        include: {
            rentalRequest: {
                select: {
                    id: true,
                    startDate: true,
                    endDate: true,
                    status: true,
                    tenantId:true
                    
                }
            }
        },
    });

    if (!payment) {
     throw new Error("Payment not found!!!")
    }

    if (payment.rentalRequest.tenantId !== tenantId) {
     throw new Error("user not found!!!")
    }

    return {
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,

        rentalRequest: {
            id: payment.rentalRequest.id,
            startDate: payment.rentalRequest.startDate,
            endDate: payment.rentalRequest.endDate,
        },
        
    };

};

export const paymentService = {
    createPayment,
    handleStripeWebhook,
    getPayment,
    getSinglePayment
}