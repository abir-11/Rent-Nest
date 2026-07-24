/*
  Warnings:

  - You are about to drop the column `isBanned` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BANNED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isBanned",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "bio" TEXT,
    "address" TEXT,
    "phoneNumber" TEXT,
    "gender" "Gender",
    "nationalId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nationalId_key" ON "profiles"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "profiles"("userId");

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
