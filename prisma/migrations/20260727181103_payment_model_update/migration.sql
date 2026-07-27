/*
  Warnings:

  - Added the required column `meta` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "meta" JSONB NOT NULL;
