/*
  Warnings:

  - You are about to drop the column `trackerNumber` on the `Tracker` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tracker" DROP COLUMN "trackerNumber",
ADD COLUMN     "parcelId" TEXT;
