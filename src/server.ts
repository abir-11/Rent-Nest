import "dotenv/config";
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";


const PROT = config.port;
async function main() {
    try {
        await prisma.$connect();
        console.log("connectes to the database");
        app.listen(PROT, () => {
            console.log(`server is running on port ${PROT}`)
        })
    } catch (error) {
        console.error("Error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main();