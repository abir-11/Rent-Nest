-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "landlordId" TEXT;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
