/*
  Warnings:

  - The values [COMPLETE] on the enum `RequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVED', 'COMPLETED');
ALTER TABLE "public"."rentalRequests" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "rentalRequests" ALTER COLUMN "status" TYPE "RequestStatus_new" USING ("status"::text::"RequestStatus_new");
ALTER TYPE "RequestStatus" RENAME TO "RequestStatus_old";
ALTER TYPE "RequestStatus_new" RENAME TO "RequestStatus";
DROP TYPE "public"."RequestStatus_old";
ALTER TABLE "rentalRequests" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
