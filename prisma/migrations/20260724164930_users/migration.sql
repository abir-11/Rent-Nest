/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "phoneNumber";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "phone",
ADD COLUMN     "phoneNumber" TEXT;
