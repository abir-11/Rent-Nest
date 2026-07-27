import cron from "node-cron";
import { RequestStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const rentalCronJob = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Checking expired rentals...");

      const today = new Date();

      const expiredRentals = await prisma.rentalRequest.findMany({
        where: {
          status: RequestStatus.APPROVED,
          endDate: {
            lte: today,
          },
        },
      });

      for (const rental of expiredRentals) {
        await prisma.$transaction(async (tx) => {
          await tx.rentalRequest.update({
            where: {
              id: rental.id,
            },
            data: {
              status: RequestStatus.COMPLETE,
              completedAt: new Date(),
            },
          });

          await tx.properties.update({
            where: {
              id: rental.propertyId,
            },
            data: {
              isAvailable: true,
            },
          });
        });

        console.log(`Rental ${rental.id} completed`);
      }
    } catch (error) {
      console.error(error);
    }
  });
};