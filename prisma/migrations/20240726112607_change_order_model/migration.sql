/*
  Warnings:

  - You are about to drop the column `teamPrice` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `teamSize` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryFee` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the column `deliveryRadius` on the `Seller` table. All the data in the column will be lost.
  - You are about to drop the `LiveStream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveStream" DROP CONSTRAINT "LiveStream_sellerId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "teamPrice",
DROP COLUMN "teamSize";

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "deliveryFee",
DROP COLUMN "deliveryRadius";

-- DropTable
DROP TABLE "LiveStream";

-- CreateTable
CREATE TABLE "DeliveryOption" (
    "sellerId" INTEGER NOT NULL,
    "minimumPrice" DOUBLE PRECISION NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "deliveryRadius" INTEGER NOT NULL,

    CONSTRAINT "DeliveryOption_pkey" PRIMARY KEY ("sellerId")
);

-- AddForeignKey
ALTER TABLE "DeliveryOption" ADD CONSTRAINT "DeliveryOption_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
