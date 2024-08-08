/*
  Warnings:

  - The primary key for the `DeliveryOption` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `id` to the `DeliveryOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DeliveryOption" DROP CONSTRAINT "DeliveryOption_pkey",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "DeliveryOption_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "DeliveryOption_sellerId_deliveryRadius_idx" ON "DeliveryOption"("sellerId", "deliveryRadius");
