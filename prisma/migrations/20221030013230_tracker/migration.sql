/*
  Warnings:

  - Added the required column `phoneNumber` to the `Tracker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tracker" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL;
