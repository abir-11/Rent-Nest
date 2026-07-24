import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { tetantRouter } from "./modules/tenant/tenant.router";
import { authRouter } from "./modules/auth/auth.router";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.get('/', async(req: Request, res: Response) => {
    res.send("Hello,world!");
})

app.use("/api/auth",tetantRouter);
app.use("/api/auth",authRouter)

export default app;