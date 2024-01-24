/*
  Warnings:

  - Added the required column `bio` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactNumber` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeAddress` to the `Seller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "contactNumber" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "storeAddress" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
