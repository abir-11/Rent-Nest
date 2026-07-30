import cookieParser from "cookie-parser";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { tetantRouter } from "./modules/tenant/tenant.router";
import { authRouter } from "./modules/auth/auth.router";
import { catagoryRouter } from "./modules/category/category.router";
import { propertiesRouter } from "./modules/properties/properties.router";
import { landlordRouter } from "./modules/landlord/landlord.router";
import { rentalRequestRouter } from "./modules/rental/rental.router";
import { reviewsRouter } from "./modules/reviews/reviews.router";
import { rentalCronJob } from "./modules/cron/rental.cron";
import { paymentRouter } from "./modules/payment/payment.router";
import { adminRouter } from "./modules/admin/admin.router";
import { notFound } from "./middleware/notFound";
import { globalErrorHandller } from "./middleware/globalErrorHandeller";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(
    "/api/payments/confirm",
    express.raw({ type: "application/json" })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get('/', async (req: Request, res: Response) => {
    res.send("Hello,world!");
})

app.use("/api/auth", tetantRouter);
app.use("/api/auth", authRouter);
app.use("/api", catagoryRouter);
app.use("/api/landlord", landlordRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/rentals", rentalRequestRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/admin",adminRouter);
rentalCronJob();
app.use(notFound);
app.use(globalErrorHandller);

export default app;